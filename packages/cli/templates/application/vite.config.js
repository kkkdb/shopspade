import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import qiankun from 'vite-plugin-qiankun'
import { baseURL } from './src/config/config'

const now = new Date().getTime()
const isTest = 1
const origin = isTest
  ? 'https://testapi.geezdata.com'
  : 'https://api.geezdata.com'
const APP_NAME = require('./package.json').name

// 创建代理配置的函数
function createProxyConfig(services) {
  return services.reduce((config, service) => {
    config[`/${service}_api`] = {
      target: origin,
      changeOrigin: true,
      ...(service === 'wms' ? { logLevel: 'info' } : {}),
      rewrite: path =>
        path.replace(new RegExp(`^/${service}_api`), `/api/${service}api`),
    }
    return config
  }, {})
}

export default defineConfig(() => {
  return {
    // eslint-disable-next-line node/prefer-global/process
    base: process.env.NODE_ENV === 'development' ? '/' : baseURL,
    define: {
      // 定义全局变量
      __APP_VERSION__: now,
    },
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
      port: 8088,
      proxy: {
        '/api': {
          target: origin,
          changeOrigin: true,
        },
        ...createProxyConfig([
          'wms',
          'idaas',
          'shop',
          'order',
          'goods',
          'scm',
          'inventory',
          'after_sale',
          'work_order',
          'report',
          'strategy',
          'region',
          'fms',
        ]),
      }, // disableHostCheck: true,
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/css/common.scss" as *;`,
        },
        less: {
          modifyVars: {
            '@ant-prefix': 'app-', // 修改 Ant Design Vue 类名前缀
          },
          javascriptEnabled: true, // 启用 LESS 中的 JavaScript 支持
        },
      },
    },
  }
})
