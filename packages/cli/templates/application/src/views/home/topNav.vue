<script setup>
import { logout } from '@/common'
import ChangePassword from '@/components/changePassword/index.vue'
import { useStore } from '@/store/index'
import deepClone from '@/utils/deepClone'
import eventBus from '@/utils/eventBus'
import { DownOutlined } from '@ant-design/icons-vue'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { computed, onMounted, ref } from 'vue'
import Lang from './lang.vue'
import MerchantList from './merchantList.vue'

const store = useStore()
const changePwdVisible = ref(false)
const loading = ref(false)

onMounted(() => {
  fetchShopList()

  if (!localStorage.getItem('subMerchantAppList')) {
    reload()
  }
})

const shopList = ref([])
function fetchShopList() {
  const map = new Map()
  store.shopList?.forEach((item) => {
    const key = item.departmentId
    if (map.has(key)) {
      const mapItem = map.get(item.departmentId)
      mapItem.children.push(item)
      map.set(key, mapItem)
    }
    else {
      map.set(key, {
        departmentName: item.departmentName,
        children: [item],
      })
    }
  })
  const arr = []
  map.forEach((value) => {
    arr.push(value)
  })
  shopList.value = arr
  let currentShop = deepClone(store.currentShop)
  const userSession = deepClone(store.userSession)
  if (currentShop?.departmentId !== userSession?.currentParty?.partyId) {
    currentShop = arr ? arr[0].children[0] : {}
    store.setState({
      currentShop,
    })
  }
}

const showHelpCenter = computed(() => {
  const appCode = localStorage.getItem('appCode')
  return ['OMS', 'WMS'].includes(appCode)
})

const currentApp = computed(() => {
  return store.currentApp
})

const currentShop = computed(() => {
  return store.currentShop
})

const subMerchantAppList = computed(() => {
  return store.userInfo?.subMerchantAppList
})

const isSub = computed(() => {
  return qiankunWindow.__POWERED_BY_QIANKUN__
})

function goToHelpCenter() {
  const appCode = localStorage.getItem('appCode')
  const urlMap = {
    OMS: 'https://oms.geezdata.com',
    WMS: 'https://wms.geezdata.com',
  }
  const url = localStorage.lang === 'zh' ? `${urlMap[appCode]}/doc/index.html` : `${urlMap[appCode]}/doc/en/index.html`
  window.open(url, '_blank')
}

function toggleCollapsed() {
  store.changeXCollapsed()
}
function menuClickHandle(value) {
  switch (value.key) {
    case 'ch':
      logoutHandle()
      break
    case 'changePwd':
      changePwdVisible.value = true
      break
  }
}
function logoutHandle() {
  if (isSub.value) {
    eventBus.config.globalProperties.$erpLogout()
  }
  else {
    logout()
  }
}
function switchApp({ key }) {
  if (currentApp.value.appCode === key)
    return
  const app = subMerchantAppList.value.find(item => item.appCode === key)
  store.setState({
    currentApp: app,
  })
  localStorage.removeItem('floatTabList')
  eventBus.config.globalProperties.$erpJump(key)
}
function dropClick(item) {
  if (item.departmentId) {
    const currentShop = deepClone(item)
    try {
      if (currentShop.children) {
        currentShop.children = undefined
      }
      store.setState({
        currentShop,
      })
    }
    catch {
    }
    if (!item || store.userSession?.currentParty?.uniqueCode === item.uniqueCode)
      return
    if (store.userSession?.currentParty && String(item.departmentId) === String(store.userSession?.currentParty.partyId)) {
      message.success(t('切换成功'))
      setTimeout(() => {
        history.go(0)
      }, 500)
      return // 相同的业务组
    }
    axios.post(api.switchParty, { buId: item.departmentId }).then((res) => {
      const userSession = res.userSession
      const party = userSession.currentBu
      party.partyId = party.id
      party.partyName = party.name
      userSession.merchant = {
        merchantCode: userSession.merchantCode,
      }
      userSession.user = {
        name: userSession.userName,
        id: userSession.userCode,
      }
      userSession.currentParty = party // 接口换了 只好前端来兼容
      store.setState({
        userSession,
      })
      message.success(t('切换成功'))
      setTimeout(() => {
        history.go(0)
      }, 500)
    })
  }
}
function reload() {
  if (!loading.value) {
    loading.value = true
    store.getSession(() => {
      history.go(0)
    })
  }
}
</script>

