export interface UserInfo {
  properties: Properties[];
  First_Name: string;
  Last_Name: string;
  Phone_Number: string;
  'E-mail': string;
  Region: string;
  usertype: string;
  uid: string;
}

export interface Properties {
  key:   string;
  label: string;
  value: string;
}
