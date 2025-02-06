<script setup>
import { appCode, biEntry } from '@/config/config'
import { useStore } from '@/store/index'
import eventBus from '@/utils/eventBus'
import { AppstoreOutlined } from '@ant-design/icons-vue'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { computed, onMounted, ref } from 'vue'
import useClipboard from 'vue-clipboard3'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { toClipboard } = useClipboard()
const state = ref({
  a: 1,
  openKeys: [],
  selectedKeys: [],
  menuList: [],
})
onMounted(() => {
  state.value.openKeys = getOpenKeys()
  state.value.selectedKeys = [getRouteName()]
  getMenuList()
})

const currentApp = computed(() => {
  return store.currentApp
})
function getOpenKeys() {
  const fullPath = route.fullPath
  return fullPath.split('/').slice(1, 2)
}
function getRouteName() {
  const fullPath = route.fullPath
  return fullPath.split('/').reverse()?.[0]
}
async function handleClick(value) {
  if (value.key === 'workbench')
    return
  const kPath = value.keyPath
  if (value.key === getRouteName())
    return
  if (value.keyPath.includes('biDashboard')) {
    await toClipboard(store.userInfo.merchantCode)
    window.open(biEntry)
    return
  }
  // 微应用跳转
  const url = kPath.join('/')
  const name = kPath[kPath.length - 1]
  const baseUrl = qiankunWindow.__POWERED_BY_QIANKUN__ ? `${appCode}` : ''
  store.addPane({ view: baseUrl ? `${baseUrl}/${url}` : url, name })
  router.push({ path: baseUrl ? `/${baseUrl}/${url}` : `/${url}` })
}
function changeActive(value) {
  state.value.selectedKeys = [value.name]
}
const collapsed = computed(() => {
  return store.collapsed
})

const isSub = computed(() => {
  return qiankunWindow.__POWERED_BY_QIANKUN__
})
function getMenuList(list) {
  let menuList = list || store.menuList
  if (window.__POWERED_BY_QIANKUN_PARENT__) {
    // 如果是erp环境 加个菜单 XXX工作台
    menuList = [
      {
        view: 'workbench',
        icon: 'icon iconfont icon-home',
        children: [],
      },
      ...menuList,
    ]
  }
  state.value.menuList = menuList
}
function onOpenKeysChange(value) {
  state.value.openKeys = value
}

function showDrawer() {
  eventBus.config.globalProperties.$showAppDrawer()
}

defineExpose({
  changeActive,
})
</script>

<template>
  <div :class="`sidebar ${collapsed ? 'collapsed' : ''}`">
    <div class="logo">
      <AppstoreOutlined v-if="isSub" class="appstore-icon" @click="showDrawer" />
      <div class="logoMini">
        <img :class="`${collapsed ? 'logoImg' : 'logoImgLeft'}`" src="../../assets/image/logoLeft.png" alt="">
        <img :class="`${collapsed ? 'logoImgC' : 'logoImgRight'}`" src="../../assets/image/logoRight.png" alt="">
      </div>
    </div>
    <a-menu
      v-model:open-keys="state.openKeys" v-model:selected-keys="state.selectedKeys" class="sideMenu" mode="inline"
      :inline-collapsed="collapsed" @open-change="onOpenKeysChange" @click="handleClick"
    >
      <template v-for="item in state.menuList">
        <a-sub-menu
          v-if="item.children && item.children.length" :key="item.view || item.name"
          :class="`${collapsed ? 'collapsedLi' : ''}`"
        >
          <template #icon>
            <span :class="`iconfont ${item.icon}`" class="iconNav" />
          </template>
          <template #title>
            {{ $t(`menu.${item.view}`) }}
          </template>
          <a-menu-item v-for="child in item.children" :key="child.view">
            {{ $t(`menu.${child.view}`) }}
          </a-menu-item>
        </a-sub-menu>
        <a-menu-item v-else :key="item.view || item.name">
          <template #icon>
            <span :class="`iconfont ${item.icon}`" class="iconNav" />
          </template>
          <span v-if="currentApp.name">{{ currentApp.name }}</span>
          <span>{{ $t(`menu.${item.view}`) }}</span>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 185px;
  height: 100%;
  float: left;
  background-color: #ffffff;
  transition: all 0.2s;

  .logo {
    height: 53px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: #0088ff;
  }

  .logoMini {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  ::v-deep(.sideMenu) {
    height: calc(100% - 53px) !important;
    overflow-y: auto !important;
    overflow-x: hidden !important;

    &::-webkit-scrollbar {
      width: 5px;
    }

    &::-webkit-scrollbar-track-piece {
      background: white;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c2;
    }
  }
}

::-webkit-scrollbar {
  width: 30px;
}

.collapsed {
  width: 79px;
  transition: all 0.2s;
}

.logoImg {
  width: 30px;
  height: 30px;
  transition: all 0.3s;
}

.logoImgC {
  display: none;
  transition: all 0.3s;
}

.logoImgLeft {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  transition: all 0.3s;
}

.logoImgRight {
  width: 100px;
  height: 13px;
  transition: all 0.3s;
}

.appstore-icon {
  cursor: pointer;
  color: #fff;
  font-size: 24px;
}
</style>
