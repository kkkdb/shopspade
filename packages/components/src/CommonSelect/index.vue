<template>
  <a-select
    :allow-clear="allowClear"
    :mode="mode"
    show-search
    :max-tag-count="props.maxTagCount"
    style="width: 100%"
    :placeholder="_selfPlaceholder"
    :disabled="_selfDisabled"
    v-model:value="selectedValue"
    :filter-option="filterOption"
    @change="onChange"
  >
    <a-select-option v-for="(item, index) in option" :value="item[valueName]" :key="index">
      {{ item[labelName] }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"
import type { SelectProps } from 'ant-design-vue'

interface OptionItem {
  [key: string]: any
}

interface Props {
  id?: string | number
  placeholder?: string
  disabled?: boolean
  code?: string | string[]
  name?: string | string[]
  mode?: SelectProps['mode']
  list?: OptionItem[]
  valueName?: string
  labelName?: string
  allowClear?: boolean
  immediate?: boolean
  maxTagCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  mode: undefined,
  list: () => [],
  valueName: 'code',
  labelName: 'name',
  allowClear: true,
  immediate: true,
  maxTagCount: 3
})

const emit = defineEmits<{
  'update:code': [value: string | string[]]
  'update:name': [value: string | string[]]
  'change': [value: OptionItem | string[]]
}>()

const selectedValue = ref<string | string[]>()
const option = ref<OptionItem[]>([])

const _selfPlaceholder = computed(() => props.placeholder)
const _selfDisabled = computed(() => props.disabled || false)

const getList = async () => {
  const list = props.list || []
  option.value = list
  setDefault()
}

const setDefault = () => {
  if (props.name || !props.immediate) {
    selectedValue.value = props.code
    return
  }
  selectedValue.value = undefined
  if (props.code !== undefined && props.code !== null) {
    onChange(props.code)
  } else if (option.value.length === 1) {
    onChange(option.value[0][props.valueName])
  }
}

const onChange = (_value: string | string[]) => {
  nextTick(() => {
    let value = _value
    if (props.mode !== "multiple" && value !== undefined) {
      value = String(value)
    }
    if (props.mode === "multiple" && typeof value === "string") {
      value = [value]
    }
    selectedValue.value = value
    emit("update:code", value)
    if (props.mode !== "multiple") {
      const item = option.value.find((elem) => String(elem[props.valueName]) === value) || {}
      emit("update:name", item[props.labelName])
      emit("change", item)
    } else {
      const nameList = (value as string[]).map((elem) => {
        const item = option.value.find((elem2) => String(elem2[props.valueName]) === elem) || {}
        return item[props.labelName]
      })
      emit("update:name", nameList)
      emit("change", value as string[])
    }
  })
}

const filterOption = (input: string, option: any) => {
  return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

watch(
  () => props.list,
  () => {
    getList()
  },
  { immediate: true }
)

watch(
  () => props.code,
  (val) => {
    if (val === selectedValue.value) return
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
    } else {
      setDefault()
    }
  },
  { immediate: true }
)
</script>
