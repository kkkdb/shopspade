<script setup>
import { computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  pageNo: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
})

const emit = defineEmits(['change'])

const currentPage = computed({
  get: () => props.pageNo,
  set: () => {}, // 由父组件控制
})

const pageSize = computed({
  get: () => props.pageSize,
  set: () => {}, // 由父组件控制
})

function handleChange(page_no, page_size) {
  emit('change', { page_no, page_size })
}

function handleSizeChange(page_no, page_size) {
  emit('change', { page_no, page_size })
}
</script>

<template>
  <div class="pagination-wrapper">
    <a-pagination
      v-model:current="currentPage"
      v-model:page-size="pageSize"
      :total="total"
      :show-total="(total) => $t('共 X 条', { X: total })"
      :show-size-changer="true"
      @change="handleChange"
      @show-size-change="handleSizeChange"
    />
  </div>
</template>

<style scoped lang="scss">
.pagination-wrapper {
  margin: 16px 0;
  text-align: right;
}
</style>
