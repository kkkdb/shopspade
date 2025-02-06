<script setup>
import api from '@/service/api'
import axios from '@/service/axios'
import { useStore } from '@/store'
import { setCookie } from '@/utils/cookie'
import { message, Modal } from 'ant-design-vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const { t } = useI18n()

const merchantName = ref('')
const dataList = ref([])
const merchantCode = ref('')

async function changeMerchant(item) {
  try {
    const res = await axios.post(api.switchMerchant, {
      merchantCode: item.code,
    })
    merchantName.value = item.name
    localStorage.setItem('merchantName', item.name)
    message.success(t('切换成功'))
    login(res)
  }
  catch (err) {
    console.error(err)
  }
}

function login(userInfo) {
  setCookie({ reportPlatform: 'oms' })
  setCookie({ scmPlatform: 'SCM' })
  store.setMenuList(userInfo.menuList)
  merchantCode.value = userInfo.merchantCode
  localStorage.setItem('userAccount', userInfo.userName)
  localStorage.setItem('merchantCode', merchantCode.value)
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  getShopList()
}

async function getShopList() {
  const res = await axios.post(api.getShopList, {
    status: 1,
    merchantCode: localStorage.getItem('merchantCode'),
  })
  const list = res.list || []
  setParty(list[0])
  for (let i = 0; i < list.length; i++) {
    if (list[i].authStatus === 'AUTH_EXPIRED' && list[i].authExpiredDays < 5) {
      setTimeout(() => {
        Modal.confirm({
          title: list[i].shopName + t('店铺授权快失效了，快去重新授权吧'),
          okText: t('重新授权'),
          cancelText: t('取消'),
          onOk: () => {
            localStorage.removeItem('partyList')
            router.push(`/shop_web/shopManage?shopName=${list[i].shopName}`)
          },
        })
      }, 1500)
      break
    }
  }
}

async function setParty(_party) {
  let party = _party || store.buList[0]
  if (!party) {
    message.warning(t('业务组为空'))
    return
  }
  store.setState({
    currentShop: party,
  })

  try {
    const res = await axios.post(api.switchParty, { buId: party.departmentId || party.id })
    const userSession = res
    party = userSession.currentBu || party
    party.partyId = party.id
    party.partyName = party.name
    userSession.currentParty = party
    store.setState({
      userSession,
    })
    await queryIdaasAppList(userSession.merchantCode)
    router.go(0)
  }
  catch (error) {
    console.error(error)
  }
}

async function getList() {
  try {
    const res = await axios.post(api.merchantList, {})
    dataList.value = res.list || []
  }
  catch {
    return Promise.resolve()
  }
}

async function queryIdaasAppList(merchantCode) {
  try {
    const res = await axios.post(api.queryIdaasAppList, {
      merchantCode,
      appCodes: ['ORDER', 'PLYMOUTH', 'ULTRA_WMS', 'OMS'],
    })
    const list = res
    const obj = {}
    list.forEach((item) => {
      obj[item.appCode] = item
    })
    localStorage.setItem('currentIdaasApp', JSON.stringify(obj))
  }
  catch {
    return Promise.resolve()
  }
}

onMounted(() => {
  getList()
  merchantName.value = store.merchantName
  merchantCode.value = store.merchantCode
})
</script>

<template>
  <div v-if="dataList.length > 1" class="mr20">
    <a-popover :title="$t('商户列表')">
      <template #content>
        <a-row class="box">
          <a-col v-for="(item, index) in dataList" :key="index" class="boxText" :span="12" @click="changeMerchant(item)">
            <span :class="{ 'text-link': merchantCode === item.code }">{{ item.name }}</span>
          </a-col>
        </a-row>
      </template>
      <span class="merchant-name px-4 fz14">
        {{ merchantName }}
      </span>
    </a-popover>
  </div>
</template>

<style lang="scss" scoped>
.box {
  background-color: white;
  margin: -10px;
  border-radius: 4px;
  width: 500px;
  overflow: hidden;
  padding: 12px 8px;
  max-height: 500px;
  overflow-y: auto;
}

.boxText {
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background-color: #d1e8fd;
  }
}

.merchant-name {
  cursor: pointer;
}
</style>
