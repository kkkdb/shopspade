<script setup>
import { ConfigProvider } from 'ant-design-vue'
import enUS from 'ant-design-vue/es/locale/en_US'
import thTH from 'ant-design-vue/es/locale/th_TH'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { computed, onMounted } from 'vue'

const locale = computed(() => {
  const lang = localStorage.getItem('lang') || 'zh'
  return {
    zh: zhCN,
    en: enUS,
    th: thTH,
  }[lang]
})

function getPopupContainer(el, dialogContext) {
  if (dialogContext) {
    return dialogContext.getDialogWrap()
  }
  return document.body
}

onMounted(() => {
  localStorage.setItem('zoomRate', 1)
})
</script>

<template>
  <ConfigProvider prefix-cls="app" :locale="locale" :get-popup-container="getPopupContainer">
    <router-view />
  </ConfigProvider>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  min-width: 1024px;
  height: 100%;
}
</style>
