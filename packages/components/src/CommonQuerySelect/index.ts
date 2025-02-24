import type { SelectProps } from 'ant-design-vue'

export interface OptionItem {
  [key: string]: any
}

export interface CommonQuerySelectProps {
  placeholder?: string
  disabled?: boolean
  code?: string | string[]
  name?: string | string[]
  mode?: SelectProps['mode']
  api?: string
  params?: Record<string, any>
  immediate?: boolean
  selectOne?: boolean
  valueName?: string
  labelName?: string
  resultField?: string
}

import CommonQuerySelect from './index.vue'
export { CommonQuerySelect }
export default CommonQuerySelect
