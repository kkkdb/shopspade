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
    :value="selectedValue"
    :filter-option="filterOption"
    :not-found-content="loading ? undefined : null"
    @focus="getList"
    @change="onChange"
  >
    <template slot="notFoundContent" v-if="loading">
      <a-spin size="small" />
    </template>
    <a-select-option v-for="(item, index) in option" :value="String(item[valueName])" :key="index">
      {{ item[labelName] }}
    </a-select-option>
  </a-select>
</template>

<script>
import axios from "axios"

export default {
  name: 'CommonQuerySelect',
  
  props: {
    placeholder: String,
    disabled: Boolean,
    code: String,
    name: String,
    mode: String,
    api: String,
    params: {
      type: Object,
      default: () => ({})
    },
    immediate: {
      type: Boolean,
      default: false
    },
    valueName: {
      type: String,
      default: 'code'
    },
    labelName: {
      type: String,
      default: 'name'
    },
    resultField: {
      type: String,
      default: 'list'
    }
  },

  data() {
    return {
      selectedValue: undefined,
      option: [],
      loading: false
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
    code() {
      if (this.option.length > 0) {
        this.setDefault()
      } else if (!this.name) {
        this.getList()
      }
    },
    name: {
      handler(val) {
        if (val) {
          this.selectedValue = val
        }
      },
      immediate: true
    }
  },

  methods: {
    async getList() {
      if (this.option.length > 0) return
      if (!this.api) return

      this.loading = true
      try {
        const res = await axios.post(this.api, {
          ...this.params,
        })
        const list = res.data || res.data?.[this.resultField] || []
        if (list.length === 0) {
          return
        }
        this.option = list
        this.setDefault()
      } catch (error) {
        console.error('Failed to fetch list:', error)
      } finally {
        this.loading = false
      }
    },

    setDefault() {
      if (this.name) return
      this.selectedValue = undefined
      if (this.code !== undefined) {
        this.onChange(this.code)
      }
    },

    onChange(value) {
      if (value !== undefined) {
        value = String(value)
      }
      this.selectedValue = value
      this.$emit("update:code", value)
      const item = this.option.find((elem) => String(elem[this.valueName]) === value) || {}
      this.$emit("update:name", item[this.labelName])
      this.$emit("change", item)
    },

    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  },

  mounted() {
    if (this.immediate) {
      this.getList()
    }
  }
}
</script>