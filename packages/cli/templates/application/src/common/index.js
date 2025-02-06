import { singleSignOnURL, singleSignOutURL } from '@/config/config'
import { deleteCookie } from '@/utils/cookie'

function logout() {
  const lang = localStorage.getItem('lang')
  localStorage.clear()
  localStorage.setItem('lang', lang || '')
  localStorage.setItem('pageCacheFullPath', location.pathname + location.search)
  deleteCookie(() => {
    window.location.href = `${singleSignOutURL}?redirect_uri=${encodeURIComponent(singleSignOnURL)}`
  })
}

export { logout }
