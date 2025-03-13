<template>
  <a-select
    :allow-clear="allowClear"
    :mode="mode"
    show-search
    :max-tag-count="maxTagCount"
    style="width: 100%"
    :placeholder="_selfPlaceholder"
    :disabled="_selfDisabled"
    :value="selectedValue"
    :filter-option="filterOption"
    @change="onChange"
  >
    <a-select-option v-for="(item, index) in option" :value="item[valueName]" :key="index">
      {{ item[labelName] }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  name: 'CommonSelect',
  props: {
    id: {
      type: [String, Number],
      default: undefined
    },
    placeholder: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    code: {
      type: [String, Array],
      default: undefined
    },
    name: {
      type: [String, Array],
      default: undefined
    },
    mode: {
      type: String,
      default: undefined
    },
    list: {
      type: Array,
      default: () => []
    },
    valueName: {
      type: String,
      default: 'code'
    },
    labelName: {
      type: String,
      default: 'name'
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    immediate: {
      type: Boolean,
      default: true
    },
    maxTagCount: {
      type: Number,
      default: 3
    }
  },

  data() {
    return {
      selectedValue: undefined,
      option: []
    }
  },

  computed: {
    _selfPlaceholder() {
      return this.placeholder
    },
    _selfDisabled() {
      return this.disabled || false
    }
  },

  watch: {
    list: {
      handler() {
        this.getList()
      },
      immediate: true
    },
    code: {
      handler(val) {
        if (val === this.selectedValue) return
        if (this.option.length > 0) {
          this.setDefault()
        } else if (!this.name) {
          this.getList()
        }
      }
    },
    name: {
      handler(val) {
        if (val) {
          this.selectedValue = val
        } else {
          this.setDefault()
        }
      },
      immediate: true
    }
  },

  methods: {
    async getList() {
      const list = this.list || []
      this.option = list
      this.setDefault()
    },

    setDefault() {
      if (this.name || !this.immediate) {
        this.selectedValue = this.code
        return
      }
      this.selectedValue = undefined
      if (this.code !== undefined && this.code !== null) {
        this.onChange(this.code)
      } else if (this.option.length === 1) {
        this.onChange(this.option[0][this.valueName])
      }
    },

    onChange(_value) {
      this.$nextTick(() => {
        let value = _value
        if (this.mode !== "multiple" && value !== undefined) {
          value = String(value)
        }
        if (this.mode === "multiple" && typeof value === "string") {
          value = [value]
        }
        this.selectedValue = value
        this.$emit("update:code", value)
        
        if (this.mode !== "multiple") {
          const item = this.option.find((elem) => String(elem[this.valueName]) === value) || {}
          this.$emit("update:name", item[this.labelName])
          this.$emit("change", item)
        } else {
          const nameList = value.map((elem) => {
            const item = this.option.find((elem2) => String(elem2[this.valueName]) === elem) || {}
            return item[this.labelName]
          })
          this.$emit("update:name", nameList)
          this.$emit("change", value)
        }
      })
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>