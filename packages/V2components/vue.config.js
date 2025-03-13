const path = require('path')

module.exports = {
  css: {
    extract: false
  },
  configureWebpack: {
    output: {
      library: 'ShopspadeV2Components'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        return {
          ...options,
          transpileOnly: true
        }
      })
  }
}