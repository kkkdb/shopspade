import { appCode, apps } from '@/config/config'
import { getCookie } from '@/utils/cookie'
import Login from '@/views/login/index.vue'
import Page404 from '@/views/page404/index.vue'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import { createRouter, createWebHistory } from 'vue-router'

const MicroWeb = () => import('@/views/micro/index.vue')

const microRouter = apps.reduce((total, item) => {
  if (item.activeRule && Array.isArray(item.activeRule)) {
    item.activeRule.forEach((rule) => {
      total.push({
        path: `/${rule}/:afterUser(.*)`,
        name: `${rule}`,
        component: MicroWeb,
      })
    })
  }
  else {
    total.push(
      ...[
        {
          path: `/${item.name}`,
          name: item.name,
          component: MicroWeb,
        },
        {
          path: `/${item.name}/:afterUser(.*)`,
          name: `${item.name}_with_params`,
          component: MicroWeb,
        },
      ],
    )
  }
  return total
}, [])

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: Login,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/home',
    name: 'home',
    redirect: apps[0].activeRule,
    component: () => import('@/views/home/index.vue'),
    children: microRouter,
  },
  {
    path: '/Page404',
    name: 'Page404',
    component: Page404,
  },
  {
    path: '/bindMerchant',
    name: 'bindMerchant',
    component: () => import('@/views/bindMerchant/index.vue'),
  },
  // {
  //   path: '/:catchAll(.*)',
  //   redirect: '/Page404',
  // },
]
const history = createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? appCode : '/')
const router = createRouter({
  history,
  routes,
})
// 主应用使用的嵌套路由
router.beforeEach((to, from, next) => {
  // 手动修改history的state
  if (!window.history.state.current) {
    window.history.state.current = to.fullPath
  }
  if (!window.history.state.back) {
    window.history.state.back = from.fullPath
  }
  // && !to.query.switchAppCode 为了允许erp切换app时候能去login页调用switchApp接口
  const pageCacheFullPath = localStorage.getItem('pageCacheFullPath') || `/${microRouter[0].name}`
  if (to.name === 'login' && !to.query.switchAppCode) {
    if (!getCookie('d_session_id')) {
      next()
    }
    else {
      next(pageCacheFullPath)
    }
  }
  else if (!getCookie('d_session_id')) {
    localStorage.setItem('pageCacheFullPath', to.fullPath)
    next({ name: 'login' })
    return
  }
  next()
})

export default router
