<script setup>
import api from '@/service/api'
import axios from '@/service/axios'
import { useStore } from '@/store'
import { message, Modal } from 'ant-design-vue'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useStore()
const { t } = useI18n()
const loading = ref(false)
const visible = ref(false)
const inviteMessage = computed(() => {
  const { n, m } = route.query
  return n && m ? `${n}${t('邀请你绑定')}${m}${t('商户')}` : ''
})

async function handleOk() {
  try {
    const { gId } = route.query
    if (!gId || !store.merchantId) {
      message.error(t('参数错误'))
      return
    }
    loading.value = true
    await axios.post(api.bindMerchant, {
      groupMerchantId: gId,
      merchantId: store.merchantId,
    })

    message.success(t('绑定成功'))
    router.replace('/')
  }
  catch (error) {
    console.error('Bind merchant error:', error)
    message.error(error.message || t('绑定失败'))
  }
  finally {
    loading.value = false
  }
}

function handleCancel() {
  router.replace('/')
}

onMounted(() => {
  const { gId, n, m } = route.query
  const merchantId = store.merchantId
  if (String(merchantId) === String(gId)) {
    Modal.error({
      title: t('同一商户无法绑定'),
      content: t('不能绑定自己的商户'),
      onOk: () => {
        router.replace('/')
      },
    })
    return
  }
  if (gId && n && m) {
    visible.value = true
  }
  else {
    message.error(t('参数错误'))
    router.replace('/')
  }
})
</script>

<template>
  <div class="bind-merchant">
    <a-modal
      v-model:visible="visible" :title="$t('绑定商户')" :mask-closable="false" :closable="false" :keyboard="false"
      :confirm-loading="loading" @ok="handleOk" @cancel="handleCancel"
    >
      <p>{{ inviteMessage }}</p>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.bind-merchant {
  width: 100%;
  height: 100%;
}
</style>
