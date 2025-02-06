<script setup>
import { useStore } from '@/store/index'
import { computed, ref } from 'vue'
import Content from './ContentView.vue'
import SideBar from './sideBar.vue'
import TopNav from './topNav.vue'

const sideBar = ref()
const store = useStore()
const collapsed = computed(() => {
  return store.collapsed
})
function changeActive(value) {
  sideBar.value.changeActive(value)
}
</script>

<template>
  <div class="home">
    <SideBar ref="sideBar" />
    <div :class="`content-view ${collapsed ? 'content-width' : ''}`">
      <TopNav />
      <Content @change-active="changeActive" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  background-color: rgb(240, 239, 239);
  height: 100%;
  display: flex;
  .content-view {
    width: calc(100% - 185px);
    // width: 100%;
    height: 100%;
    // background-color: wheat;
    transition: all 0.2s;
  }
  .content-width {
    width: calc(100% - 79px) !important;
    transition: all 0.2s;
  }
}
</style>
