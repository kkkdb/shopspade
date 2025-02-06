// 在这里统一配置请求地址
const appCode = 'OMS'
const baseURL = 'http://localhost:8088'
const idaasURL = 'https://testidaas.shopspade.com'
const singleSignOnURL = `${idaasURL}/api/open/oauth/authorize?app_key=spade_gateway_001&response_type=code&scope=${appCode}&terminal=PC&redirect_uri=${baseURL}`
const singleSignOutURL = `${idaasURL}/logout`

const biEntry = 'https://testbi.geezdata.com/qbiDashboard'
// 本地
// const orderWebEntry = "http://localhost:8999" //订单
// const goodsWebEntry = "http://localhost:9012" //商品
// const aftersaleWebEntry = "http://localhost:9001"
// const workorderWebEntry = "http://localhost:9002"
// const scmWebEntry = 'http://localhost:9003'
// const inventoryWebEntry = "http://localhost:9004"
// const reportWebEntry = "http://localhost:9009"
// const wmshubWebEntry = "https://testwmshub.shopspade.com"
const shopWebEntry = 'http://localhost:9010'
// const strategyWebEntry = "http://localhost:9011" // 策略中心
// const regionWebEntry = "https://testregion.shopspade.com" // 地址库
// const financeWebEntry = 'http://localhost:9014' // 财务
// const permissionEntry = 'http://localhost:9016' // 权限

// 测试
const orderWebEntry = 'https://testorder.shopspade.com' // 订单
const goodsWebEntry = 'https://testproduct.shopspade.com' // 商品
const aftersaleWebEntry = 'https://testaftersale.shopspade.com'
const workorderWebEntry = 'https://testworkorder.shopspade.com'
const scmWebEntry = 'https://testscm.shopspade.com'
const inventoryWebEntry = 'https://testinventory.shopspade.com'
const reportWebEntry = 'https://testtask.shopspade.com'
const wmshubWebEntry = 'https://testwmshub.shopspade.com'
// const shopWebEntry = 'https://testshop.shopspade.com'
const strategyWebEntry = 'https://teststrategy.shopspade.com' // 策略中心
const regionWebEntry = 'https://testregion.shopspade.com' // 地址库
const financeWebEntry = 'https://testfinance.geezdata.com' // 财务
const permissionEntry = 'https://testpermission.shopspade.com' // 权限

const apps = [
  // 订单管理
  {
    appCode: ['ORDER', 'PLYMOUTH'],
    name: 'orderManage',
    entry: orderWebEntry,
  },
  // 售后系统
  {
    appCode: ['AFTER_SALE'],
    name: 'aftersale_web',
    entry: aftersaleWebEntry,
  },
  // 采购系统
  {
    appCode: ['SCM'],
    name: 'purchase',
    entry: scmWebEntry,
  },
  // 工单系统
  {
    appCode: ['WORK_ORDER'],
    name: 'workorder_web',
    entry: workorderWebEntry,
  },
  // 库存系统
  {
    appCode: ['INVENTORY'],
    name: 'inventory_web',
    entry: inventoryWebEntry,
  },
  // task
  {
    appCode: ['REPORT'],
    name: 'report_web',
    entry: reportWebEntry,
  },
  {
    appCode: ['WMS_HUB'],
    name: 'order',
    entry: wmshubWebEntry,
  },
  // 店铺设置
  {
    appCode: ['SHOP'],
    name: 'shop_web',
    entry: shopWebEntry,
  },
  // 策略中心
  {
    appCode: ['STRATEGY'],
    name: 'strategy_web',
    entry: strategyWebEntry,
  },
  // 商品
  {
    appCode: ['GOODS'],
    name: 'goodsManage',
    entry: goodsWebEntry,
  },
  // 地址库
  {
    appCode: ['REGION'],
    name: 'region_web',
    entry: regionWebEntry,
  },
  // 财务
  {
    appCode: ['FMS'],
    name: 'fms_web',
    entry: financeWebEntry,
    activeRule: [
      'payableManage',
      'receivableManage',
      'invoiceManage',
      'baseInfo',
      'voucherManage',
      'asset',
      'capitalManage',
      'accountJournal',
      'financialStatements',
    ],
  },
  // 权限管理
  {
    appCode: ['IDAAS'],
    name: 'permission_web',
    entry: permissionEntry,
  },
]

export { appCode, apps, baseURL, biEntry, idaasURL, singleSignOnURL, singleSignOutURL }
