export interface ApiResponse<T = any> {
  code?: number | string;
  message?: string;
  msg?: string;
  subMsg?: string;
  error?: string;
  subCode?: string;
  error_code?: number;
  result?: T;
  version?: string;
}

export interface UserInfo {
  merchantCode: string;
  [key: string]: any;
}

export interface LanguageMapping {
  [key: string]: string;
}
