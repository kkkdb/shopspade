/**
 * [设置cookie]
 * @param  {object}   cookies  [要写入document.cookie中的对象]
 * @param  {Function} callback [cookie设置成功的回调函数]
 */
function setCookie(cookies, callback) {
  const now = new Date()
  const time = now.getTime()
  const expireTime = time + 1000 * 3600 * 24 // 单位为毫秒，故这里的cookie生命周期设置为24小时
  now.setTime(expireTime)

  for (const key in cookies) {
    document.cookie = `${key}=${cookies[key]};expires=${now.toGMTString()};path=/`
  }

  callback?.()
}

/**
 * [按名称获取cookie的值]
 * @param  {string} cookieName [cookie名称]
 * @return {string}            [cookie的值]
 */
function getCookie(cookieName) {
  const cookies = {}
  const cookieArr = document.cookie.split(';')
  let currentCookie = ''

  for (let i = 0; i < cookieArr.length; i++) {
    currentCookie = cookieArr[i]

    if (currentCookie.includes('=')) {
      cookies[currentCookie.split('=')[0].trim()] = currentCookie.split('=')[1].trim()
    }
  }

  if (typeof cookies[cookieName.trim()] !== 'undefined') {
    return cookies[cookieName.trim()]
  }
  return false
}

/**
 * [删除cookie]
 * @param  {Function} callback [删除成功的回调函数]
 */
function deleteCookie(callback) {
  const keys = document.cookie.match(/[^ =;]+(?==)/g)
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = `${keys[i]}=0;path=/;expires=${new Date(0).toUTCString()}` // 清除当前域名下的,例如：m.kevis.com
      document.cookie = `${keys[i]}=0;path=/;domain=${document.domain};expires=${new Date(0).toUTCString()}` // 清除当前域名下的，例如 .m.kevis.com
      document.cookie = `${keys[i]}=0;path=/;domain=geezdata.com;expires=${new Date(0).toUTCString()}` // 清除一级域名下的或指定的，例如 .kevis.com
    }
  }
  callback?.()
}

export { deleteCookie, getCookie, setCookie }
