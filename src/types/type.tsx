/**-------------------------------------------
 * インターフェース定義
 * utils/type.tsx
 * ---------------------------------------------*/
export interface receptionRecordConst {
  time_id: string;
  create_dt: string;
  create_time: string;
  company: string;
  driver: string;
  car: string;
  tel: string;
  ordno: string;
  record?: ReceptionDetail;
  loadstatus: string;
  receptstatus: string;
}

export interface ReceptionDetail {
  date: string;
  ordno: string;
  product: string;
  num: string;
  biko: string;
}
