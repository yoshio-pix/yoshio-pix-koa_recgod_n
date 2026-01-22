// App.tsx
import AppNavigator from './navigation/AppNavigator';
import React, {useEffect} from 'react';
import {Buffer} from 'buffer';
import {RecoilRoot} from 'recoil';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
let uniqueId = '';
const sendTokenToServer = async (token: string) => {
  try {
    uniqueId = await DeviceInfo.getUniqueId();
    console.log(uniqueId);
    const response = await axios.post(
      // 'https://n95lmcgaz7.execute-api.ap-northeast-1.amazonaws.com/stage/createPushToken3', //本部
      'https://n95lmcgaz7.execute-api.ap-northeast-1.amazonaws.com/stage/createPushToken3_1', //保税
      // 'https://n95lmcgaz7.execute-api.ap-northeast-1.amazonaws.com/stage/createPushToken3_2', //岡セラ
      // 'https://n95lmcgaz7.execute-api.ap-northeast-1.amazonaws.com/stage/createPushToken3_3', //大ヶ池
      // 'https://n95lmcgaz7.execute-api.ap-northeast-1.amazonaws.com/stage/createPushToken3_4', //運輸
      {
        token: token,
        userId: uniqueId,
      },
    );
    console.log('Token sent to server:', response.data);
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

global.Buffer = Buffer;
const App = () => {
  useEffect(() => {}, []);
  useEffect(() => {
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        sendTokenToServer(token);
      }
    }

    requestUserPermission();
  }, []);

  return (
    <RecoilRoot>
      <AppNavigator />
    </RecoilRoot>
  );
};
export default App;
