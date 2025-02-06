<script setup name="ContentView">
import { computed, nextTick, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import Breadcrumb from './breadcrumb.vue'
import FloatTab from './floatTab.vue'

const emits = defineEmits(['changeActive'])
const isRouterAlive = ref(true)
const route = useRoute()
// console.log('route: ', route)
const excludeList = ref([])
const showBread = computed(() => {
  return !route.path.includes('aftersale_web')
})
function reload() {
  isRouterAlive.value = false
  nextTick(() => {
    isRouterAlive.value = true
  })
}
function changeActive(value) {
  emits('changeActive', { name: value.name })
}
provide('reload', reload)
</script>

<template>
  <div class="ContentView">
    <FloatTab @change-active="changeActive" />
    <div class="box">
      <Breadcrumb v-if="showBread" />
      <router-view v-if="isRouterAlive" v-slot="{ Component }">
        <keep-alive :exclude="excludeList">
          <component :is="Component" />
        </keep-alive>
      </router-view>
      <div id="subapp-viewport" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ContentView {
  width: 100%;
  height: calc(100% - 53px);
  background-color: #f0f3f4;
  padding: 10px 10px 6px;

  .box {
    height: calc(100% - 40px);
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f0f3f4;
  }
}
</style>