<template>
  <div class="topNav">
    <span type="primary" class="iconCollapsed" @click="toggleCollapsed">
      <span v-if="store.collapsed" class="iconfont icon-a-Leftindent" />
      <span v-else class="iconfont icon-a-Rightindent" />
    </span>
    <a-dropdown v-if="isSub">
      <a class="ant-dropdown-link pl20 fz16" style="color: white; margin-right: auto" @click.prevent>
        {{ currentApp.name }}
        <DownOutlined />
      </a>
      <template #overlay>
        <a-menu @click="switchApp">
          <template v-for="item in subMerchantAppList" :key="item.appCode">
            <a-menu-item>
              <span rel="noopener noreferrer" :class="{ 'text-link': item.appCode === currentApp.appCode }">
                {{ item.name }}
              </span>
            </a-menu-item>
          </template>
        </a-menu>
      </template>
    </a-dropdown>
    <div class="relogin mr20 fz14" @click="reload">
      {{ $t("刷新权限") }}
      <a-spin :spinning="loading" />
    </div>
    <MerchantList />
    <div class="contentNav">
      <div class="flex items-center space-x-4 cursor-pointer">
        <a-popover :title="$t('店铺列表')">
          <template #content>
            <div class="shop-list-box">
              <div v-for="item in shopList" :key="item.departmentId">
                <a-row>
                  <a-col :span="24" class="box-title">
                    {{ item.departmentName }}
                  </a-col>
                </a-row>
                <a-row>
                  <a-col v-for="(otem, index) in item.children" :key="index" :span="12">
                    <div
                      class="box-text" :class="{
                        active: otem.uniqueCode === currentShop.uniqueCode,
                      }"
                      @click="dropClick(otem)"
                    >
                      {{ otem.shopName }}
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
          </template>
          <span class="shop-name px-4 fz14">
            {{ currentShop?.name || currentShop?.shopName }}
          </span>
        </a-popover>
      </div>

      <a-dropdown placement="bottomRight">
        <div class="name fz14">
          {{ store.userInfo?.realName || `user` }}
        </div>
        <template #overlay>
          <a-menu @click="menuClickHandle">
            <a-menu-item key="changePwd">
              <span class="iconfont icon-lock mr10" /> {{ $t("修改密码") }}
            </a-menu-item>
            <a-menu-item key="ch">
              <span class="iconfont icon-a-Shutdown mr10" /> {{ $t("退出") }}
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
      <div v-if="showHelpCenter" class="fz14 ml20" style="color: white; cursor: pointer" @click="goToHelpCenter">
        {{ $t(`帮助中心`) }}
        <span style="margin-left: 2px; font-size: 16px" />
      </div>
      <Lang />
    </div>
    <ChangePassword :visible="changePwdVisible" @success="logoutHandle" @close="changePwdVisible = false" />
  </div>
</template>

<style lang="scss" scoped>
.topNav {
  height: 53px;
  width: 100%;
  // font-size: 16px;
  background-color: #0088ff;
  line-height: 53px;
  color: white;
  padding: 0 16px;
  display: flex;
  align-items: center;

  .relogin {
    cursor: pointer;
    margin-left: auto;
  }

  .contentNav {
    display: flex;
    flex-direction: row;
    float: right;

    .name {
      margin-left: 20px;
    }

    .iconfont {
      color: white;
      font-size: 18px;
    }
  }
}

.iconCollapsed:hover {
  cursor: pointer;
}

.message-list {
  .message-item {
    line-height: 30px;

    .content-sub-title {
      color: gray;
    }

    .content-title {
      font-weight: bold;
    }
  }
}

.name {
  cursor: pointer;
}

.shop-name {
  cursor: pointer;
}

.shop-list-box {
  max-height: 500px;
  min-height: 200px;
  overflow-y: auto;
  width: 400px;
  padding: 10px;

  .boxText {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.box-title {
  font-weight: bold;
  font-size: 16px;
}

.box-text {
  cursor: pointer;

  &:hover {
    color: #0088ff;
  }
}
</style>
