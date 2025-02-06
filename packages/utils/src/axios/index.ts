import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { deleteCookie, getCookie } from '../cookie'
import { Modal, message } from 'ant-design-vue'
import axios from 'axios'
import JSONBig from 'json-bigint'
import type { ApiResponse, LanguageMapping, UserInfo } from './types'

const Axios: AxiosInstance = axios.create({
  baseURL: '/',
})

Axios.defaults.baseURL = '/'
Axios.defaults.timeout = 600000
Axios.defaults.withCredentials = true
Axios.defaults.maxRedirects = 0
Axios.defaults.headers.post['Content-Type'] = 'application/json'
Axios.defaults.transformResponse = [
  (data: string) => {
    try {
      return JSONBig.parse(data)
    } catch (e) {
      return data
    }
  },
]

// 请求拦截
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.url) {
      throw new Error('URL is required')
    }

    const token = getCookie('d_session_id')
    if (token && config.headers) {
      config.headers.Authorization = token
    }

    if (config.url.startsWith('null')) {
      const apiURL = localStorage.getItem('apiURL')
      config.url = config.url.replace('null', apiURL || '')
    }

    const language_mapping: LanguageMapping = {
      zh: 'zh_CN',
      en: 'en_US',
      th: 'th_TH',
    }

    const storedLang = localStorage.getItem('lang')
    const lang = storedLang ? language_mapping[storedLang] : navigator.language

    if (config.url) {
      config.url =
        config.url.indexOf('language') > -1
          ? config.url
          : `${config.url}?language=${lang?.replaceAll('-', '_')}`
    }

    const requestId = guid()
    config.url += `&requestId=${requestId}`

    const userInfoStr = localStorage.getItem('userInfo')
    const userInfo: UserInfo | null = userInfoStr ? JSON.parse(userInfoStr) : null

    config.data = config.data || {}
    config.data.merchant_code = userInfo?.merchantCode || ''

    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应拦截
Axios.interceptors.response.use(
  (result: AxiosResponse<ApiResponse>) => {
    const data: ApiResponse = result.data
      ? typeof result.data === 'string'
        ? JSON.parse(result.data)
        : result.data
      : result

    const token = getCookie('d_session_id')
    if (!token && location.pathname !== '/login') {
      goToLogin()
      return Promise.reject(new Error('No token found'))
    }

    if (data) {
      if (data.version) {
        return Promise.resolve(data)
      }
      if (data.code && data.code !== 1000000) {
        if (data.msg || data.message) {
          message.error(data.msg || data.message)
        }
        return Promise.reject(data)
      }
      return Promise.resolve(data.result)
    }

    return Promise.reject(new Error('Invalid response data'))
  },
  (err: any) => {
    const token = getCookie('d_session_id')
    if (token) {
      const data: ApiResponse = err?.response?.data

      if (err?.name === 'SyntaxError' && err?.text?.indexOf('404') < 0) {
        message.error(err?.message || JSON.stringify(err))
      }

      if (err?.response?.status === 404) {
        return Promise.reject(data)
      }

      if (data) {
        if (
          data.code === 'sys.user-error' ||
          data.subCode === 'sys.user-error-unlogin' ||
          data.msg === 'session is invalid' ||
          data.error_code === 5001
        ) {
          console.log(JSON.stringify(err))
          goToLogin()
        } else if (data.error) {
          message.error(data.error)
        } else {
          message.error(data.msg || data.subMsg || data.message)
        }
        return Promise.reject(data)
      }
      return Promise.reject(data)
    }
    goToLogin()
    return Promise.reject(new Error('No token found'))
  }
)

function goToLogin(): void {
  Modal.destroyAll()
  Modal.confirm({
    title: '登录过期,请重新登录',
    okText: '重新登录',
    cancelText: '取消',
    onOk: () => {
      deleteCookie(undefined, {}, () => {
        window.location.href = '/login'
        localStorage.setItem('pageCacheFullPath', location.pathname)
      })
    },
  })
}

const getDateTimeStr = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  return `${year}${month}${day}${hour}${minute}${second}`
}

export function guid(): string {
  const time = getDateTimeStr()
  const userAccount = localStorage.getItem('userAccount') || ''
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  return `rqname${userAccount}${time}${s4()}`
}

export default Axios
