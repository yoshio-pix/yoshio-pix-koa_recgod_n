/**-------------------------------------------
 * 受付システム
 * screens/RVW004.tsx
 * ---------------------------------------------*/
import Header from '../components/Header'; // Headerコンポーネントのインポート
import Footer from '../components/Footer'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle'; // 共通スタイル
import ProcessingModal from '../components/Modal';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import messages from '../utils/messages';
import {useAlert} from '../components/AlertContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator';
import {useButton} from '../hook/useButton.tsx';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
// RVW003 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'RVW004'>;
interface Props {
  navigation: NavigationProp;
}

const apiKey = 'AIzaSyB89faAwz8_2Y1LdNK9QLD0fk3Loa1Rgxw';
const sheetId = '1HfqNBnhfh8vYZnBXWwxKwqLqLGoaVS2MZy8h30yDPI4';
const sheetName = 'sheet1';
const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?valueRenderOption=FORMATTED_VALUE&key=${apiKey}`;

const RVW004 = ({navigation}: Props) => {
  const [isBtnEnabledBck, toggleButtonBck] = useButton(); //ボタン制御
  const [isBtnEnabledSnd, toggleButtonSnd] = useButton(); //ボタン制御
  const [company, setCompany] = useState<string>(''); //会社名
  const [driver, setDriver] = useState<string>(''); //運転手
  const [car, setCar] = useState<string>(''); //車両番号
  const [num, setNum] = useState<string>(''); //手配番号・発注番号
  const [tel, setTel] = useState<string>(''); //電話番号
  const [dest] = useState<string>(''); //行き先
  const [modalVisible, setModalVisible] = useState<boolean>(false); //処理中モーダルの状態
  const {showAlert, hideAlert} = useAlert(); // ← hideAlertも受け取る
  const [nums, setNums] = useState<string[]>([]);
  //const [res, setResponse] = useState<string[][]>();
  // useEffect フックを使用してステートが変更されるたびにチェック
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Googleスプレッドシートから取得
        const response = await axios.get(dataUrl);
        // responseまたはresponse.dataがundefinedの場合は処理を実行しない
        if (!response || !response.data || !response.data.values) {
          console.log('No response data available');
          //setResponse([[]]);
          return;
        }
        const values = response.data.values as string[][];

        let now = new Date();
        // const japanTimeOffset = 9 * 60 * 60 * 1000; // 9時間 * 60分
        const japanTime = new Date(now.getTime()); // + japanTimeOffset);
        now = japanTime;
        const year = now.getFullYear().toString().padStart(4, '0');
        const month = (now.getMonth() + 1).toString(); //.padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const filterDate = `${year}/${month}/${day}`;
        console.log(filterDate);
        // 今日の日付に一致する行のみをフィルタリング
        const filteredValues = values.filter((row: any[]) => {
          return filterDate === row[0]; // F列の日付を取得
        });

        //setResponse(filteredValues);
        // const {data} = res;
        const uniqueNums = Array.from(
          new Set(filteredValues.map((row: any[]) => row[1])),
        );

        //手配番号マップを作成
        setNums(uniqueNums);
        console.log(uniqueNums);
      } catch (e) {
        console.log('fetch data error', e);
      }
    };
    fetchData();
  }, []);
  // 送信ボタンのスタイルを動的に変更するための関数
  const getButtonStyle = () => {
    return tel === '' ||
      car === '' ||
      driver === '' ||
      company === '' ||
      num === ''
      ? // dest === ''
        [styles.button, styles.buttonBack, styles.disabledButton]
      : [styles.button, styles.buttonBack];
  };

  /************************************************
   * 戻るボタン
   ************************************************/
  const btnAppBack = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledBck) {
      return;
    } else {
      toggleButtonBck();
    }

    navigation.navigate('RVW001');
    return;
  };

  /************************************************
   * 送信ボタン
   ************************************************/
  const btnAppSend = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledSnd) {
      return;
    } else {
      toggleButtonSnd();
    }
    // モーダル表示
    setModalVisible(true);
    // API GatewayのエンドポイントURL

    try {
      const response = await axios.post(
        'https://bgfpljxx14.execute-api.ap-northeast-3.amazonaws.com/stage/pushReceptionRg1',
        {},
      );
      console.log('push通知完了:', response.data);
    } catch (error) {
      console.error('push通知エラー:', error);
    }

    try {
      await createReception();

      // モーダル表示OFF（任意）
      setModalVisible(false);

      // アラートを出しつつ、60秒後に自動で「はい」
      const alertPromise = showAlert('通知', messages.IA5004(), false); // キャンセル無し想定
      const timeoutId = setTimeout(() => {
        // 60秒経過で自動的に「はい」を押す扱い
        hideAlert(true, '', '');
        navigation.navigate('RVW001');
      }, 60000);

      const result = await alertPromise; // ユーザーが押す or 自動押下で解決
      clearTimeout(timeoutId);

      // 「はい」扱いのとき遷移（resultはtrue）
      if (result) {
        navigation.navigate('RVW001');
      }
    } catch (error) {
      console.error('API call error:', error);
    } finally {
      setModalVisible(false);
      toggleButtonSnd();
    }
  };

  /************************************************
   * 本部DB処理
   ************************************************/
  const createReception = async () => {
    const apiEndpoint =
      'https://p3kyn10w2h.execute-api.ap-northeast-3.amazonaws.com/stage/createReceptionRg1';

    // 送信するデータ
    const dataToSend = {
      company: company,
      driver: driver,
      car: car,
      tel: tel,
      dest: dest,
      ordno: num,
      // kyoten: kytn,
      proc: '0', //通知処理
      tsuchi_1: '0', //運輸
      tsuchi_2: '0', //保税
      tsuchi_3: '0', //第二
      tsuchi_4: '0', //岡本
      tsuchi_5: '0', //岡明
      flg: '1', //通知する
      // num: num,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST', // HTTPメソッド
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // データを文字列に変換してボディにセット
      });

      if (!response.ok) {
        throw new Error('API call failed: ' + response.status);
      }
      // レスポンスデータの取得と処理
      const responseData = await response.json();
      console.log('API call succeeded:', responseData);
      // レスポンスから "body" を取得し、JSON 文字列をパースする
      // const bodyObject = JSON.parse(responseData.body);
      // // "num" の値を取得
      // const new_num = bodyObject.num;
      // console.log('num:', new_num);
      // return new_num;
    } catch (error) {
      console.error('API call error:', error);
      // エラー処理（アラート表示など）
    } finally {
      toggleButtonSnd(); // ボタンの制御をリセット
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={'height'}
      style={styles.flex1} // KeyboardAvoidingView に flex: 1 を追加
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={[styles.containerWithKeybord, styles.flexGrow1]}>
        {/* ヘッダ */}
        <Header title={'トラック受付システム'} isRecieve={2} />

        {/* 中段 */}
        <View style={[styles.topContent, styles.center]}>
          <View style={[styles.tableMain, styles.marginBottom10]}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell2}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  会社名：
                </Text>
              </View>
              <View style={styles.tableCell3}>
                <TextInput
                  maxLength={30}
                  onChangeText={(text: string) => setCompany(text)}
                  value={company}
                  style={[styles.input]}
                />
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell2}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  車両番号：
                </Text>
              </View>
              <View style={styles.tableCell3}>
                <TextInput
                  keyboardType="numeric"
                  maxLength={4}
                  onChangeText={(text: string) => setCar(text)}
                  value={car}
                  style={[styles.input]}
                />
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell2}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  運転手：
                </Text>
              </View>
              <View style={styles.tableCell3}>
                <TextInput
                  maxLength={30}
                  onChangeText={(text: string) => setDriver(text)}
                  value={driver}
                  style={[styles.input]}
                />
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell2}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  電話番号：
                </Text>
              </View>
              <View style={styles.tableCell3}>
                <TextInput
                  keyboardType="numeric"
                  maxLength={13}
                  onChangeText={(text: string) => setTel(text)}
                  value={tel}
                  style={[styles.input]}
                />
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell2}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  手配発注番号：
                </Text>
              </View>
              <View style={[styles.tableCell3, styles.pickerStyle]}>
                <Picker
                  selectedValue={num}
                  onValueChange={itemValue => setNum(itemValue)}
                  style={[styles.labelText, styles.pickerText]}>
                  <Picker.Item
                    style={styles.labelText}
                    key=""
                    label=""
                    value=""
                  />
                  {nums.map(selectNum => (
                    <Picker.Item
                      style={styles.labelText}
                      label={selectNum}
                      value={selectNum}
                      key={selectNum}
                    />
                  ))}
                </Picker>
              </View>
            </View>
            {/* <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  行き先：
                </Text>
              </View>
              <View style={styles.tableCell2}>
                <TextInput
                  maxLength={30}
                  onChangeText={(text: string) => setDest(text)}
                  value={dest}
                  style={[styles.input]}
                />
              </View>
            </View> */}
          </View>
        </View>
        {/* <View style={styles.flexGrow1} /> */}
        {/* 下段 */}
        <View style={[styles.bottomSection, styles.bottomSectionMargin]}>
          <TouchableOpacity
            disabled={!isBtnEnabledBck}
            style={[styles.button, styles.buttonBack]}
            onPress={btnAppBack}>
            <Text style={styles.buttonText}>戻る</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              !isBtnEnabledSnd ||
              tel === '' ||
              car === '' ||
              driver === '' ||
              company === '' ||
              num === ''
              // dest === ''
            }
            style={getButtonStyle()}
            onPress={btnAppSend}>
            <Text style={styles.buttonText}>送信</Text>
          </TouchableOpacity>
        </View>

        {/* フッタ */}
        <Footer />

        {/* 処理中モーダル */}
        <ProcessingModal
          visible={modalVisible}
          message={messages.IA5003()}
          onClose={() => setModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default RVW004;
