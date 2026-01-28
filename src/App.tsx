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
      //  'https://i4ez70cwt2.execute-api.ap-northeast-3.amazonaws.com/stage/createPushTokenRg1', //本部

      // 'https://i4ez70cwt2.execute-api.ap-northeast-3.amazonaws.com/stage/createPushTokenRg1_1', //運輸
      // 'https://i4ez70cwt2.execute-api.ap-northeast-3.amazonaws.com/stage/createPushTokenRg1_2', //保税
      // 'https://i4ez70cwt2.execute-api.ap-northeast-3.amazonaws.com/stage/createPushTokenRg1_3', //第二
      // 'https://i4ez70cwt2.execute-api.ap-northeast-3.amazonaws.com/stage/createPushTokenRg1_4', //岡本
      'https://i4ez70cwt2.execute-api.ap-northeast-3.amazonaws.com/stage/createPushTokenRg1_5', //岡明
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
