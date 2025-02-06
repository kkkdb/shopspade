<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NonePage',
  setup() {
    const router = useRouter()
    const Backup = () => {
      router.go(-1)
    }
    return {
      Backup,
    }
  },
}
</script>

<template>
  <div>
    <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
      <template #extra>
        <a-button type="primary" @click="Backup">
          Back Home
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<style></style>
