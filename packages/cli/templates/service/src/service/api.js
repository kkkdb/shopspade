import HostUrl from '@/utils/hostUrl.js'

const hostUrl = new HostUrl()

const host = hostUrl.getUrl('')
const idaas_api = hostUrl.getUrl('IDAAS')
const shop_api = hostUrl.getUrl('SHOP')

export default {
  authorizeOauth: `${host}/oauth/authorize`, // 单点登录解析
  getSession: `${host}/user/session`, // user/session
  getDownloadKey: `${host}/oauth/download/key`, // 获取临时下载的key
  switchApp: `${idaas_api}/open/user/switchApp`, // 切换APP
  shopList: `${shop_api}/shop/simplePage`, // 店铺列表
  queryWarehousePage: `${shop_api}/warehouse/queryWarehousePage`, // shop服务仓库列表接口
  queryIdaasAppList: `${idaas_api}/open/merchantApp/list`, // idaas应用列表
  getUserList: `${idaas_api}/user/page`, // 用户列表
  saveUser: `${idaas_api}/user/saveUser`,
  isNameHave: `${idaas_api}/youTool/checkNameExist`,
  getResourceMap: `${idaas_api}/resource/menuFuncMappingList`,
  configDetail: `${idaas_api}/user/configDetail`,
  getMerchantAppList: `${idaas_api}/merchantApp/page`,
  roleList: `${idaas_api}/role/list`,
  roleSave: `${idaas_api}/role/save`,
  roleDetail: `${idaas_api}/role/detail`,
  deleteRole: `${idaas_api}/role/delete`,
  supplierList: `${idaas_api}/supplier/list`,
  saveConfig: `${idaas_api}/user/saveConfig`,
  departmentGetRoot: `${idaas_api}/department/getRoot`, // 获取节点
  departmentList: `${idaas_api}/department/list`,
  resourceList: `${idaas_api}/resource/list`,
  userSaveUserAuth: `${idaas_api}/user/saveUserAuth`,
  getMerchantAccountConfig: `${idaas_api}/merchantAccount/config/query`, // 获取商户账号配置
  saveMerchantAccountConfig: `${idaas_api}/merchantAccount/config/save`, // 保存商户账号配置
  renewalUser: `${idaas_api}/user/renewal`, // 用户续期

  // 集团绑定公司
  merchantManagementList: `${idaas_api}/merchant/management/list`, // 列表
  merchantManagementBind: `${idaas_api}/merchant/management/bind`, // 绑定
  merchantManagementUnbind: `${idaas_api}/merchant/management/unbind`, // 解绑
}
