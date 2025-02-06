import { appCode } from '@/config/config'
import router from '@/router'
import api from '@/service/api'
import axios from '@/service/axios'
import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
  // other options...
  state: () => {
    return {
      collapsed: sessionStorage.getItem('collapsed') === 'true',
      userInfo: getData('userInfo', {}),
      userSession: getData('userSession', {}),
      currentApp: getData('currentApp', {}),
      merchantId: localStorage.getItem('merchantId') || '',
      merchantCode: localStorage.getItem('merchantCode') || '',
      merchantName: localStorage.getItem('merchantName') || '',
      panes: getData('panes', []),
      menuList: getData('menuList', []),
      shopList: getData('shopList', []),
      currentShop: getData('currentShop', {}),
      warehouseList: getData('warehouseList', []),
      shipperList: getData('shipperList', []),
      floatTabList: getData('floatTabList', []),
      defaultWarehouse: '',
      role: localStorage.getItem('role') || '',
      lang: localStorage.getItem('lang') && localStorage.getItem('lang') === 'null' ? 'zh' : localStorage.getItem('lang'),
      openKeys: getData('openKeys', []),
      currentIdaasApp: getData('currentIdaasApp', {}),
      subMerchantAppList: getData('subMerchantAppList', []),
      rate: localStorage.getItem('zoomRate'),
      buList: getData('buList', []),
    }
  },
  getters: {
    isDuoshiwu: (state) => {
      return state.merchantName === 'duoshiwu'
    },
  },
  actions: {
    setMenuList(value) {
      this.menuList = value
      if (value) {
        localStorage.setItem('menuList', JSON.stringify(value))
      }
    },
    setMerchantName(value) {
      localStorage.setItem('merchantName', value)
      this.merchantName = value
    },
    setRole(value) {
      localStorage.setItem('role', value)
      this.role = value
    },
    changeXCollapsed() {
      this.collapsed = !this.collapsed
      sessionStorage.setItem('collapsed', this.collapsed)
    },
    setWarehouseList(value) {
      this.warehouseList = value
      if (value) {
        localStorage.setItem('warehouseList', JSON.stringify(value))
      }
    },
    setShipperList(value) {
      this.shipperList = value
      if (value) {
        localStorage.setItem('shipperList', JSON.stringify(value))
      }
    },
    changeLang(value) {
      this.lang = value
    },
    setOpenKeys(value) {
      this.openKeys = value
      localStorage.setItem('openKeys', JSON.stringify(value))
    },
    setState(data) {
      for (const item in data) {
        this[item] = data[item]
        localStorage.setItem(item, typeof data[item] === 'object' && data[item] !== null ? JSON.stringify(data[item]) : data[item])
      }
    },
    addPane({ view, name, query, params, route }) {
      const index = this.panes.findIndex(item => view.includes(item.view))
      if (index === -1) {
        const panes = this.panes
        panes.push({ view, name, query, params })
        this.setState({ panes })
      }
      else {
        const panes = this.panes
        panes[index].name = name
        panes[index].query = query
        panes[index].params = params
        this.setState({ panes })
      }
      route && router.push(route)
    },
    removePane({ activeKey, targetKey, callback }) {
      let lastIndex
      this.panes.forEach((pane, i) => {
        if (pane.view === targetKey) {
          lastIndex = i - 1
        }
      })
      const panes = this.panes.filter(pane => pane.view !== targetKey)
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].view
        }
        else {
          activeKey = panes[0].view
        }
      }
      this.panes = panes
      localStorage.setItem('panes', JSON.stringify(panes))
      callback?.(activeKey)
    },
    async getSession(cb) {
      const res = await axios.post(api.getSession, {
        appCode,
      })
      this.setState({
        userSession: res,
      })
      this.setUserInfo(res, cb)
    },
    async setUserInfo(userInfo, cb) {
      if (userInfo.roleList) {
        userInfo.roleList.forEach((item) => {
          if (item.code === 'master') {
            userInfo.masterCode = userInfo.merchantCode
          }
        })
      }
      userInfo.userName = userInfo.currentUser
      this.setState({
        userInfo,
        userSession: userInfo,
        subMerchantAppList: userInfo.subMerchantAppList,
        merchantCode: userInfo.merchantCode,
        merchantName: userInfo.merchantName,
        userAccount: userInfo.userName,
        menuList: userInfo.menuList,
        buList: userInfo.buList,
      })
      localStorage.setItem('merchantId', userInfo.originalMerchantId)
      await this.getIdaasAppList(userInfo.merchantCode)
      await this.getShopList(userInfo, cb)
    },
    async getIdaasAppList(value) {
      const data = {
        merchantCode: value,
      }
      const res = await axios.post(api.queryIdaasAppList, data)
      const obj = {}
      res.forEach((item) => {
        obj[item.appCode] = item
      })
      this.setState({
        currentIdaasApp: obj,
      })
    },
    async getShopList(value, cb) {
      const data = {
        merchant_code: value.merchantCode,
        page_no: 1,
        page_size: 1000,
      }
      const res = await axios.post(api.getShopList, data)
      this.setState({
        shopList: res.list,
      })
      this.setParty(res.list[0], cb)
    },
    async setParty(_party, cb) {
      const newParty = _party || this.buList?.[0]
      if (!newParty) {
        // message.warning(t("业务组为空"))
        cb?.()
        return
      }
      this.setState({
        currentShop: newParty,
      })
      const res = await axios.post(api.switchParty, { buId: newParty.departmentId || newParty.id })
      const userSession = res
      const party = userSession.currentBu || newParty
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
      this.setState({
        userSession,
      })
      cb?.()
    },
  },
})

function getData(name, defaultData) {
  const data = localStorage.getItem(name)
  if (data === undefined || data === 'undefined' || data === null || data === 'null') {
    return defaultData
  }
  try {
    return JSON.parse(data)
  }
  catch { }
  return data
}
