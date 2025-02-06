<script setup>
import { appCode, apps } from '@/config/config'
import actions from '@/qiankun/actions'
import { useStore } from '@/store/index'
import { registerMicroApps, start } from 'qiankun'
import { nextTick, onMounted } from 'vue'

const store = useStore()

function getActiveRule(appInfo) {
  if (appInfo.activeRule && Array.isArray(appInfo.activeRule)) {
    if (window.__POWERED_BY_QIANKUN_PARENT__) {
      return appInfo.activeRule.map(item => `${appCode}/${item}`)
    }
    return appInfo.activeRule
  }
  return window.__POWERED_BY_QIANKUN_PARENT__ ? `${appCode}/${appInfo.name}` : `/${appInfo.name}`
}

onMounted(() => {
  if (!window.qiankunStarted) {
    // 遍历store.subMerchantAppList，在apps中找到对应的值
    const microApps = new Map()
    store.subMerchantAppList.forEach((item) => {
      const appInfo = apps.find(elem => elem.appCode.includes(item.appCode))
      if (appInfo && !microApps.has(appInfo.name)) {
        const activeRule = appInfo.activeRule || `/${appInfo.name}`
        microApps.set(appInfo.name, {
          ...appInfo,
          container: '#subapp-viewport',
          activeRule: getActiveRule(appInfo),
          props: {
            routerBase: activeRule,
            getGlobalState: actions.getGlobalState,
            addPane: store.addPane,
            priv: () => true,
          },
          loader: (loading) => {
            if (loading) {
              store.setState({ dashboard_loading: true })
            }
            else {
              store.setState({ dashboard_loading: false })
            }
          },
        })
      }
    })
    const arr = Array.from(microApps.values())
    // eslint-disable-next-line no-console
    console.log('开通的服务有：', arr)
    registerMicroApps(arr)
    window.qiankunStarted = true
    nextTick(() => {
      start()
    })
  }
})
</script>

<template>
  <div class="micro-web" />
</template>
