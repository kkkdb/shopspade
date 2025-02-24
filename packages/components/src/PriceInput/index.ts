export interface PriceInputProps {
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

import PriceInput from './index.vue'
export { PriceInput }
export default PriceInput
