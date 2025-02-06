import { defineStore } from 'pinia'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
export const useStore = defineStore('main', {
  // other options...
  state: () => {
    return {
      collapsed: sessionStorage.getItem('collapsed') === 'true',
      userInfo: getData('userInfo', ''),
      currentApp: getData('currentApp', {}),
      merchantName: localStorage.getItem('merchantName') || '',
      menuList: getData('menuList', []),
      warehouseList: getData('warehouseList', []),
      shipperList: getData('shipperList', []),
      floatTabList: getData('floatTabList', []),
      defaultWarehouse: '',
      role: localStorage.getItem('role') || '',
      lang: localStorage.getItem('lang') && localStorage.getItem('lang') === 'null' ? 'zh' : localStorage.getItem('lang'),
      openKeys: getData('openKeys', []),
      currentIdaasApp: getData('currentIdaasApp', {}),
      rate: localStorage.getItem('zoomRate'),
    }
  },
  getters: {
    isDuoshiwu: (state) => {
      return state.merchantName === 'duoshiwu'
    },
    merchantId: (state) => {
      return localStorage.getItem('merchantId') || state.userInfo?.user?.merchantId || state.userInfo.originalMerchantId
    },
  },
  actions: {
    setMenuList(value) {
      this.menuList = value
      if (value) {
        localStorage.setItem('menuList', JSON.stringify(value))
      }
    },
    setUserInfo(value) {
      localStorage.setItem('userInfo', JSON.stringify(value))
      this.userInfo = value
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
        localStorage.setItem(
          item,
          typeof data[item] === 'object' && data[item] !== null ? JSON.stringify(data[item]) : data[item],
        )
      }
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
  catch {}
  return data
}
