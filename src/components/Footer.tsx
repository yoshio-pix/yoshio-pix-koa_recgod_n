/**-------------------------------------------
 * 共通_フッタ
 * components/Footer.tsx
 * ---------------------------------------------*/
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles/CommonStyle'; // 共通スタイル
const Footer = () => {
  useEffect(() => {}, []);

  return (
    <View style={styles.footerContainer}>
      <Text style={[styles.footerText]}>
        Copyright(C) KOA REFRACTRIES CO.LTD.All rights reserved.
      </Text>
    </View>
  );
};

export default Footer;
