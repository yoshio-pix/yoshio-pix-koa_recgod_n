/**-------------------------------------------
 * 受付システム
 * screens/RVW002.tsx
 * ---------------------------------------------*/
import Header from '../components/Header'; // Headerコンポーネントのインポート
import Footer from '../components/Footer'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle'; // 共通スタイル
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
// import messages from '../utils/messages';
// import {useAlert} from '../components/AlertContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator';
import {useButton} from '../hook/useButton.tsx';
import {tableDataState} from '../atom/atom.tsx';
import {useRecoilState} from 'recoil';
import PopupDetail from '../components/PopupDetail.tsx';
import {receptionRecordConst} from '../types/type.tsx';
// RVW002 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'RVW002'>;
interface Props {
  navigation: NavigationProp;
}
const RVW002 = ({navigation}: Props) => {
  const [isBtnEnabledBck, toggleButtonBck] = useButton(); //ボタン制御
  const [isBtnEnabledUpd, toggleButtonUpd] = useButton(); //ボタン制御
  const [tableDataRecoil, setTableDataRecoil] = useRecoilState(tableDataState); //Recoil
  const [popupVisible, setPopupVisible] = useState<boolean>(false); // 詳細ポップアップ
  const [selectData, setSelectData] = useState<receptionRecordConst | null>(
    null,
  ); // 詳細ポップアップ表示する旧タグ情報
  let tableData = tableDataRecoil;

  // useEffect フックを使用してステートが変更されるたびにチェック
  useEffect(() => {}, []);

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
   * 更新ボタン
   ************************************************/
  const btnAppUpd = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledUpd) {
      return;
    } else {
      toggleButtonUpd();
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
        const japanTime = new Date(now.getTime()); // + japanTimeOffset);
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
              // item.time_id,
              // item.create_dt,
            ],
          );

        console.log(tmpTableData);
        setTableDataRecoil(tmpTableData);
        tableData = tmpTableData;
      } catch (error) {
        console.error('API call error:', error);
        // エラー処理
      }
    };
    // 非同期関数を実行
    fetchData();
    return;
  };

  /************************************************
   * 詳細データをレンダリングするための関数
   ************************************************/
  const renderDetailData = (data: receptionRecordConst) => {
    return (
      <View style={styles.tableMain}>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>日時：</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{data.create_dt}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>会社名：</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{data.company}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>車両番号：</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{data.car}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>運転手：</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{data.driver}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>電話番号：</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{data.tel}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>行先：</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{data.dest}</Text>
          </View>
        </View>
      </View>
    );
  };

  /************************************************
   * 詳細ボタン
   ************************************************/
  const handleDetailButton = (rowData: any) => {
    const dataToSet = {
      create_dt: rowData[1],
      company: rowData[2],
      driver: rowData[3],
      car: rowData[4],
      tel: rowData[5],
      dest: rowData[6],
      time_id: '',
      create_time: '',
      loadstatus: '',
      receptstatus: '',
    };
    setSelectData(dataToSet);
    setPopupVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* ヘッダ */}
      <Header title={'トラック受付システム'} isRecieve={2} />

      {/* 中段 */}
      <View style={styles.tableHeadContainer}>
        <View style={[styles.cell, styles.headerCell]}>
          <Text style={styles.headerText}>No</Text>
        </View>
        <View style={[styles.cell2, styles.headerCell]}>
          <Text style={styles.headerText}>日時</Text>
        </View>
        <View style={[styles.cell2, styles.headerCell]}>
          <Text style={styles.headerText}>会社名</Text>
        </View>
        <View style={[styles.cell2, styles.headerCell]}>
          <Text style={styles.headerText}>車両番号</Text>
        </View>
        <View style={[styles.cell2, styles.headerCell]}>
          <Text style={styles.headerText}>行き先</Text>
        </View>
        <View style={[styles.cell2, styles.headerCell]}>
          <Text style={styles.headerText}>詳細</Text>
        </View>
        <View style={[styles.cell3, styles.headerCell]}>
          <Text style={styles.headerText}>対応</Text>
        </View>
        <View style={[styles.cell3, styles.headerCell]}>
          <Text style={styles.headerText}>積込</Text>
        </View>
      </View>

      <ScrollView style={styles.dataWrapper}>
        {tableData.map((rowData, index) => (
          <View key={index} style={styles.row}>
            {/* no */}
            <View key={0} style={styles.cell}>
              <Text>{rowData[0]}</Text>
            </View>
            {/* 日時 */}
            <View key={1} style={styles.cell2}>
              <Text>{rowData[1]}</Text>
            </View>
            {/* 会社名 */}
            <View key={2} style={styles.cell2}>
              <Text>{rowData[2]}</Text>
            </View>
            {/* 車両番号 */}
            <View key={4} style={styles.cell2}>
              <Text>{rowData[4]}</Text>
            </View>
            {/* 行先 */}
            <View key={6} style={styles.cell2}>
              <Text>{rowData[6]}</Text>
            </View>
            {/* 詳細 */}
            <View key={'dtl'} style={styles.cell2}>
              <TouchableOpacity
                style={[styles.detailButton]}
                onPress={() => handleDetailButton(rowData)}>
                <Text style={[styles.detailButtonText]}>詳細</Text>
              </TouchableOpacity>
            </View>
            {/* 対応 */}
            <View key={'recept'} style={[styles.cell3, styles.row]}>
              {rowData[8] === '1' && (
                <TouchableOpacity
                  disabled={true}
                  style={[
                    styles.buttonSmall3,
                    rowData[9] === '1' ? styles.disabledButton : null,
                  ]}>
                  <Text
                    style={[
                      rowData[9] === '1'
                        ? styles.disabledButton
                        : styles.textWhite,
                    ]}>
                    本
                  </Text>
                </TouchableOpacity>
              )}
              {rowData[11] === '1' && (
                <TouchableOpacity
                  disabled={true}
                  style={[
                    styles.buttonSmall3,
                    rowData[12] === '1' ? styles.disabledButton : null,
                  ]}>
                  <Text
                    style={[
                      rowData[12] === '1'
                        ? styles.disabledButton
                        : styles.textWhite,
                    ]}>
                    岡
                  </Text>
                </TouchableOpacity>
              )}
              {rowData[14] === '1' && (
                <TouchableOpacity
                  disabled={true}
                  style={[
                    styles.buttonSmall3,
                    rowData[15] === '1' ? styles.disabledButton : null,
                  ]}>
                  <Text
                    style={[
                      rowData[15] === '1'
                        ? styles.disabledButton
                        : styles.textWhite,
                    ]}>
                    大
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {/* 積込 */}
            <View key={'load'} style={[styles.cell3, styles.row]}>
              {rowData[8] === '1' && (
                <TouchableOpacity
                  disabled={true}
                  style={[
                    styles.buttonSmall3,
                    rowData[10] === '1' ? styles.disabledButton : null,
                  ]}>
                  <Text
                    style={[
                      rowData[10] === '1'
                        ? styles.disabledButton
                        : styles.textWhite,
                    ]}>
                    本
                  </Text>
                </TouchableOpacity>
              )}
              {rowData[11] === '1' && (
                <TouchableOpacity
                  disabled={true}
                  style={[
                    styles.buttonSmall3,
                    rowData[13] === '1' ? styles.disabledButton : null,
                  ]}>
                  <Text
                    style={[
                      rowData[13] === '1'
                        ? styles.disabledButton
                        : styles.textWhite,
                    ]}>
                    岡
                  </Text>
                </TouchableOpacity>
              )}
              {rowData[14] === '1' && (
                <TouchableOpacity
                  disabled={true}
                  style={[
                    styles.buttonSmall3,
                    rowData[16] === '1' ? styles.disabledButton : null,
                  ]}>
                  <Text
                    style={[
                      rowData[16] === '1'
                        ? styles.disabledButton
                        : styles.textWhite,
                    ]}>
                    大
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 下段 */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          disabled={!isBtnEnabledBck}
          style={[styles.button, styles.buttonBack]}
          onPress={btnAppBack}>
          <Text style={styles.buttonText}>戻る</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!isBtnEnabledUpd}
          style={[styles.button, styles.buttonBack]}
          onPress={btnAppUpd}>
          <Text style={styles.buttonText}>更新</Text>
        </TouchableOpacity>
      </View>

      {/* フッタ */}
      <Footer />

      {/* 詳細ポップアップ */}
      <PopupDetail
        isVisible={popupVisible}
        onClose={() => setPopupVisible(false)}>
        {/* 選択された oldTagInfo の詳細データをレンダリング */}
        {selectData && renderDetailData(selectData)}
      </PopupDetail>
    </View>
  );
};
export default RVW002;
