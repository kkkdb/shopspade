<script>
import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'BreadCrumb',
  setup() {
    const route = useRoute()
    const menuList = reactive([])
    for (let i = 0; i < 5; i++) {
      menuList.push(`Menu ${i + 1}`)
    }
    const nav_bar_list = computed(() => {
      let nav_bar_list = []
      const pathArr = route.path
        .split('?')[0]
        .split('/')
        .filter(item => item)
      nav_bar_list = [pathArr[0]]
      if (pathArr[1]) {
        nav_bar_list.push(pathArr[1])
      }
      return nav_bar_list
    })
    return {
      menuList,
      nav_bar_list,
    }
  },
}
</script>

<template>
  <a-breadcrumb class="nav-bar" separator="/">
    <a-breadcrumb-item v-for="(item, i) of nav_bar_list" :key="i" style="font-weight: 700">
      {{ $t(`menu.${item}`) }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style scoped>
.nav-bar {
  margin: 0 0 6px 0;
}
</style>
