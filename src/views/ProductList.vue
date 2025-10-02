<script setup>
import { onMounted } from 'vue'
import { NH1, NButton } from 'naive-ui'
import { useProductStore } from '@/stores/product'
import ProductTable from './ProductTable.vue'

const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchProducts()
})

const handleSelectionChange = (selectedIds) => {
  console.log('Selected products:', selectedIds)
}

const handleStatusChange = (productId, status) => {
  // Update product status via store
  productStore.updateProductStatus(productId, status)
}

const handleBulkStatusChange = (productIds, status) => {
  // Bulk update status via store
  productStore.bulkUpdateStatus(productIds, status)
}
</script>

<template>
  <div class="p-6">
    <n-h1>Daftar Produk</n-h1>

    <ProductTable :products="productStore.products" @update:selected="handleSelectionChange"
      @status-change="handleStatusChange" @bulk-status-change="handleBulkStatusChange" />

    <!-- Add Product Button -->
    <div class="mt-6">
      <n-button type="primary" size="large" @click="$router.push('/products/add')">
        + Tambah Barang
      </n-button>
    </div>
  </div>
</template>
