<template>
  <button
    :class="[
      'mono-button',
      `mono-button--${type}`,
      {
        'is-disabled': disabled
      }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: 'primary' | 'default' | 'danger'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style>
.mono-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
}

.mono-button--primary {
  background: #409eff;
  border-color: #409eff;
  color: #ffffff;
}

.mono-button--danger {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #ffffff;
}

.mono-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
