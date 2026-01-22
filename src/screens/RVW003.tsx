/**-------------------------------------------
 * 受付システム
 * screens/RVW003.tsx
 * ---------------------------------------------*/
import Header from '../components/Header'; // Headerコンポーネントのインポート
import Footer from '../components/Footer'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle'; // 共通スタイル
import ProcessingModal from '../components/Modal';
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import messages from '../utils/messages';
import {useAlert} from '../components/AlertContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator';
import {useButton} from '../hook/useButton.tsx';
import axios from 'axios';
// RVW003 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'RVW003'>;
interface Props {
  navigation: NavigationProp;
}
const apiKey = 'AIzaSyB89faAwz8_2Y1LdNK9QLD0fk3Loa1Rgxw';
const sheetId = '1Eq4dpqSKg7YVByj5N4DKlvMFpASK_KDkMek2GPc1N94';
const sheetName = 'プルダウン用';

const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?valueRenderOption=FORMATTED_VALUE&key=${apiKey}`;

const RVW003 = ({navigation}: Props) => {
  const [isBtnEnabledNew, toggleButtonNew] = useButton(); //ボタン制御
  const [isBtnEnabledBck, toggleButtonBck] = useButton(); //ボタン制御
  const [isBtnEnabledSnd, toggleButtonSnd] = useButton(); //ボタン制御
  const [company, setCompany] = useState<string>(''); //会社名
  const [driver, setDriver] = useState<string>(''); //運転手
  const [car, setCar] = useState<string>(''); //車両番号
  const [tel, setTel] = useState<string>(''); //電話番号
  const [dest, setDest] = useState<string>(''); //行き先
  const [modalVisible, setModalVisible] = useState<boolean>(false); //処理中モーダルの状態
  const [companies, setCompanies] = useState<string[]>([]);
  // const [drivers, setDrivers] = useState<string[]>([]);
  const [cars, setCars] = useState<string[]>([]);
  const {showAlert} = useAlert();
  const [res, setResponse] = useState<string[][]>();
  // useEffect フックを使用してステートが変更されるたびにチェック
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Googleスプレッドシートから取得
        const response = await axios.get(dataUrl);
        // responseまたはresponse.dataがundefinedの場合は処理を実行しない
        if (!response || !response.data || !response.data.values) {
          console.log('No response data available');
          setResponse([[]]);
          return;
        }
        const values = response.data.values as string[][];

        let now = new Date();
        // const japanTimeOffset = 9 * 60 * 60 * 1000; // 9時間 * 60分
        const japanTime = new Date(now.getTime()); // + japanTimeOffset);
        now = japanTime;
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const filterDate = `${month}-${day}`;
        console.log(filterDate);
        // 今日の日付に一致する行のみをフィルタリング
        const filteredValues = values.filter((row: any[]) => {
          return filterDate === row[5]; // F列の日付を取得
        });

        setResponse(filteredValues);
        // const {data} = res;
        const uniqueCompanies = Array.from(
          new Set(filteredValues.map((row: any[]) => row[0])),
        );
        //会社マップを作成
        setCompanies(uniqueCompanies);
        console.log(uniqueCompanies);
      } catch (e) {
        console.log('fetch data error', e);
      }
    };
    fetchData();
  }, []);

  //会社マップが選択された際の車両番号マップ作成
  const updateCars = useCallback(
    (companyName: string) => {
      if (res) {
        const filteredRows = res.filter((row: any[]) => row[0] === companyName);
        // const driverNames = filteredRows.map((row: any[]) => row[1]);
        // setDrivers(driverNames);
        const carNums = filteredRows.map((row: any[]) => row[2]);
        setCars(carNums);
      }
    },
    [res],
  );

  //会社マップ選択をキャッチ
  useEffect(() => {
    if (company) {
      updateCars(company);
    }
  }, [company, updateCars]); // updateDriversを依存関係に追加

  //運転手マップが選択された際の車両番号・電話番号・行先設定
  const updateDrivers = useCallback(() => {
    if (!res) {
      return;
    }
    const filteredRows1 = res.find(
      (row: any[]) => row[0] === company && row[2] === car,
    );
    if (filteredRows1 && filteredRows1[1]) {
      setDriver(filteredRows1[1]); // B列の値をセット
    } else {
      setDriver(''); // 該当する行がない場合は空にする
    }
    const filteredRows2 = res.find(
      (row: any[]) => row[0] === company && row[2] === car,
    );
    if (filteredRows2 && filteredRows2[3]) {
      setTel(filteredRows2[3]); // D列の値をセット
    } else {
      setTel(''); // 該当する行がない場合は空にする
    }
    const filteredRows3 = res.find(
      (row: any[]) => row[0] === company && row[2] === car,
    );
    if (filteredRows3 && filteredRows3[4]) {
      setDest(filteredRows3[4]); // E列の値をセット
    } else {
      setDest(''); // 該当する行がない場合は空にする
    }
  }, [res, company, car]);

  //運転手マップ選択をキャッチ
  useEffect(() => {
    if (company && car) {
      updateDrivers();
    }
  }, [company, car, updateDrivers]);

  // 送信ボタンのスタイルを動的に変更するための関数
  const getButtonStyle = () => {
    return tel === '' || car === '' || driver === '' || company === ''
      ? // dest === ''
        [styles.button, styles.buttonBack, styles.disabledButton]
      : [styles.button, styles.buttonBack];
  };

  /************************************************
   * 新規作成ボタン
   ************************************************/
  const btnNew = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledNew) {
      return;
    } else {
      toggleButtonNew();
    }

    navigation.navigate('RVW004');
    return;
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
        'https://1ge2edaws9.execute-api.ap-northeast-1.amazonaws.com/stage/pushReception3',
        {},
      );
      console.log('push通知完了:', response.data);
    } catch (error) {
      console.error('push通知エラー:', error);
    }

    try {
      await createReception();
      // モーダル表示
      setModalVisible(false);
      await showAlert('通知', messages.IA5004(), false);
      // 成功したら、別の画面にナビゲート
      navigation.navigate('RVW001');
    } catch (error) {
      console.error('API call error:', error);
      // エラー処理（アラート表示など）
    } finally {
      // モーダル表示
      setModalVisible(false);
      toggleButtonSnd(); // ボタンの制御をリセット
    }
  };

  /************************************************
   * 本部DB処理
   ************************************************/
  const createReception = async () => {
    const apiEndpoint =
      'https://vfw5stw4l4.execute-api.ap-northeast-1.amazonaws.com/stage/createReception3';

    // 送信するデータ
    const dataToSend = {
      company: company,
      driver: driver,
      car: car,
      tel: tel,
      dest: dest,
      // kyoten: kytn,
      proc: '0', //通知処理
      tsuchi_1: '0', //本社
      tsuchi_2: '0', //岡セラ
      tsuchi_3: '0', //大ヶ池
      flg: '1', //通知する
      // num: num,
    };

    try {
      //本社
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
          <View style={[styles.tableMainRecept, styles.marginBottom10]}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  会社名：
                </Text>
              </View>
              <View style={[styles.tableCell2, styles.pickerStyle]}>
                <Picker
                  selectedValue={company}
                  onValueChange={itemValue => setCompany(itemValue)}
                  style={[styles.labelText, styles.pickerText]}>
                  <Picker.Item
                    style={styles.labelText}
                    key=""
                    label=""
                    value=""
                  />
                  {companies.map(comp => (
                    <Picker.Item
                      style={styles.labelText}
                      label={comp}
                      value={comp}
                      key={comp}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.tableCell3}>
                <TouchableOpacity
                  disabled={!isBtnEnabledBck}
                  style={[styles.buttonMiddle, styles.buttonBack]}
                  onPress={btnNew}>
                  <Text style={styles.buttonText}>新規入力</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  車両番号：
                </Text>
              </View>
              <View style={[styles.tableCell2, styles.pickerStyle]}>
                <Picker
                  selectedValue={car}
                  style={[styles.labelText, styles.pickerText]}
                  onValueChange={itemValue => setCar(itemValue)}
                  enabled={company !== ''}>
                  <Picker.Item
                    style={styles.labelText}
                    key=""
                    label=""
                    value=""
                  />
                  {cars.map(cr => (
                    <Picker.Item
                      style={styles.labelText}
                      label={cr}
                      value={cr}
                      key={cr}
                    />
                  ))}
                </Picker>
              </View>
              <View style={styles.tableCell3} />
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  運転手：
                </Text>
              </View>
              <View style={[styles.tableCell2]}>
                <TextInput
                  maxLength={30}
                  onChangeText={(text: string) => setDriver(text)}
                  value={driver}
                  style={[styles.input]}
                />
              </View>
              <View style={styles.tableCell3} />
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  電話番号：
                </Text>
              </View>
              <View style={styles.tableCell2}>
                <TextInput
                  keyboardType="numeric"
                  maxLength={12}
                  onChangeText={(text: string) => setTel(text)}
                  value={tel}
                  style={[styles.input]}
                />
              </View>
              <View style={styles.tableCell3} />
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
              <View style={styles.tableCell3} />
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
              company === ''
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
export default RVW003;
