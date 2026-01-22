/**-------------------------------------------
 * 共通_ヘッダ
 * components/Header.tsx
 * ---------------------------------------------*/
import React from 'react';
import {View, Text} from 'react-native';
import {styles} from '../styles/CommonStyle'; // 共通スタイル
interface Props {
  title: string;
  isRecieve: number;
}
const Header = ({title, isRecieve}: Props) => {
  return (
    <View>
      {isRecieve === 1 && (
        <View style={styles.headerContainerL}>
          <Text style={styles.headerTextL}>{title}</Text>
        </View>
      )}
      {isRecieve === 2 && (
        <View style={styles.headerContainerR}>
          <Text style={styles.headerTextR}>{title}</Text>
        </View>
      )}
      {isRecieve === 3 && (
        <View style={styles.headerContainerK}>
          <Text style={styles.headerTextR}>{title}</Text>
        </View>
      )}
    </View>
  );
};

export default Header;
