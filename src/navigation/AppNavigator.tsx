/* eslint-disable react-hooks/exhaustive-deps */
/**-------------------------------------------
 * 画面遷移
 * navigation/AppNavigator.tsx
 * ---------------------------------------------*/

//##########################################################
//変更箇所「App.tsx、AppNavigator.tsx」
//運輸・保税・第二・岡本・岡明
//運・保・二・本・明

// let kyoten = '受付'; //本部・保税・岡セラ・大ヶ池・運輸
// let systemmode = '1'; //黄色…N 赤色…1 青色…K
// let addUrl = '';
// let kyoten = '本部'; //本部・保税・岡セラ・大ヶ池・運輸
// let systemmode = 'K'; //黄色…N 赤色…1 青色…K
// let addUrl = '';

// let kyoten = '運輸'; //運輸・保税・第二・岡本・岡明
// let systemmode = 'N'; //黄色…N 赤色…1 青色…K
// let addUrl = '_1';
// let kyoten = '保税'; //運輸・保税・第二・岡本・岡明
// let systemmode = 'N'; //黄色…N 赤色…1 青色…K
// let addUrl = '_2';
// let kyoten = '第二'; //運輸・保税・第二・岡本・岡明
// let systemmode = 'N'; //黄色…N 赤色…1 青色…K
// let addUrl = '_3';
// let kyoten = '岡本'; //運輸・保税・第二・岡本・岡明
// let systemmode = 'N'; //黄色…N 赤色…1 青色…K
// let addUrl = '_4';
let kyoten = '岡明'; //運輸・保税・第二・岡本・岡明
let systemmode = 'N'; //黄色…N 赤色…1 青色…K
let addUrl = '_5';
let webSocketUrl =
  // 'wss://ey2ijwq9rk.execute-api.ap-northeast-3.amazonaws.com/stage/'; //本部

  // 'wss://u52u9v7nu0.execute-api.ap-northeast-3.amazonaws.com/stage/'; //運輸
  // 'wss://n5vbbde6ia.execute-api.ap-northeast-3.amazonaws.com/stage/'; //保税
  // 'wss://l8xc7z3ph8.execute-api.ap-northeast-3.amazonaws.com/stage/'; //第二
  // 'wss://ir9qzim827.execute-api.ap-northeast-3.amazonaws.com/stage/'; //岡本
  'wss://ns8nsyg8v5.execute-api.ap-northeast-3.amazonaws.com/stage/'; //岡明
//##########################################################

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
// import RVW001 from '../screens/RVW001';
// import RVW002 from '../screens/RVW002';
// import RVW003 from '../screens/RVW003';
// import RVW004 from '../screens/RVW004';
import LVW001 from '../screens/LVW001';
import LVW002 from '../screens/LVW002';
import {AlertProvider} from '../components/AlertContext';
import {
  objState,
  driverState,
  carState,
  companyState,
  antenaState,
  reconnectState,
  signState,
  modeState,
  kyotenState,
  addUrlState,
  ordnoState,
  // testState,
} from '../atom/atom.tsx';
import {useSetRecoilState, useRecoilState} from 'recoil';
import notifee, {AndroidImportance} from '@notifee/react-native';

