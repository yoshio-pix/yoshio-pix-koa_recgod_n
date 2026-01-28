/**-------------------------------------------
 * 共通_スタイルシート
 * styles/CommonStyle.tsx
 * ---------------------------------------------*/
import {StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  //--------ヘッダ--------
  headerContainerR: {
    backgroundColor: '#F6B1B1', // パステルレッド（やさしい赤）
    height: windowHeight * (1 / 13),
    justifyContent: 'center',
    zIndex: 10,
  },
  headerContainerL: {
    backgroundColor: '#FFF0A5', // パステルイエロー（淡い黄色）
    height: windowHeight * (1 / 13),
    justifyContent: 'center',
    zIndex: 10,
  },
  headerContainerK: {
    backgroundColor: '#B7D4F0', // パステルブルー（淡い青）
    height: windowHeight * (1 / 13),
    justifyContent: 'center',
    zIndex: 10,
  },
  headerTextR: {
    fontSize: windowHeight * (1 / 25),
    color: 'white',
    textAlign: 'center',
    fontFamily: 'ipaexg',
  },
  headerTextL: {
    fontSize: windowHeight * (1 / 25),
    color: 'black',
    textAlign: 'center',
    fontFamily: 'ipaexg',
  },
  headerTextK: {
    fontSize: windowHeight * (1 / 25),
    color: 'black',
    textAlign: 'center',
    fontFamily: 'ipaexg',
  },
  //--------フッタ--------
  footerContainer: {
    backgroundColor: 'black', // フッタの背景色
    height: windowHeight * (1 / 13),
    justifyContent: 'center',
  },
  footerText: {
    fontSize: windowHeight * (1 / 40),
    color: 'white',
    textAlign: 'center',
    fontFamily: 'ipaexg',
  },
  //--------メイン--------
  container: {
    flex: 1,
    justifyContent: 'space-between', // 3つのセクションを縦に均等に配置
    backgroundColor: 'white', // 背景色は白
  },
  topContent: {
    // marginTop: windowHeight * (1 / 20) * -1,
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
  },
  text: {
    fontSize: windowHeight * (1 / 20),
    color: 'black',
    fontWeight: 'bold',
    fontFamily: 'ipaexg',
  },
  textWhite: {
    color: 'white',
    fontFamily: 'ipaexg',
  },
  logo: {
    width: windowWidth * (1 / 2.5),
    resizeMode: 'contain',
  },
  logoMarginRVW: {
    marginTop: windowHeight * (1 / 20) * -1,
    resizeMode: 'contain',
  },
  logoMarginLVW: {
    marginTop: -80,
    marginBottom: 0,
    resizeMode: 'contain',
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 2,
    zIndex: 1,
  },
  bottomSection2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 2,
    marginBottom: 30,
    zIndex: 1,
  },
  bottomSectionMargin: {
    marginTop: windowWidth * (1 / 20) * -1,
  },
  button: {
    backgroundColor: '#548236',
    borderRadius: 10,
    margin: windowHeight * (1 / 30),
    height: windowHeight * (1 / 9),
    width: windowWidth * (1 / 3),
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  buttonCheck: {
    backgroundColor: '#C3D69B',
    borderRadius: 10,
    margin: windowHeight * (1 / 30),
    height: windowHeight * (1 / 9),
    width: windowWidth * (1 / 4),
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  buttonMiddle: {
    backgroundColor: '#548236',
    borderRadius: 10,
    marginLeft: 10,
    height: windowHeight * (1 / 10),
    width: windowWidth * (1 / 6),
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  buttonBack: {
    backgroundColor: '#1e74bd',
  },
  buttonText: {
    fontSize: windowHeight * (1 / 20),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ipaexg',
  },
  buttonCheckText: {
    fontSize: windowHeight * (1 / 20),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ipaexg',
  },
  // 送信ボタンが無効の時のスタイル
  disabledButton: {
    backgroundColor: '#ccc', // 無効化したときの背景色
    color: '#999', // 無効化したときのテキスト色
  },
  buttonSmall: {
    backgroundColor: '#548236',
    borderRadius: 10,
    margin: windowHeight * (1 / 30),
    height: windowHeight * (1 / 20),
    width: windowWidth * (1 / 20),
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  buttonSmall2: {
    backgroundColor: '#1e74bd',
    borderRadius: 6,
    margin: windowHeight * (1 / 30),
    height: windowHeight * (1 / 20),
    width: windowWidth * (1 / 15),
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  buttonSmall3: {
    backgroundColor: '#548236',
    borderRadius: 10,
    // margin: windowHeight * (1 / 80),
    height: windowHeight * (1 / 20),
    width: windowWidth * (1 / 30),
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
  },
  buttonSmallText: {
    fontSize: windowHeight * (1 / 40),
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ipaexg',
  },
  detailButton: {
    margin: windowHeight * (1 / 30),
    height: windowHeight * (1 / 20),
    width: windowWidth * (1 / 15),
    borderRadius: 6,
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
    backgroundColor: '#d9d9d9',
    padding: 5,
    flex: 1,
  },
  detailButtonText: {
    color: 'black',
  },
  //--------テーブル--------
  tableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  innerTableContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
  },
  tableHead: {
    height: 40,
    backgroundColor: 'white',
  },
  tableRows: {
    height: 40,
    backgroundColor: 'white',
  },
  tableText: {
    margin: 6,
    color: 'black',
    fontSize: windowHeight * (1 / 50),
  },
  input: {
    color: 'black',
    fontSize: windowHeight * (1 / 20),
    borderWidth: 1, // 枠線の幅
    borderColor: 'black', // 枠線の色
    padding: 0,
    height: windowHeight * (1 / 13),
    width: windowWidth * (1 / 3), // テキストボックスの最小幅
    textAlign: 'left',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
    paddingLeft: 5,
    marginTop: 10,
    marginBottom: 3,
    backgroundColor: 'white',
  },
  inputDisabled: {
    color: 'black',
    fontSize: windowHeight * (1 / 20),
    padding: 0,
    height: windowHeight * (1 / 13),
    width: windowWidth * (1 / 3), // テキストボックスの最小幅
    textAlign: 'left',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
    paddingLeft: 5,
    marginTop: 10,
    marginBottom: 3,
  },
  labelText: {
    fontSize: windowHeight * (1 / 20),
    marginTop: 10,
    marginBottom: 3,
    fontFamily: 'ipaexg',
    color: '#000',
  },
  alignRight: {
    textAlign: 'right',
  },
  bigBold: {
    fontSize: windowHeight * (1 / 25),
    fontWeight: 'bold',
  },
  //--------整形-------
  tableMain: {
    width: windowHeight, // テーブルの幅を指定
    // 他のスタイル
  },
  tableMainRecept: {
    width: windowWidth, // テーブルの幅を指定
    marginLeft: windowWidth * (1 / 2),
    // 他のスタイル
  },
  tableRow: {
    flexDirection: 'row', // 行のスタイル
  },
  tableCell: {
    flex: 1, // セルのスタイル
  },
  tableCell1: {
    flex: 1,
  },
  tableCell2: {
    flex: 2,
  },
  tableCell3: {
    flex: 3,
  },
  tableCell4: {
    flex: 4,
  },
  tableCell5: {
    flex: 5,
  },
  //--------調整--------
  flex1: {
    flex: 1,
  },
  containerWithKeybord: {
    justifyContent: 'center',
    backgroundColor: '#fff', // 背景色は白
  },
  flexGrow1: {
    flexGrow: 1,
  },
  centerContent: {
    textAlign: 'center',
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  receptView: {
    backgroundColor: '#e6f4c8',
    opacity: 1,
    zIndex: 0,
    padding: 3,
    marginTop: windowHeight * (1 / 20) * -1,
  },
  zIndex1: {
    zIndex: 3,
  },
  marginBottom10: {
    marginBottom: windowHeight * (1 / 20),
  },
  marginBottomM10: {
    marginBottom: -300,
  },
  //--------カスタムアラート-------
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040',
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  modalMessage: {
    textAlign: 'center',
  },
  //--------カスタムアラート-------
  alertView: {
    width: windowWidth * (1 / 2), // テキストボックスの最小幅
    height: windowHeight * (1 / 2), // テキストボックスの最小幅
    backgroundColor: '#f2f2f2',
  },
  alertMessageView: {
    width: windowWidth * (1 / 2), // テキストボックスの最小幅
    height: windowHeight * (1 / 2), // テキストボックスの最小幅
  },
  alertButtonContainer: {
    borderTopColor: '#000', // ボーダーの色をグレーに設定
    borderTopWidth: 1, // ボーダーの太さを1に設定
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertButton: {
    flex: 1, // ボタンに利用可能なスペースを等分に使用
    borderRadius: 7,
    padding: 10,
    margin: 1,
    marginLeft: 2,
    marginRight: 2,
    width: 300,
  },
  alertButtonCancel: {
    backgroundColor: '#f1d2c1', // 薄いピンク
  },
  alertButtonConfirm: {
    backgroundColor: '#007AFF', // 青色
  },
  alertTitleBar: {
    backgroundColor: '#1e74bd', // 青色
    height: 40,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ipaexg',
    fontSize: 24,
  },
  alertMessage: {
    fontFamily: 'ipaexg',
    color: 'black', // テキストが黒色の場合
    padding: 5,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
    fontSize: windowHeight * (1 / 20), // テキストボックスの最小幅
  },
  alertTextConfirm: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ipaexg',
    fontSize: windowHeight * (1 / 20), // テキストボックスの最小幅
  },
  alertTextCancel: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ipaexg',
    fontSize: windowHeight * (1 / 20), // テキストボックスの最小幅
  },

  tableHeadContainer: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 10, // お好みで調整
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  cell2: {
    flex: 2,
    padding: 10, // お好みで調整
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  cell3: {
    flex: 3,
    padding: 10, // お好みで調整
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerCell: {
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 2,
    borderColor: '#000',
  },
  headerText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: windowHeight * (1 / 40), // テキストボックスの最小幅    // 他のテキストスタイリング
  },
  cellText: {
    color: 'black',
    fontSize: windowHeight * (1 / 40), // テキストボックスの最小幅    // 他のテキストスタイリング
    margin: windowHeight * (1 / 60),

    // テキストスタイリング
  },
  cellColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // RN 0.71+ ならOK
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  dataWrapper: {
    // 必要ならスタイリングを追加
  },
  recept: {
    width: windowWidth * (2 / 3),
    alignItems: 'center',
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
  },
  pickerStyle: {
    borderWidth: 1, // 枠線の幅
    borderColor: '#000', // 枠線の色
    height: 60,
    marginTop: 0,
    fontSize: windowHeight * (1 / 40),
  },
  marginRight: {
    marginRight: 10,
  },
  marginLeft: {
    marginLeft: 10,
  },
  //--------ポップアップ-------
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 透明度を持たせた黒でオーバーレイ
  },
  modalView: {
    height: windowHeight * 0.8,
    width: windowWidth * 0.8,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButtonBottom: {
    marginTop: 20,
    padding: 10,
  },
  modalInputView: {
    height: 200,
    width: 300,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center', // 子要素を垂直方向に中央揃えにする
    justifyContent: 'center', // 子要素を水平方向に左揃えにする
  },
  scrollViewStyle: {
    borderWidth: 1, // 枠線の幅
    borderColor: '#000', // 枠線の色
    borderRadius: 5, // 枠の角を丸くする場合
    paddingLeft: 5,
    paddingRight: 5,
  },
  popupCloseButton: {
    marginTop: 10,
    width: windowWidth * 0.1,
    height: windowWidth * 0.05,
    backgroundColor: '#1e74bd',
    color: '#FFF',
  },
  itemcenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemRow: {
    flexDirection: 'row',
  },
  pickerText: {
    marginTop: -15,
  },
  detailButtonOrd: {
    margin: windowHeight * (1 / 40),
    height: windowHeight * (1 / 15),
    width: windowWidth * (1 / 4),
    borderRadius: 6,
    justifyContent: 'center', // 子要素を垂直方向に中央揃え
    alignItems: 'center', // 子要素を水平方向に中央揃え
    backgroundColor: '#d9d9d9',
    padding: 5,
    flex: 1,
  },
  detailButtonTextOrd: {
    color: 'black',
    fontSize: 20,
  },
  /* ================================
   * 明細テーブル（商品・数量・備考）
   * ================================ */
  detailTableOrd: {
    width: '95%', // ← 重要：横幅を確保
    alignSelf: 'center', // ← 中央寄せ
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#444',
    backgroundColor: '#fff',
  },

  tableRowOrd: {
    flexDirection: 'row',
  },

  /* ヘッダ */
  headerCellOrd: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#444',
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    flex: 3, // 仮（後で上書き）
  },

  /* 明細セル */
  bodyCellOrd: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 15,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#444',
    textAlign: 'left',
    flex: 3, // 仮
  },

  //--------------------
});
