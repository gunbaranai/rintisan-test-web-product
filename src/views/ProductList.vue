<script setup>
import { onMounted } from 'vue'
import { NH1, NButton, NSpin } from 'naive-ui'
import { useProductStore } from '@/stores/product'
import ProductTable from './ProductTable.vue'

const productStore = useProductStore()

onMounted(async () => {
  // Only fetch if we don't have products yet
  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
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

const handleVariantStatusChange = (parentId, variantId, status) => {
  // Handle variant status change
  console.log(`Variant ${variantId} of product ${parentId} status changed to: ${status}`)
  // You can add specific logic here for variant status updates
  // For now, we'll use the same updateProductStatus method
  productStore.updateProductStatus(variantId, status)
}
</script>

<template>
  <div class="p-6">
    <n-h1>Daftar Produk</n-h1>

    <!-- Loading State -->
    <div v-if="productStore.loading" class="flex justify-center items-center py-8">
      <n-spin size="large" />
    </div>

    <!-- Error State -->
    <div v-else-if="productStore.error" class="text-center py-8 text-red-500">
      Error: {{ productStore.error }}
    </div>

    <!-- Products Content -->
    <div v-else>
      <!-- Add Product Button -->
      <div class="justify-self-end mb-6">
        <n-button type="primary" size="large" @click="$router.push('/products/add')" color="#0B557F">
          + Tambah Barang
        </n-button>
      </div>

      <ProductTable :products="productStore.products" @update:selected="handleSelectionChange"
        @status-change="handleStatusChange" @bulk-status-change="handleBulkStatusChange"
        @variant-status-change="handleVariantStatusChange" />
    </div>
  </div>
</template>
