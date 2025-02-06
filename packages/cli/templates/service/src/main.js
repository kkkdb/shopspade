import { message } from 'ant-design-vue'
import { createPinia } from 'pinia'
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import { createApp } from 'vue'
import { antdComponents } from './antd'
import App from './App.vue'
import i18n from './language/index'
import router from './router'
import 'ant-design-vue/dist/reset.css'
import './assets/css/common.scss'
import './public-path.js'

// Configure message to show only one at a time
message.config({
  maxCount: 1,
})

const pinia = createPinia()

let instance = null

function render(props = {}) {
  const { container } = props
  // 如果实例已经存在，直接返回
  if (instance)
    return

  instance = createApp(App)
  antdComponents.forEach((item) => {
    instance.use(item)
  })
  instance.use(router).use(pinia).use(i18n)

  const mountElement = container ? container.querySelector('#app') : document.getElementById('app')

  if (mountElement) {
    instance.mount(mountElement)
  }
  else if (!container) {
    // 只在非微前端环境下添加 DOMContentLoaded 监听
    document.addEventListener('DOMContentLoaded', () => {
      const app = document.getElementById('app')
      if (app && !instance._container) {
        instance.mount(app)
      }
    })
  }
}

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}

renderWithQiankun({
  mount(props) {
    render(props)
    props.onGlobalStateChange(() => {
      // console.log('onGlobalStateChange: ', state)
    })
  },
  bootstrap() {
    // console.log('bootstrap')
  },
  unmount() {
    if (instance) {
      instance.unmount()
      instance._container.innerHTML = ''
      instance = null
    }
  },
  update: () => {
    throw new Error('Function not implemented.')
  },
})

if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  // console.log('我正在作为子应用运行')
}
