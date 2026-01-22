/**-------------------------------------------
 * 受付システム(リフト)
 * screens/LVW002.tsx
 * ---------------------------------------------*/
import Header from '../components/Header'; // Headerコンポーネントのインポート
import Footer from '../components/Footer'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle'; // 共通スタイル
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
// import messages from '../utils/messages';
// import {useAlert} from '../components/AlertContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator';
import {useButton} from '../hook/useButton.tsx';
import {
  driverState,
  carState,
  objState,
  companyState,
  tableDataState,
  addUrlState,
  kyotenState,
} from '../atom/atom.tsx';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import {useAlert} from '../components/AlertContext.tsx';
import messages from '../utils/messages.tsx';
// LVW002 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'LVW002'>;
interface Props {
  navigation: NavigationProp;
}
const LVW002 = ({navigation}: Props) => {
  const [isBtnEnabledBck, toggleButtonBck] = useButton(); //ボタン制御
  const [isBtnEnabledSnd, toggleButtonSnd] = useButton(); //ボタン制御
  const driver = useRecoilValue(driverState); //Recoil 運転手
  const company = useRecoilValue(companyState); //Recoil 会社
  const car = useRecoilValue(carState); //Recoil 車
  const obj = useRecoilValue(objState); //Recoil id
  const kyoten = useRecoilValue(kyotenState); //Recoil
  const addUrl = useRecoilValue(addUrlState); //Recoil
  const setTableData = useSetRecoilState(tableDataState); //Recoil id
  const {showAlert} = useAlert();
  // useEffect フックを使用してステートが変更されるたびにチェック
  useEffect(() => {}, []);

  // 送信ボタンのスタイルを動的に変更するための関数
  const getButtonStyle = () => {
    return driver === ''
      ? [styles.button, styles.buttonBack, styles.disabledButton]
      : [styles.button, styles.buttonBack];
  };

  /************************************************
   * 承諾ボタン
   ************************************************/
  const btnAppAllow = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledSnd) {
      return;
    } else {
      toggleButtonSnd();
    }

    const result = await showAlert('確認', messages.IA5001(driver), true);
    if (result) {
      //---------承諾後 対応ステータス更新処理---------
      // API GatewayのエンドポイントURL
      const apiEndpoint =
        'https://5mafa3mbr9.execute-api.ap-northeast-1.amazonaws.com/stage/updateReception3' +
        addUrl;

      // 送信するデータ
      const dataToSend = {
        timeId: obj.time_id,
        createDt: obj.create_dt,
        sendFlg: '0',
        type: '2', //対応
        fromK: '0',
        mode: addUrl,
      };

      console.log(dataToSend);
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
        console.log('response', response);
      } catch (error) {
        console.error('API call error:', error);
        // エラー処理（アラート表示など）
      }
    }
    //-------ここからテーブルデータ再取得--------
    // 非同期関数を定義
    const fetchData = async () => {
      try {
        // API GatewayのエンドポイントURL
        const apiEndpointDB =
          'https://arc32werp4.execute-api.ap-northeast-1.amazonaws.com/stage/selectReception3';
        let now = new Date();
        // const japanTimeOffset = 9 * 60 * 60 * 1000; // 9時間 * 60分
        const japanTime = new Date(now.getTime()); //+ japanTimeOffset);
        now = japanTime;
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const dataToSendDB = {createDate: `${year}${month}${day}`};

        const responseDB = await fetch(apiEndpointDB, {
          method: 'POST', // HTTPメソッド
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dataToSendDB), // データを文字列に変換してボディにセット
        });

        if (!responseDB.ok) {
          throw new Error('API call failed: ' + responseDB.status);
        }
        const responseJson = await responseDB.json(); // レスポンスのJSONをパース
        // ここで受け取ったデータを適切に処理
        console.log(responseJson);
        const responseData = JSON.parse(responseJson.body); // bodyの文字列をさらにJSONオブジェクトに変換

        // データ変換処理
        let tmpTableData = responseData.data
          .slice() // 元の配列を変更しないためにコピーを作成
          .reverse() // 配列の順番を逆にする
          .map(
            (
              item: {
                create_dt: string;
                create_time: string;
                company: string;
                driver: string;
                car: string;
                tel: string;
                dest: string;
                proc: string;
                tsuchi_1: string;
                receptstatus_1: string;
                loadstatus_1: string;
                tsuchi_2: string;
                receptstatus_2: string;
                loadstatus_2: string;
                tsuchi_3: string;
                receptstatus_3: string;
                loadstatus_3: string;
                tsuchi_4: string;
                receptstatus_4: string;
                loadstatus_4: string;
                time_id: number;
              },
              index: number,
              arr: any[],
            ) => [
              String(arr.length - index), // 末尾からの番号ックスに基づいて1から始まる数字 0
              `${year}/${month}/${day} ${item.create_time}`, // 日時 1
              item.company, // 会社名 2
              item.driver, // 名前    3
              item.car, // 車両番号   4
              item.tel, // 電話番号   5
              item.dest, // 行き先    6
              item.proc, // 処理状態  7
              item.tsuchi_1, // 通知    8
              item.receptstatus_1, // 応対状態 9
              item.loadstatus_1, // 積込 10
              item.tsuchi_2, // 通知    11
              item.receptstatus_2, // 応対状態 12
              item.loadstatus_2, // 積込 13
              item.tsuchi_3, // 通知    14
              item.receptstatus_3, // 応対状態 15
              item.loadstatus_3, // 積込 16
              item.tsuchi_4, // 通知    17
              item.receptstatus_4, // 応対状態 18
              item.loadstatus_4, // 積込 19
              item.time_id,
              item.create_dt,
            ],
          );
        console.log(tmpTableData);
        setTableData(tmpTableData);
      } catch (error) {
        console.error('API call error:', error);
        // エラー処理
      }
    };

    // 非同期関数を実行
    fetchData();
    //  if (result) {//★
    //    navigation.navigate('KVW001');//★
    //  } else {//★
    navigation.navigate('LVW001');
    //  }//★
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

    navigation.navigate('LVW001');
    // navigation.navigate('KVW001');//★
    return;
  };

  return (
    <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.flex1} // KeyboardAvoidingView に flex: 1 を追加
      keyboardVerticalOffset={0}>
      <ScrollView
        contentContainerStyle={[styles.containerWithKeybord, styles.flexGrow1]}>
        {/* ヘッダ */}
        <Header
          title={'トラック受付システム(リフト・' + kyoten + ')'}
          isRecieve={1}
        />
        {/* 中段 */}
        <View style={[styles.topContent, styles.center]}>
          <View style={[styles.topContent, styles.center]}>
            <View style={[styles.tableMain, styles.receptView]}>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.labelText, styles.alignRight]}>
                    会社名：
                  </Text>
                </View>
                <View style={styles.tableCell2}>
                  <Text style={[styles.labelText]}>{company}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.labelText, styles.alignRight]}>
                    運転手：
                  </Text>
                </View>
                <View style={styles.tableCell2}>
                  <Text style={[styles.labelText]}>{driver}</Text>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={[styles.labelText, styles.alignRight]}>
                    車両番号：
                  </Text>
                </View>
                <View style={styles.tableCell2}>
                  <Text style={[styles.labelText]}>{car}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.labelText}>来社されました。</Text>
          </View>
          <View>
            <Image
              style={[styles.logo, styles.logoMarginLVW]}
              source={require('../assets/imgs/logo.jpg')}
            />
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
            disabled={!isBtnEnabledSnd || driver === ''}
            style={getButtonStyle()}
            onPress={btnAppAllow}>
            <Text style={styles.buttonText}>承諾</Text>
          </TouchableOpacity>
        </View>

        {/* フッタ */}
        <Footer />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default LVW002;
