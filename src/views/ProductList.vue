<script setup>
import { useProductStore } from '@/stores/product'
import { NH1, NButton, NTabs, NTabPane, NInput, NSelect } from 'naive-ui'
import ProductTable from '@/views/ProductTable.vue'

const store = useProductStore()
const { selectedProducts, searchQuery, itemsPerPage, bulkUpdateStatus } = store
</script>

<template>
  <div class="p-6">
    <n-h1>Daftar Produk</n-h1>

    <!-- Bulk Actions -->
    <div v-if="selectedProducts.length > 0" class="mb-4 p-4 bg-blue-50 rounded">
      <span>{{ selectedProducts.length }} Produk dipilih</span>
      <n-button @click="bulkUpdateStatus(true)" class="ml-4">Aktifkan</n-button>
      <n-button @click="bulkUpdateStatus(false)">Nonaktifkan</n-button>
    </div>

    <!-- Status Tabs -->
    <n-tabs v-else type="segment">
      <n-tab-pane name="all" tab="Semua Barang">
        <!-- Product table -->
      </n-tab-pane>
      <n-tab-pane name="active" tab="Aktif">
        <!-- Active products -->
      </n-tab-pane>
      <n-tab-pane name="inactive" tab="Nonaktif">
        <!-- Inactive products -->
      </n-tab-pane>
    </n-tabs>

    <!-- Search and Pagination -->
    <div class="flex justify-between mb-4">
      <n-input v-model:value="searchQuery" placeholder="Cari barang..." class="w-64" />
      <n-select v-model:value="itemsPerPage" :options="[5, 10, 25]" class="w-32" />
    </div>

    <!-- Product Table Component -->
    <ProductTable />
  </div>
</template>
