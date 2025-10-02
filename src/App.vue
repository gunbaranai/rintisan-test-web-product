<script setup>
import { onMounted, toRaw } from 'vue'
import ProductList from '@/views/ProductList.vue'
import { useProductStore } from '@/stores/product'
import { NSpin } from 'naive-ui'

const store = useProductStore()

onMounted(() => {
  store.fetchProducts()
})
</script>

<template>
  <ProductList v-if="toRaw(store.products).length > 0" />
  <div v-else>
    <n-spin size="large" class="flex justify-center items-center h-screen" />
  </div>
</template>

<style scoped></style>
