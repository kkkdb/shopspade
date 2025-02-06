import { logout } from '@/common'
import { getCookie } from './cookie'

class HostUrl {
  constructor() {
    // 从localStorage中获取当前IdaasApp
    this.apiURL = localStorage.getItem('apiURL')

    if (getCookie('d_session_id') && !this.apiURL) {
      logout()
    }
  }

  getUrl(name) {
    // eslint-disable-next-line node/prefer-global/process
    if (process.env.NODE_ENV === 'development') {
      return `/${name ? `${name.toLocaleLowerCase()}_api` : 'api'}`
    }
    // 返回当前IdaasApp的baseUrl
    return this.apiURL + (name ? `/${name.toLocaleLowerCase()}api` : '')
  }
}

export default HostUrl
