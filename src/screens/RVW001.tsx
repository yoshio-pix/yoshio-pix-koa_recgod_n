/**-------------------------------------------
 * 受付システム
 * screens/RVW001.tsx
 * ---------------------------------------------*/
import Header from '../components/Header'; // Headerコンポーネントのインポート
import Footer from '../components/Footer'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle'; // 共通スタイル
import React, {useEffect} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
// import messages from '../utils/messages';
// import {useAlert} from '../components/AlertContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator';
import {useButton} from '../hook/useButton.tsx';
import {tableDataState} from '../atom/atom.tsx';
import {useSetRecoilState} from 'recoil';
// RVW001 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'RVW001'>;
interface Props {
  navigation: NavigationProp;
}
const RVW001 = ({navigation}: Props) => {
  const [isBtnEnabledLst, toggleButtonLst] = useButton(); //ボタン制御
  const [isBtnEnabledStt, toggleButtonStt] = useButton(); //ボタン制御
  // const {showAlert} = useAlert();
  const setTableData = useSetRecoilState(tableDataState); //Recoil id
  // useEffect フックを使用してステートが変更されるたびにチェック
  useEffect(() => {}, []);

  /************************************************
   * 受付一覧ボタン
   ************************************************/
  const btnRecpList = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledLst) {
      return;
    } else {
      toggleButtonLst();
    }

    // API GatewayのエンドポイントURL
    const apiEndpoint =
      'https://afodl4wvs9.execute-api.ap-northeast-3.amazonaws.com/stage/selectReceptionRg1';

    let now = new Date();
    // const japanTimeOffset = 9 * 60 * 60 * 1000; // 9時間 * 60分
    const japanTime = new Date(now.getTime()); // + japanTimeOffset);

    now = japanTime;
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    // 送信するデータ
    const dataToSend = {
      createDate: `${year}${month}${day}`,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST', // HTTPメソッド
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // データを文字列に変換してボディにセット
      });
      console.log(response);
      if (!response.ok) {
        throw new Error('API call failed: ' + response.status);
      }
      const responseJson = await response.json(); // レスポンスのJSONをパース
      const responseData = JSON.parse(responseJson.body); // bodyの文字列をさらにJSONオブジェクトに変換

      // データ変換処理
      let tableData = responseData.data
        // .filter((item: {kyoten: string}) => item.kyoten === '本社')
        .slice() // 元の配列を変更しないためにコピーを作成
        .reverse() // 配列の順番を逆にする
        .map(
          (
            item: {
              // create_dt: string;
              create_time: string;
              company: string;
              driver: string;
              car: string;
              tel: string;
              ordno: string;
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
              tsuchi_5: string;
              receptstatus_5: string;
              loadstatus_5: string;
              // time_id: number;
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
            item.ordno, // 手配番号・発注番号    6
            item.proc, // 処理状態  7
            item.tsuchi_1, // 通知    8
            item.receptstatus_1, // 応対状態 9
            item.loadstatus_1, // 荷下 10
            item.tsuchi_2, // 通知    11
            item.receptstatus_2, // 応対状態 12
            item.loadstatus_2, // 荷下 13
            item.tsuchi_3, // 通知    14
            item.receptstatus_3, // 応対状態 15
            item.loadstatus_3, // 荷下 16
            item.tsuchi_4, // 通知    17
            item.receptstatus_4, // 応対状態 18
            item.loadstatus_4, // 荷下 19
            item.tsuchi_5, // 通知    20
            item.receptstatus_5, // 応対状態 21
            item.loadstatus_5, // 荷下 22
            // item.time_id,
            // item.create_dt,
          ],
        );

      console.log(tableData);
      setTableData(tableData);
      // 成功したら、別の画面にナビゲート
      navigation.navigate('RVW002');
    } catch (error) {
      console.error('API call error:', error);
      // エラー処理（アラート表示など）
    }
    return;
  };

  /************************************************
   * 受付開始ボタン
   ************************************************/
  const btnRecpStt = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledStt) {
      return;
    } else {
      toggleButtonStt();
    }

    navigation.navigate('RVW004');
    return;
  };

  return (
    <View style={styles.container}>
      {/* ヘッダ */}
      <Header title={'トラック受付システム'} isRecieve={2} />

      {/* 中段 */}
      <View style={[styles.topContent, styles.center]}>
        <Text style={[styles.text, styles.center]}>いらっしゃいませ</Text>
        <Text style={[styles.text, styles.center]}>
          荷受の方は、下記より受付をお願いいたします。
        </Text>
        <View>
          <Image
            style={[styles.logo]}
            source={require('../assets/imgs/logo.jpg')}
          />
        </View>
      </View>

      {/* 下段 */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          disabled={!isBtnEnabledLst}
          style={[styles.button]}
          onPress={btnRecpList}>
          <Text style={styles.buttonText}>受付一覧</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isBtnEnabledLst}
          style={[styles.button]}
          onPress={btnRecpStt}>
          <Text style={styles.buttonText}>受付開始</Text>
        </TouchableOpacity>
      </View>

      {/* フッタ */}
      <Footer />
    </View>
  );
};
export default RVW001;
