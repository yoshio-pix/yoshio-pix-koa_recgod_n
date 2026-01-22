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
// RVW003 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'RVW003'>;
interface Props {
  navigation: NavigationProp;
}
const RVW004 = ({navigation}: Props) => {
  const [isBtnEnabledBck, toggleButtonBck] = useButton(); //ボタン制御
  const [isBtnEnabledSnd, toggleButtonSnd] = useButton(); //ボタン制御
  const [company, setCompany] = useState<string>(''); //会社名
  const [driver, setDriver] = useState<string>(''); //運転手
  const [car, setCar] = useState<string>(''); //車両番号
  const [tel, setTel] = useState<string>(''); //電話番号
  const [dest] = useState<string>(''); //行き先
  const [modalVisible, setModalVisible] = useState<boolean>(false); //処理中モーダルの状態
  const {showAlert} = useAlert();

  // useEffect フックを使用してステートが変更されるたびにチェック
  useEffect(() => {}, []);
  // 送信ボタンのスタイルを動的に変更するための関数
  const getButtonStyle = () => {
    return tel === '' || car === '' || driver === '' || company === ''
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

    navigation.navigate('RVW003');
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
          <View style={[styles.tableMain, styles.marginBottom10]}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  会社名：
                </Text>
              </View>
              <View style={styles.tableCell2}>
                <TextInput
                  maxLength={30}
                  onChangeText={(text: string) => setCompany(text)}
                  value={company}
                  style={[styles.input]}
                />
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  車両番号：
                </Text>
              </View>
              <View style={styles.tableCell2}>
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
              <View style={styles.tableCell}>
                <Text style={[styles.labelText, styles.alignRight]}>
                  運転手：
                </Text>
              </View>
              <View style={styles.tableCell2}>
                <TextInput
                  maxLength={30}
                  onChangeText={(text: string) => setDriver(text)}
                  value={driver}
                  style={[styles.input]}
                />
              </View>
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
export default RVW004;
