<template>
  <div class="amount-input">
    <span v-if="showTxt">{{ displayValue }}</span>
    <input
      v-else
      style="width: 100%"
      class="rent-input amount-input-content"
      :class="right ? 'text-right' : ''"
      :style="propsStyle"
      :id="inputId"
      type="text"
      :placeholder="placeholder"
      :value="displayValue"
      @focus="onFocus"
      @blur="onBlur"
      @input="onInput"
      :disabled="disabled"
      @select="selectAll"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from "vue"

interface Props {
  id?: string
  value?: string | number
  placeholder?: string
  disabled?: boolean
  currency?: string
  right?: boolean
  showTxt?: boolean
  showZero?: boolean
  propsStyle?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  currency: 'CNY',
  right: false,
  showTxt: false,
  showZero: false,
  propsStyle: () => ({})
})

const emit = defineEmits<{
  'update:value': [value: string | number | undefined]
  'focus': []
  'blur': [value: string | number | undefined]
}>()

const rawValue = ref<string | number | undefined>(props.value)
const isFocused = ref(false)
const inputId = ref(props.id || `input-${Math.random().toFixed(8).slice(2)}`)

watch(
  () => props.value,
  (newValue) => {
    rawValue.value = newValue
  }
)

const displayValue = computed(() => {
  const val = `${toThousands(rawValue.value, props.currency)}`
  return isFocused.value ? getNumber(rawValue.value) : props.showZero && !val ? 0 : val
})

const toThousands = (num: string | number | undefined, currency?: string): string => {
  if (num === undefined || num === '') return ''
  const newNum = +num
  if (Number.isNaN(newNum)) {
    return String(num)
  }
  const parts = newNum.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //code对应的货币符号
  const code = currency?.toUpperCase() || 'CNY'
  const codeMap: Record<string, string> = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
    AUD: '$',
    CAD: '$',
    CHF: 'CHF',
    HKD: 'HKD',
    NZD: '$',
    SGD: '$',
  }
  return `${codeMap[code] || code}${parts.join('.')}`
}

const getNumber = (val: string | number | undefined): string | number | undefined => {
  if (val === undefined || val === '' || val === null) {
    return undefined
  }
  const newVal = String(val)
  if (newVal?.includes('.') && newVal[newVal.length - 1] === '.') {
    return newVal
  }
  const numberValue = Number(newVal)
  return Number.isNaN(numberValue) ? newVal : numberValue.toString() === newVal ? numberValue : newVal
}

const onFocus = (): void => {
  isFocused.value = true
  selectAll()
  emit('focus')
}

const onBlur = (): void => {
  isFocused.value = false
  emit('update:value', rawValue.value)
  emit('blur', rawValue.value)
}

const onInput = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value?.trim()
  if (/^-?\d*\.?\d*$/.test(value)) {
    rawValue.value = value
  }
}

const selectAll = (): void => {
  nextTick(() => {
    const input = document.querySelector(`#${inputId.value}`) as HTMLInputElement
    input?.select()
  })
}
</script>

<style scoped>
.amount-input {
  position: relative;
}
.text-right {
  text-align: right;
}
.rent-input {
  box-sizing: border-box;
  margin: 0;
  padding: 4px 11px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  background-color: #ffffff;
  background-image: none;
  border-width: 1px;
  border-style: solid;
  border-color: #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
  &:focus {
    border-color: #4096ff;
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
    border-inline-end-width: 1px;
    outline: 0;
  }
}
</style>
