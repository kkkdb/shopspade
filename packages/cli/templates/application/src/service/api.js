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
  queryIdaasAppList: `${idaas_api}/open/merchantApp/list`, // idaas应用列表
  getShopList: `${shop_api}/shop/simplePage`, // 店铺列表
  switchParty: `${idaas_api}/open/user/switchBu`, // 切换业务组
  bindMerchant: `${idaas_api}/merchant/management/bind`, // 绑定商户
  switchMerchant: `${idaas_api}/open/switchMerchant`, // 切换商户
  merchantList: `${idaas_api}/open/merchant/queryPage`, // 获取商户
}
