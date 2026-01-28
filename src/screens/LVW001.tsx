/* eslint-disable react-hooks/exhaustive-deps */
/**-------------------------------------------
 * 受付システム(リフト)
 * screens/LVW001.tsx
 * ---------------------------------------------*/
import Header from '../components/Header'; // Headerコンポーネントのインポート
import Footer from '../components/Footer'; // Footerコンポーネントのインポート
import {styles} from '../styles/CommonStyle'; // 共通スタイル
import ProcessingModal from '../components/Modal';
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
// import messages from '../utils/messages';
// import {useAlert} from '../components/AlertContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootList} from '../navigation/AppNavigator';
import {useButton} from '../hook/useButton.tsx';
import {
  tableDataState,
  objState,
  antenaState,
  // driverState,
  reconnectState,
  signState,
  modeState,
  kyotenState,
  addUrlState,
  // testState,
} from '../atom/atom.tsx';
import {useRecoilValue, useRecoilState, useSetRecoilState} from 'recoil';
import {useAlert} from '../components/AlertContext.tsx';
import messages from '../utils/messages.tsx';
import {receptionRecordConst} from '../types/type.tsx';
import PopupDetail from '../components/PopupDetail.tsx';
import axios from 'axios';
// LVW001 用の navigation 型
type NavigationProp = StackNavigationProp<RootList, 'LVW001'>;
interface Props {
  navigation: NavigationProp;
}
interface PropsTmp {
  ptn: number;
  car: string;
  timeId: string;
  createDate: string;
  status: string;
  txt: string;
  onButtonPress: (
    ptn: number,
    timeId: string,
    createDate: string,
    car: string,
  ) => void;
}
const apiKey = 'AIzaSyB89faAwz8_2Y1LdNK9QLD0fk3Loa1Rgxw';
const sheetId = '1HfqNBnhfh8vYZnBXWwxKwqLqLGoaVS2MZy8h30yDPI4';
const sheetName = 'sheet1';
const dataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?valueRenderOption=FORMATTED_VALUE&key=${apiKey}`;

const LVW001 = ({navigation}: Props) => {
  const [isBtnEnabledCon, toggleButtonCon] = useButton(); //ボタン制御
  const [isBtnEnabledUpd, toggleButtonUpd] = useButton(); //ボタン制御
  const [tableData, setTableData] = useRecoilState(tableDataState); //Recoil tableData
  const obj = useRecoilValue(objState); //Recoil obj
  const kyoten = useRecoilValue(kyotenState); //Recoil
  const addUrl = useRecoilValue(addUrlState); //Recoil
  // const driver = useRecoilValue(driverState); //Recoil 運転手
  const antena = useRecoilValue(antenaState); //Recoil antena
  const reconnect = useRecoilValue(reconnectState); //Recoil antena
  const sign = useSetRecoilState(signState); //Recoil
  const systemmode = useRecoilValue(modeState); //Recoil
  // const test = useRecoilValue(testState); //Recoil antena
  const [modalVisible, setModalVisible] = useState<boolean>(false); //処理中モーダルの状態
  const [popupVisible, setPopupVisible] = useState<boolean>(false); // 詳細ポップアップ
  const [selectData, setSelectData] = useState<receptionRecordConst | null>(
    null,
  ); // 詳細ポップアップ表示する旧タグ情報
  const {showAlert} = useAlert();
  /************************************************
   * 初期表示前処理用
   ************************************************/
  useEffect(() => {
    // 非同期関数を実行
    fetchData();
  }, []); // 依存配列

  /************************************************
   * 再描画用
   ************************************************/
  useEffect(() => {
    // 非同期関数を実行
    fetchData();
  }, [antena]); // 依存配列

  // 非同期関数を定義
  const fetchData = async () => {
    try {
      if (systemmode !== 'N') {
        return;
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
      const dataToSend = {createDate: `${year}${month}${day}`};

      const response = await fetch(apiEndpoint, {
        method: 'POST', // HTTPメソッド
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend), // データを文字列に変換してボディにセット
      });

      if (!response.ok) {
        throw new Error('API call failed: ' + response.status);
      }
      const responseJson = await response.json(); // レスポンスのJSONをパース
      // ここで受け取ったデータを適切に処理
      //console.log(responseJson);
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
            item.ordno, // 手配番号・発注番号   6
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
            item.time_id,
            item.create_dt,
          ],
        );
      //console.log(tmpTableData);
      setTableData(tmpTableData);
    } catch (error) {
      console.error('API call error:', error);
      // エラー処理
    }
  };

  // AppNavigatorにて受付チェックし、受信し次第画面変更
  useEffect(() => {
    // setTimeout(() => {
    navigation.navigate('LVW002');
    // }, 1000); // 1000ミリ秒 = 1秒
  }, [obj]);

  /************************************************
   * 未処理ボタン（荷下・出荷）
   ************************************************/
  // AWSへの更新を行う関数
  const updateReceptionStatus = async (
    ptn: number,
    timeId: string,
    createDate: string,
    car: string,
  ) => {
    let apiEndpoint =
      'https://vm5ru08509.execute-api.ap-northeast-3.amazonaws.com/stage/updateReceptionRg1' +
      addUrl; // AWS Lambda の API エンドポイントURLに置き換え
    let type = '0';
    if (ptn === 1) {
      const result = await showAlert(
        '確認',
        messages.IA5002(car, '荷下'),
        true,
      );
      //いいえ押下の場合処理終了
      if (!result) {
        return;
      }
      type = '3'; //荷下
    } else {
      const result = await showAlert(
        '確認',
        messages.IA5002(car, '対応'),
        true,
      );
      //いいえ押下の場合処理終了
      if (!result) {
        return;
      }
      type = '2'; //対応
    }

    // モーダル表示
    setModalVisible(true);

    const dataToSend = {
      timeId: timeId,
      createDt: createDate,
      sendFlg: '1',
      type: type,
      fromK: '0',
      mode: addUrl,
    };

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST', // 適切なHTTPメソッドに置き換えてください
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error('API call failed: ' + response.status);
      }

      // 応答データを処理します
      const responseData = await response.json();
      console.log('Update successful:', responseData);
    } catch (error) {
      console.error('API call error:', error);
      // エラー処理
    }
    // モーダル表示
    setModalVisible(false);
  };

  /************************************************
   * 再接続ボタン
   ************************************************/
  const btnAppCon = async () => {
    //ボタン連続押下制御
    if (!isBtnEnabledCon) {
      return;
    } else {
      toggleButtonCon();
    }

    sign(true);
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
    setModalVisible(true);
    //-------ここからテーブルデータ再取得--------
    // 非同期関数を定義
    const fetchDataUpd = async () => {
      try {
        // API GatewayのエンドポイントURL
        const apiEndpointDB =
          'https://afodl4wvs9.execute-api.ap-northeast-3.amazonaws.com/stage/selectReceptionRg1';
        let now = new Date();
        const japanTimeOffset = 9 * 60 * 60 * 1000; // 9時間 * 60分
        const japanTime = new Date(now.getTime() + japanTimeOffset);
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
    fetchDataUpd();
    setModalVisible(false);
    return;
  };

  /************************************************
   * 明細（商品・数量・備考）テーブル
   ************************************************/
  const renderDetailItems = (record: any) => {
    const products = record.product.split(',').map((v: string) => v.trim());
    const nums = record.num.split(',').map((v: string) => v.trim());
    const bikos = record.biko.split(',').map((v: string) => v.trim());

    return (
      <View style={styles.detailTableOrd}>
        {/* ヘッダ */}
        <View style={styles.tableRowOrd}>
          <Text style={styles.headerCellOrd}>商品名</Text>
          <Text style={styles.headerCellOrd}>数量</Text>
          <Text style={styles.headerCellOrd}>備考</Text>
        </View>

        {/* 明細行 */}
        {products.map((product: string, index: number) => (
          <View key={index} style={styles.tableRowOrd}>
            <Text style={styles.bodyCellOrd}>{product}</Text>
            <Text style={styles.bodyCellOrd}>{nums[index] ?? ''}</Text>
            <Text style={styles.bodyCellOrd}>{bikos[index] ?? ''}</Text>
          </View>
        ))}
      </View>
    );
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
            <Text style={styles.labelText}>手配発注番号：</Text>
          </View>
          <View style={styles.tableCell}>
            <Text style={styles.labelText}>{data.ordno}</Text>
          </View>
        </View>
        {/* 明細テーブル */}
        {data.ordno && renderDetailItems(data.record)}
      </View>
    );
  };

  /************************************************
   * 詳細ボタン
   ************************************************/
  const handleDetailButton = async (rowData: any) => {
    try {
      const response = await axios.get(dataUrl);
      if (!response?.data?.values) {
        console.log('No response data available');
        return;
      }

      const values = response.data.values as string[][];

      // 手配番号一致の行を1件取得
      const row = values.find((r: any[]) => rowData[6] === r[1]);
      if (!row) {
        console.log('該当データなし');
        return;
      }

      // record を確定させる
      const record = {
        date: row[0] ?? '',
        ordno: row[1] ?? '',
        product: row[2] ?? '',
        num: row[3] ?? '',
        biko: row[4] ?? '',
      };

      // record が「入った後」で dataToSet を作る
      const dataToSet: receptionRecordConst = {
        create_dt: rowData[1],
        company: rowData[2],
        driver: rowData[3],
        car: rowData[4],
        tel: rowData[5],
        ordno: rowData[6],
        record,
        time_id: '',
        create_time: '',
        loadstatus: '',
        receptstatus: '',
      };

      setSelectData(dataToSet);
      setPopupVisible(true);
    } catch (e) {
      console.log('fetch data error', e);
    }
  };
  return (
    <View style={styles.container}>
      {/* ヘッダ */}
      <Header
        title={'トラック受付システム(リフト・' + kyoten + ')'}
        isRecieve={1}
      />

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
          <Text style={styles.headerText}>手配番号</Text>
        </View>
        <View style={[styles.cell2, styles.headerCell]}>
          <Text style={styles.headerText}>詳細</Text>
        </View>
        <View style={[styles.cell3, styles.headerCell]}>
          <Text style={styles.headerText}>対応</Text>
        </View>
        <View style={[styles.cell3, styles.headerCell]}>
          <Text style={styles.headerText}>荷下</Text>
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
            {/* 手配番号・発注番号 */}
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
            <View key={'recept'} style={[styles.cell3, styles.cellColumn]}>
              <View style={styles.row}>
                {kyoten === '運輸' && rowData[8] === '1' && (
                  <ProcButton
                    ptn={0}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[9]}
                    txt={'運'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '運輸' && rowData[8] === '1' && <Text>運</Text>}
                {kyoten === '保税' && rowData[11] === '1' && (
                  <ProcButton
                    ptn={0}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[12]}
                    txt={'保'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '保税' && rowData[11] === '1' && <Text>保</Text>}
              </View>
              <View style={styles.row}>
                {kyoten === '第二' && rowData[14] === '1' && (
                  <ProcButton
                    ptn={0}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[15]}
                    txt={'二'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '第二' && rowData[14] === '1' && <Text>二</Text>}
                {kyoten === '岡本' && rowData[17] === '1' && (
                  <ProcButton
                    ptn={0}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[18]}
                    txt={'本'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '岡本' && rowData[17] === '1' && <Text>本</Text>}
                {kyoten === '岡明' && rowData[20] === '1' && (
                  <ProcButton
                    ptn={0}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[21]}
                    txt={'明'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '岡明' && rowData[20] === '1' && <Text>明</Text>}
              </View>
            </View>
            {/* 荷下 */}
            <View key={'load'} style={[styles.cell3, styles.cellColumn]}>
              <View style={styles.row}>
                {kyoten === '運輸' && rowData[8] === '1' && (
                  <ProcButton
                    ptn={1}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[10]}
                    txt={'運'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '運輸' && rowData[8] === '1' && <Text>運</Text>}
                {kyoten === '保税' && rowData[11] === '1' && (
                  <ProcButton
                    ptn={1}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[13]}
                    txt={'保'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '保税' && rowData[11] === '1' && <Text>保</Text>}
              </View>
              <View style={styles.row}>
                {kyoten === '第二' && rowData[14] === '1' && (
                  <ProcButton
                    ptn={1}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[16]}
                    txt={'二'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '第二' && rowData[14] === '1' && <Text>二</Text>}
                {kyoten === '岡本' && rowData[17] === '1' && (
                  <ProcButton
                    ptn={1}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[19]}
                    txt={'本'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '岡本' && rowData[17] === '1' && <Text>本</Text>}
                {kyoten === '岡明' && rowData[20] === '1' && (
                  <ProcButton
                    ptn={1}
                    car={rowData[4]}
                    timeId={rowData[23]}
                    createDate={rowData[24]}
                    status={rowData[22]}
                    txt={'明'}
                    onButtonPress={updateReceptionStatus}
                  />
                )}
                {kyoten !== '岡明' && rowData[20] === '1' && <Text>明</Text>}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 処理中モーダル */}
      <ProcessingModal
        visible={modalVisible}
        message={messages.IA5003()}
        onClose={() => setModalVisible(false)}
      />

      {/* 下段 */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          disabled={!isBtnEnabledUpd}
          style={[styles.button, styles.buttonBack]}
          onPress={btnAppUpd}>
          <Text style={styles.buttonText}>更新</Text>
        </TouchableOpacity>
        {reconnect && (
          <TouchableOpacity
            disabled={!isBtnEnabledCon}
            style={[styles.button]}
            onPress={btnAppCon}>
            <Text style={styles.buttonText}>再接続</Text>
          </TouchableOpacity>
        )}
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
export default LVW001;

// ProcButton コンポーネント
export const ProcButton = ({
  ptn,
  car,
  timeId,
  createDate,
  status,
  txt,
  onButtonPress,
}: PropsTmp) => {
  return (
    <TouchableOpacity
      disabled={status === '1' ? true : false}
      onPress={() => onButtonPress(ptn, timeId, createDate, car)}
      style={[
        styles.buttonSmall3,
        status === '1' ? styles.disabledButton : null,
      ]}>
      <Text style={[status === '1' ? styles.disabledButton : styles.textWhite]}>
        {txt}
      </Text>
    </TouchableOpacity>
  );
};
