/**-------------------------------------------
 * 共通Util
 * utils/Realm.tsx
 * ---------------------------------------------*/
/************************************************
 * フォーマット日付文字列取得
 * yyyy/MM/dd HH:mm:ss
 ************************************************/
export const getCurrentDateTime = (): string => {
  let now = new Date();
  const japanTimeOffset = 9 * 60; // 9時間 * 60分
  const japanTime = new Date(now.getTime() + japanTimeOffset * 60 * 1000);
  now = japanTime;

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

/************************************************
 * フォーマット日付文字列取得
 * yyyy/MM/dd
 ************************************************/
export const getCurrentDate = (): string => {
  let now = new Date();
  const japanTimeOffset = 9 * 60; // 9時間 * 60分
  const japanTime = new Date(now.getTime() + japanTimeOffset * 60 * 1000);
  now = japanTime;

  const year = now.getFullYear().toLocaleString('ja-JP');
  const month = (now.getMonth() + 1).toLocaleString('ja-JP').padStart(2, '0');
  const day = now.getDate().toLocaleString('ja-JP').padStart(2, '0');

  return `${year}/${month}/${day}`;
};

/************************************************
 * 日付→文字列取得
 * yyyy/MM/dd HH:mm:ss
 ************************************************/
export const parseStringDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

/************************************************
 * 文字列→日付変換
 * "YYYY/MM/DD HH:mm:ss"
 ************************************************/
export function parseDateString(dateString: string) {
  const parts = dateString.match(
    /(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2}):(\d{2})/,
  );
  if (!parts) {
    throw new Error('Invalid date format');
  }
  const year = parseInt(parts[1], 10);
  const month = parseInt(parts[2], 10) - 1; // JavaScriptの月は0から始まるため、1を引く
  const day = parseInt(parts[3], 10);
  const hour = parseInt(parts[4], 10);
  const minute = parseInt(parts[5], 10);
  const second = parseInt(parts[6], 10);

  return new Date(year, month, day, hour, minute, second);
}