// import {Alert, BackHandler} from 'react-native';
export type RootList = {
  LVW001: undefined;
  LVW002: undefined;
  RVW001: undefined;
  RVW002: undefined;
  RVW003: undefined;
  RVW004: undefined;
};
import Sound from 'react-native-sound';
const Stack = createStackNavigator<RootList>();
let count = 0;
let isConnect = true;
//端末チェック処理
import DeviceInfo from 'react-native-device-info';
// const allowedDeviceIds = [
//   '70660eb08b1f2de3', //エミュレータ
//   'd0aa51061feae449', //1号機（親機）
//   '3840515639ad82c6', //2号機
//   '47936ae0a9d77371', //3号機
//   '5f33cb8e25f28d5d', //追加分
//   '32a7cd51def4da0c', //追加分
//   '938aac290e42f3d1', //追加分
//   'b85a85b1d25c8db9', //20240912追加分
// ]; // 許可されたデバイスIDのリスト
console.log(DeviceInfo.getUniqueId());
DeviceInfo.getUniqueId().then(uniqueId => {
  console.log('★', uniqueId);
  // if (!allowedDeviceIds.includes(uniqueId)) {
  //   isConnect = false;
  //   // アラートを表示してアプリを閉じる処理
  //   Alert.alert(
  //     'エラー',
  //     'このデバイスではこのアプリを使用できません。',
  //     [{text: 'OK', onPress: () => BackHandler.exitApp()}],
  //     {cancelable: false},
  //   );
  // }
});

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<keyof RootList>();
  const setObj = useSetRecoilState(objState); //Recoil id
  const setDriver = useSetRecoilState(driverState); //Recoil 運転手
  const setCar = useSetRecoilState(carState); //Recoil 車
  const setOrdno = useSetRecoilState(ordnoState); //Recoil 手配番号・発注番号
  const setCompany = useSetRecoilState(companyState); //Recoil 会社
  const setAntena = useSetRecoilState(antenaState); //Recoil
  const setMode = useSetRecoilState(modeState); //Recoil
  const setKyoten = useSetRecoilState(kyotenState); //Recoil
  const setAddUrl = useSetRecoilState(addUrlState); //Recoil
  const setReconnect = useSetRecoilState(reconnectState); //Recoil
  // const [test, setTest] = useRecoilState(testState); //Recoil
  const [sign, setSign] = useRecoilState(signState); //Recoil id
  let wsInstance: WebSocket | undefined;
  let ws: WebSocket;
  useEffect(() => {
    if (sign) {
      count = 0;
      setReconnect(false);
      if (wsInstance) {
        wsInstance.close();
      }
      wsInstance = connectWebSocket();
      setSign(false);
    }
  }, [sign]); // 再接続押下時のみ

  useEffect(() => {
    setMode(systemmode);
    setKyoten(kyoten);
    setAddUrl(addUrl);
    if (wsInstance) {
      wsInstance.close();
    }
    wsInstance = connectWebSocket();
  }, []); // 依存配列は空です（コンポーネントのマウント時に1回だけ実行）

  useEffect(() => {
    // アプリ起動時の処理
    const initialize = async () => {
      // setInitialRoute('RVW001');
      setInitialRoute('LVW001');
    };

    initialize();
  }, []);
  useEffect(() => {
    const initNotification = async () => {
      await notifee.createChannel({
        id: 'default',
        name: '荷受通知',
        importance: AndroidImportance.HIGH,
      });
    };

    initNotification();
  }, []);

  // WebSocket 接続を開く
  function connectWebSocket() {
    if (!isConnect) {
      return;
    }
    ws = new WebSocket(webSocketUrl);

    ws.onopen = () => {
      console.log('connected');
      // Alert.alert('接続完了');
    };

    ws.onmessage = (e: any) => {
      let obj = JSON.parse(e.data);
      // if (obj.message === 'Forbidden') {
      //   return;
      // }
      console.log(obj);
      if (obj.re === '0') {
        //受付時の処理
        setDriver(obj.driver);
        setCar(obj.car);
        setCompany(obj.company);
        setOrdno(obj.ordno);
        setObj(obj);
        if (obj.driver !== '') {
          const sound = new Sound(
            'notification',
            Sound.MAIN_BUNDLE,
            async error => {
              if (error) {
                return;
              }
              console.log('サウンドON');
              sound.play();
              // 通知
              await notifee.displayNotification({
                title: '荷受通知',
                body: '来社されました。',
                android: {
                  channelId: 'default',
                  importance: AndroidImportance.HIGH,
                },
              });
            },
          );
        }
      } else {
        //一覧更新時の再描画用
        const now = new Date(); // 現在の日時を取得
        const antenaData = String(now.getTime());
        setAntena(antenaData);
      }
    };

    ws.onerror = (e: any) => {
      console.log('error', e.message);
    };

    ws.onclose = (e: any) => {
      console.log('disconnect', e.reason);
      // 短時間に再接続が多発しないようにするための遅延
      count++;
      if (count >= 3) {
        setReconnect(true);
      } else {
        setTimeout(() => {
          if (wsInstance) {
            wsInstance.close();
          }
          wsInstance = connectWebSocket();
        }, 3000); // 3秒後に再接続
      }
    };

    //定期的なメッセージ送信による接続切断回避
    setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        count = 0;
        setReconnect(false);
        ws.send(JSON.stringify({type: 'heartbeat'}));
      }
      // setTest(count);
      //console.log(count);
    }, 10000); // 15秒ごと

    return ws;
  }

  return (
    <NavigationContainer>
      <AlertProvider>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName={initialRoute}>
          <Stack.Screen name="LVW001" component={LVW001} />
          <Stack.Screen name="LVW002" component={LVW002} />
          {/* <Stack.Screen name="RVW001" component={RVW001} />
          <Stack.Screen name="RVW002" component={RVW002} />
          <Stack.Screen name="RVW003" component={RVW003} />
          <Stack.Screen name="RVW004" component={RVW004} /> */}
        </Stack.Navigator>
      </AlertProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;
