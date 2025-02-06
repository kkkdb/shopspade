<script setup>
import { useStore } from '@/store'
import { CloseCircleOutlined, RedoOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const activeKey = ref('')
const route = useRoute()
const router = useRouter()
const store = useStore()

const panes = computed(() => store.panes)

onMounted(() => {
  // console.log("route: ", route)
  if (panes.value.length === 0) {
    const path = route.path.slice(1)
    const name = route.params.afterUser
    store.setState({
      panes: [
        {
          name,
          view: path,
        },
      ],
    })
  }
  getRouteActive(route)
})

function getName(key) {
  const nameList = key.split('/')
  return nameList[0]
}

function tabClick(key) {
  if (activeKey.value === key)
    return
  const name = getName(key)
  // console.log('name: ', name)
  const item = panes.value.find(item => item.view === key)
  // const data = { name, query: item.query, params: item.params }
  if (name === 'orderDetails') {
    // 订单详情
    if (item.params?.orderId) {
      // 原始订单跳转有orderId
      router.push(`/orderManage/omsOrderDetail/orderDetails/${item.params.orderId}`)
    }
    else {
      // 原始订单跳转没有orderId
      router.push(`/orderManage/omsOrderDetail/orderDetails/?orderSn=${item.params.orderSn}`)
    }
  }
  else if (name === 'purchaseDetail') {
    // 采购详情
    router.push(`/purchase/purchaseDetail/?id=${item.params.orderId}`)
  }
  else {
    // 子应用
    router.push(`/${key}`)
  }
}

function onEdit(targetKey, action) {
  if (action === 'remove') {
    remove(targetKey)
  }
}

function remove(targetKey) {
  store.removePane({
    activeKey: activeKey.value,
    targetKey,
    callback: (newActiveKey) => {
      if (activeKey.value !== newActiveKey) {
        tabClick(newActiveKey)
      }
    },
  })
}

function reloadHandle(key) {
  const name = getName(key)
  store.setState({
    exclude: name,
  })
}

function closeTab(is_all) {
  const name = route.path.slice(1)
  const view = route.fullPath
  let newPanes = [{ view, name }]
  if (!is_all) {
    newPanes = panes.value.filter(item => item.view === activeKey.value)
    if (newPanes.length === 0) {
      newPanes = [{ view, name }]
    }
  }
  store.setState({
    panes: newPanes,
  })
}

function getRouteActive(route) {
  if (route.fullPath.includes('orderManage/omsOrderDetail/orderDetails')) {
    if (route.query?.orderSn) {
      activeKey.value = `orderDetails/${route.query?.orderSn}`
    }
    else {
      const routeArr = route.fullPath.split('/')
      const orderId = routeArr[routeArr.length - 1]
      const item = panes.value.find(item => String(item?.params?.orderId) === String(orderId))
      const orderSn = item?.params?.orderSn
      activeKey.value = `orderDetails/${orderSn}`
    }
    return
  }
  if (route.fullPath.includes('purchase/purchaseDetail')) {
    activeKey.value = `purchaseDetail/${route.query?.id}`
    return
  }
  activeKey.value = route.path.slice(1)
}

watch(
  () => route,
  (newVal) => {
    getRouteActive(newVal)
  },
  { deep: true },
)
</script>

<template>
  <div class="alive-tab">
    <div class="operate-content">
      <a-dropdown placement="bottomLeft">
        <CloseCircleOutlined class="close-circle" />
        <template #overlay>
          <a-menu>
            <a-menu-item @click="closeTab(1)">
              <span class="menu-text">{{ $t("关闭所有") }}</span>
            </a-menu-item>
            <a-menu-item @click="closeTab(0)">
              <span class="menu-text">{{ $t("关闭其他") }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <a-tabs
      v-model:active-key="activeKey" class="float-tabs" hide-add type="editable-card" @edit="onEdit"
      @tab-click="tabClick"
    >
      <a-tab-pane v-for="pane in panes" :key="pane.view">
        <template #tab>
          <span class="tab-item">
            <span v-if="activeKey === pane.view" class="icon-active" @click="reloadHandle(pane.view)">
              <RedoOutlined class="icon reload" />
            </span>
            <span>{{
              $t(`menu.${pane.name || pane.view}`, {
                OrderSn: pane.params?.orderSn,
              })
            }}</span>
          </span>
        </template>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<style lang="scss" scoped>
.alive-tab {
  background: #f0f3f4;
  overflow: hidden;
  padding-left: 40px;
  width: 100%;
  position: relative;

  .operate-content {
    height: 40px;
    line-height: 40px;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;

    .close-circle {
      padding: 0 10px;
      font-size: 16px;
    }

    .menu-text {
      font-size: 13px;
    }
  }

  .tab-item {
    width: 100%;
    padding: 0 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .icon {
      font-size: 10px;
      font-weight: bold;
      padding: 4px;
      margin-right: 0;
    }

    .close {
      margin-left: 4px;
      color: #999;

      &:hover {
        color: #333;
      }
    }
  }

  .app-tabs.app-tabs-card .app-tabs-tab-active {
    border-color: #fff;
    background: #fff;
    border-radius: 0;

    .circle {
      background: #1677ff;

      .icon {
        display: none;
      }
    }

    &:hover {
      color: #1677ff;

      .circle {
        height: auto;
        margin-left: 0;
        margin-right: 14px;
        background: transparent;
      }

      .icon {
        display: block;

        &:hover {
          transform: scale(1.2);
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.float-tabs {
  :deep(.app-tabs-dropdown-menu-title-content) {
    display: flex;
  }

  :deep(.app-tabs-nav) {
    margin-bottom: 6px;
  }

  :deep(.app-tabs-tab) {
    padding: 4px 10px;
  }

  :deep(.app-tabs-tab-remove) {
    margin-left: 0;
  }
}
</style>
