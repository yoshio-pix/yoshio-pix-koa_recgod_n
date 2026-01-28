/**-------------------------------------------
 * 画面間共有変数
 * atom/atom.tsx
 * ---------------------------------------------*/
import {atom} from 'recoil';
import {receptionRecordConst} from '../types/type';
export const objState = atom<receptionRecordConst>({
  key: 'objState',
  default: {
    time_id: '',
    create_dt: '',
    create_time: '',
    company: '',
    driver: '',
    car: '',
    tel: '',
    ordno: '',
    loadstatus: '',
    receptstatus: '',
  },
});

export const driverState = atom<string>({
  key: 'driverState',
  default: '',
});

export const carState = atom<string>({
  key: 'carState',
  default: '',
});

export const companyState = atom<string>({
  key: 'companyState',
  default: '',
});

export const ordnoState = atom<string>({
  key: 'ordnoState',
  default: '',
});

export const tableDataState = atom({
  key: 'tableDataState', // 一意のキー
  default: [] as string[][], // 初期値は空の配列
});

export const antenaState = atom<string>({
  key: 'antenaState',
  default: '',
});

export const reconnectState = atom<boolean>({
  key: 'reconnectState',
  default: false,
});

export const signState = atom<boolean>({
  key: 'signState',
  default: false,
});

export const testState = atom<number>({
  key: 'testState',
  default: 0,
});

export const modeState = atom<string>({
  key: 'modeState',
  default: '',
});

export const kyotenState = atom<string>({
  key: 'kyotenState',
  default: '',
});

export const numState = atom<string>({
  key: 'numState',
  default: '',
});

export const addUrlState = atom<string>({
  key: 'addUrlState',
  default: '',
});

export const kvw001FlgState = atom<number>({
  key: 'kvw001FlgState',
  default: 0,
});

export const kvw001dataState = atom<receptionRecordConst>({
  key: 'kvw001dataState',
  default: {
    time_id: '',
    create_dt: '',
    create_time: '',
    company: '',
    driver: '',
    car: '',
    tel: '',
    ordno: '',
    loadstatus: '',
    receptstatus: '',
  },
});
