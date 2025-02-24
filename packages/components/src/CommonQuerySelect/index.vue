<template>
  <a-select
    allow-clear
    :mode="mode"
    show-search
    :max-tag-count="4"
    style="width: 100%"
    :placeholder="_selfPlaceholder"
    :disabled="_selfDisabled"
    :default-active-first-option="false"
    v-model:value="selectedValue"
    :filter-option="filterOption"
    :not-found-content="loading ? undefined : null"
    @focus="getList"
    @change="onChange"
  >
    <template #notFoundContent v-if="loading">
      <a-spin size="small" />
    </template>
    <a-select-option v-for="(item, index) in option" :value="String(item[valueName])" :key="index">
      {{ item[labelName] }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue"
import { message } from "ant-design-vue"
import type { SelectProps } from 'ant-design-vue'
import axios from "axios"

interface OptionItem {
  [key: string]: any
}

interface Props {
  placeholder?: string
  disabled?: boolean
  code?: string
  name?: string
  mode?: SelectProps['mode']
  api?: string
  params?: Record<string, any>
  immediate?: boolean
  valueName?: string
  labelName?: string
  resultField?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: undefined,
  params: () => ({}),
  immediate: false,
  valueName: 'code',
  labelName: 'name',
  resultField: 'list'
})

const emit = defineEmits<{
  'update:code': [value: string | undefined]
  'update:name': [value: string | undefined]
  'change': [value: OptionItem]
}>()

const selectedValue = ref<string | undefined>()
const option = ref<OptionItem[]>([])
const loading = ref(false)

const _selfPlaceholder = computed(() => props.placeholder)
const _selfDisabled = computed(() => props.disabled || false)

const getList = async () => {
  if (option.value.length > 0) return
  if (!props.api) return

  loading.value = true
  try {
    const res = await axios.post<any>(props.api, {
      ...props.params,
    })
    const list = res.data || res.data?.[props.resultField] || []
    if (list.length === 0) {
      message.warning('Empty list')
      return
    }
    option.value = list
    setDefault()
  } catch (error) {
    console.error('Failed to fetch list:', error)
    message.error('Failed to fetch data')
  } finally {
    loading.value = false
  }
}

const setDefault = () => {
  if (props.name) return
  selectedValue.value = undefined
  if (props.code !== undefined) {
    onChange(props.code)
  }
}

const onChange = (value: string | undefined) => {
  if (value !== undefined) {
    value = String(value)
  }
  selectedValue.value = value
  emit("update:code", value)
  const item = option.value.find((elem) => String(elem[props.valueName]) === value) || {}
  emit("update:name", item[props.labelName])
  emit("change", item)
}

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

watch(
  () => props.code,
  () => {
    if (option.value.length > 0) {
      setDefault()
    } else if (!props.name) {
      getList()
    }
  }
)

watch(
  () => props.name,
  (val) => {
    if (val) {
      selectedValue.value = val
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.immediate) {
    getList()
  }
})
</script>
