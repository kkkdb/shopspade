<script setup>
import { singleSignOnURL } from '@/config/config'
import api from '@/service/api'
import axios from '@/service/axios'
import { useStore } from '@/store/index'
import { setCookie } from '@/utils/cookie.js'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const store = useStore()

const route = useRoute()
const router = useRouter()
onMounted(() => {
  if (route.query.code) {
    // 单点登录回调
    localStorage.setItem('apiURL', route.query.gateway_uri)
    setTimeout(() => {
      oauthLogin(route.query.code)
    })
  }
  else if (route.query.switchAppCode) {
    switchApp(route.query.switchAppCode)
  }
  else {
    window.location.href = singleSignOnURL
  }
})

function oauthLogin(code) {
  axios
    .post(api.authorizeOauth, {
      authCode: code,
    })
    .then((res) => {
      setCookie({ d_session_id: res })
      store.getSession(() => {
        goJump()
      })
    })
    .catch((err) => {
      if (err.message === 'authCode is invalid!') {
        window.location.href = singleSignOnURL
      }
    })
}
function goJump() {
  const pageCacheFullPath = localStorage.getItem('pageCacheFullPath')
  if (pageCacheFullPath) {
    window.location.href = pageCacheFullPath
    localStorage.removeItem('pageCacheFullPath')
    return
  }
  router.push(`/${store?.menuList[0]?.view}`)
}

function switchApp(switchAppCode) {
  axios
    .post(api.switchApp, {
      switchAppCode,
    })
    .then((res) => {
      store.setUserInfo(res, () => {
        goJump()
      })
    })
}
</script>

<template>
  <div class="flex-c-c" style="width: 100%; height: 100%">
    <img src="../../assets/image/loading.gif" class="loading-gif" alt="Loading...">
  </div>
</template>

<style lang="scss" scoped>
.loading-gif {
  width: 100px;
}
</style>
