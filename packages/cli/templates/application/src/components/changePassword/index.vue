<script setup>
import api from '@/service/api'
import axios from '@/service/axios'
import { useStore } from '@/store/index'
import { message } from 'ant-design-vue'
import sha512 from 'js-sha512'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  visible: Boolean,
  text: {
    type: String,
    default: null,
  },
})
const emits = defineEmits(['success', 'close'])
const store = useStore()
const { t } = useI18n()
const ruleFormRef = ref()
const modalVisible = ref(false)

const labelCol = { span: 6 }
const wrapperCol = { span: 16 }
const loading = ref(false)
const ruleForm = ref({
  oldpass: '',
  newpass: '',
})
const rules = ref({
  oldpass: [
    {
      validator: oldpass,
      trigger: 'change',
    },
  ],
  newpass: [
    {
      validator: validatePass,
      trigger: 'change',
    },
  ],
})

watch(
  () => props.visible,
  (value) => {
    if (value) {
      modalVisible.value = value
    }
  },
)
async function oldpass(_rule, value) {
  if (value === '') {
    return Promise.reject(t('请输入原始密码'))
  }
  if (ruleForm.value.newpass !== '') {
    ruleFormRef.value.validateFields('newpass')
  }

  return Promise.resolve()
}
async function validatePass(_rule, value) {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@_#.$%^&*])[\w~!@#.$%^&*]{8,20}$/
  if (value === '') {
    return Promise.reject(t('pwdlayer1'))
  }
  if (!reg.test(value)) {
    return Promise.reject(new Error(`${t('pwdlayer2')}(~!@_#.$%^&*)`))
  }
  return Promise.resolve()
}
async function submitPass() {
  try {
    loading.value = true
    const data = {
      oldPassword: ruleForm.value.oldpass,
      newPassword: ruleForm.value.newpass,
    }
    data.oldPassword = sha512(data.oldPassword)
    data.newPassword = sha512(data.newPassword)
    await axios.post(api.changePassword, {
      merchant_code: store.userInfo.merchantCode,
      original_password: data.oldPassword,
      new_password: data.newPassword,
    })
    message.success(t('修改成功'))
    emits('success', ruleForm.value.newpass)
    loading.value = false
  }
  catch {
    loading.value = false
  }
}
function handleOk() {
  emits('close')
}
</script>

<template>
  <a-modal
    v-model:visible="modalVisible" :title="$t('修改密码')" class="account-container" :footer="null"
    style="width: 600px" @cancel="handleOk"
  >
    <div v-if="props.text" class="modal-text">
      {{ props.text }}
    </div>
    <a-form
      ref="ruleFormRef" name="custom-validation" :model="ruleForm" :rules="rules" :wrapper-col="wrapperCol"
      :label-col="labelCol" @finish="submitPass"
    >
      <a-form-item has-feedback :label="$t('旧密码')" name="oldpass">
        <a-input-password v-model:value="ruleForm.oldpass" :placeholder="$t('请输入') + $t('旧密码')" autocomplete="off" />
      </a-form-item>
      <a-form-item has-feedback :label="$t('新密码')" name="newpass">
        <a-input-password v-model:value="ruleForm.newpass" :placeholder="$t('请输入') + $t('新密码')" autocomplete="off" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 16, offset: 6 }">
        <a-button type="primary" :loading="loading" html-type="submit">
          {{ $t("确定") }}
        </a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style scoped>
.modal-text {
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
}
</style>
