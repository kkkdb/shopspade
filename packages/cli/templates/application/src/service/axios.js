import { getDateStr } from '@/common/getDateStr'
import i18n from '@/language/index'
import { deleteCookie, getCookie } from '@/utils/cookie'
import { message } from 'ant-design-vue'
import axios from 'axios'
import JSONBig from 'json-bigint'

const t = i18n.global.t
const Axios = axios.create({
  baseURL: '/',
})
// 超时时间（ms）
Axios.defaults.timeout = 600000
// axios请求开启cookie，支持跨域请求携带cookie
Axios.defaults.withCredentials = true
Axios.defaults.maxRedirects = 0
Axios.defaults.headers.post['Content-Type'] = 'application/json'
Axios.defaults.transformResponse = [
  (data) => {
    return JSONBig.parse(data)
  },
]
// 请求拦截
Axios.interceptors.request.use(
  (config) => {
    const token = getCookie('d_session_id')
    if (token) {
      // 将token放到请求头发送给服务器,将tokenkey放在请求头中
      config.headers.Authorization = token
    }
    if (config.url.startsWith('null')) {
      config.url = config.url.replace('null', localStorage.getItem('apiURL'))
    }
    const language_mapping = {
      zh: 'zh_CN',
      en: 'en_US',
      th: 'th_TH',
    }
    const lang = language_mapping[localStorage.getItem('lang')] || navigator.language
    if (config.url) {
      config.url = config.url.includes('language') ? config.url : `${config.url}?language=${lang?.replaceAll('-', '_')}`
    }
    const requestId = guid()
    config.url += `&requestId=${requestId}`
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null
    config.data = config.data ? config.data : {}
    config.data.merchant_code = userInfo ? userInfo.merchantCode : ''
    return config
  },
  (error) => {
    return error
  },
)
// 响应拦截
Axios.interceptors.response.use(
  (result) => {
    const data = result.data ? (typeof result.data === 'string' ? JSON.parse(result.data) : result.data) : result
    const token = getCookie('d_session_id')
    if (!token && location.pathname !== '/login') {
      goToLogin()
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
  },
  (err) => {
    // eslint-disable-next-line no-console
    console.log('返回结果err', err)
    const token = getCookie('d_session_id')
    if (token) {
      if (err?.name === 'SyntaxError' && err?.text.indexOf('404') < 0) {
        // 这个报错是因为域名部署在国外，不翻墙有时候被拦截 （失败）net::ERR_CONNECTION_RESET
        message.error(t('网络异常') + err?.message || JSON.stringify(err))
      }
      const data = err?.response?.data
      if (err?.response?.status === 404) {
        return Promise.reject(data)
      }
      if (data) {
        if (
          data.code === 'sys.user-error'
          || data.subCode === 'sys.user-error-unlogin'
          || data.msg === 'session is invalid'
          || data.error_code === 5001
        ) {
          // eslint-disable-next-line no-console
          console.log(JSON.stringify(err))
          goToLogin()
        }
        else if (data.error) {
          message.error(data.error)
        }
        else {
          message.error(data.msg || data.subMsg || data.message)
        }
        return Promise.reject(data)
      }
      return Promise.reject(data)
    }
    goToLogin()
  },
)

function goToLogin() {
  deleteCookie(() => {
    window.location.href = '/login'
    localStorage.setItem('pageCacheFullPath', location.pathname)
    message.error(t('登录过期'))
  })
}

export function guid() {
  const time = getDateStr(0, true).replace(/\D/g, '')
  const userAccount = localStorage.getItem('userAccount')
  const s4 = () =>
    Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  return `rqname${userAccount}${time}${s4()}`
}

export default Axios
