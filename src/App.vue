<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { NConfigProvider, NMessageProvider, NDialogProvider, NNotificationProvider } from 'naive-ui'

const store = useProductStore()

onMounted(() => {
  store.fetchProducts()
})
</script>

<template>
  <n-config-provider>
    <n-message-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <div id="app">
            <router-view />
          </div>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
