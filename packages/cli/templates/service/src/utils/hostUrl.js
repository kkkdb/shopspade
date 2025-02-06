class HostUrl {
  constructor() {
    // 从localStorage中获取当前IdaasApp
    this.apiURL = localStorage.getItem('apiURL')
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
