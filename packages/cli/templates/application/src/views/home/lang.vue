<script setup>
import { useStore } from '@/store/index'
import { GlobalOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { locale } = useI18n()
function changeLanguage(value) {
  locale.value = value.key
  localStorage.setItem('lang', value.key)
  store.changeLang(value.key)
  history.go(0)
}
</script>

<template>
  <a-dropdown placement="bottomRight">
    <div class="name">
      <GlobalOutlined />
    </div>
    <template #overlay>
      <a-menu @click="changeLanguage">
        <a-menu-item key="zh">
          中文
        </a-menu-item>
        <a-menu-item key="en">
          English
        </a-menu-item>
        <a-menu-item key="th">
          ภาษาไทย
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<style scoped>
.name {
  margin-left: 15px;
  color: white;
  cursor: pointer;
}

.iconfont {
  color: white;
  font-size: 18px;
}
</style>
