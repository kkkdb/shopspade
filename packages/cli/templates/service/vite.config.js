import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import qiankun from 'vite-plugin-qiankun'
import { baseUrl } from './src/config/config'

const isTest = 1
const origin = isTest ? 'https://testapi.geezdata.com' : 'https://api.geezdata.com'
const APP_NAME = require('./package.json').name

export default defineConfig(() => {
  return {
    base: baseUrl,
    plugins: [
      vue(),
      qiankun(APP_NAME, {
        useDevMode: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    lintOnSave: true,
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*', // 主应用获取子应用时跨域响应头
      },
      host: '0.0.0.0',
      port: 9016,
      proxy: {
        '/api': {
          target: origin,
          changeOrigin: true,
        },
        '/wms_api': {
          target: origin,
          changeOrigin: true,
          logLevel: 'info',
          rewrite: path => path.replace(/^\/wms_api/, '/api/wmsapi'),
        },
        '/idaas_api': {
          target: 'https://testidaas.shopspade.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/idaas_api/, '/api'),
        },
      }, // disableHostCheck: true,
    },
  }
})
