import type { SelectProps } from 'ant-design-vue'
import CommonSelect from './index.vue'

export interface CommonSelectProps {
  id?: string | number
  placeholder?: string
  disabled?: boolean
  code?: string | string[]
  name?: string | string[]
  mode?: SelectProps['mode']
  list?: any[]
  valueName?: string
  labelName?: string
  allowClear?: boolean
  immediate?: boolean
  maxTagCount?: number
}

export { CommonSelect }
export default CommonSelect
