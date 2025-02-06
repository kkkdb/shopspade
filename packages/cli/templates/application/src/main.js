import { appCode } from '@/config/config'
import { message } from 'ant-design-vue'
import { createPinia } from 'pinia'
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'
import { createApp } from 'vue'
import { antdComponents } from './antd'
import App from './App.vue'
import i18n from './language/index'
import router from './router'
import eventBus from './utils/eventBus.js'
import globalEmit from './utils/globalEmit.js'
import 'ant-design-vue/dist/reset.css'
import './public-path.js'

// 设置一个全局参数，让孙应用知道在哪个环境
window.__QIANKUN_PARENTNAME__ = appCode
window.document.title = appCode
localStorage.setItem('appCode', appCode)

const pinia = createPinia()

message.config({
  maxCount: 1,
})

let instance = null

function render(props = {}) {
  const { container, erpLogout, erpJump, showAppDrawer } = props
  // console.log("props: ", props)
  instance = createApp(App)
  if (erpLogout) {
    // 接收父应用传递的函数
    eventBus.provide('erpLogout', erpLogout)
    eventBus.provide('erpJump', erpJump)
    eventBus.provide('showAppDrawer', showAppDrawer)

    // 将父应用传递的函数注册到全局事件总线中
    eventBus.config.globalProperties.$erpLogout = erpLogout
    eventBus.config.globalProperties.$erpJump = erpJump
    eventBus.config.globalProperties.$showAppDrawer = showAppDrawer
  }
  antdComponents.forEach((item) => {
    instance.use(item)
  })

  instance.directive('focus', {
    mounted(el) {
      el.focus()
    },
  })
  instance.config.globalProperties.$message = message
  instance.use(router).use(pinia).use(i18n)
  if (container) {
    instance.mount(container.querySelector('#app'))
  }
  else {
    const app = document.getElementById('app')
    // console.log("app: ", app)
    if (app) {
      instance.mount(app)
    }
    else {
      document.addEventListener('DOMContentLoaded', () => {
        const app = document.getElementById('app')
        if (app) {
          // 执行渲染逻辑
          instance.mount(app)
        }
        else {
          console.error('Element with id "app" not found')
        }
      })
    }
  }
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    // console.log('我正在作为子应用运行')
  }
}

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}

renderWithQiankun({
  mount(props) {
    render(props)
    props.onGlobalStateChange((state) => {
      // console.log('onGlobalStateChange: ', state)
      globalEmit.emit('menuChange', state.menuList)
    })
  },
  bootstrap() {
    // console.log('bootstrap')
  },
  unmount() {
    instance.unmount()
    instance._container.innerHTML = ''
    instance = null
  },
  update: () => {
    throw new Error('Function not implemented.')
  },
})
