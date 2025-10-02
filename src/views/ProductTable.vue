<script setup>
import { h, toRaw } from 'vue'
import { useProductStore } from '@/stores/product'
import { NDataTable, NTag } from 'naive-ui'

const store = useProductStore()

const data = toRaw(store.products)

console.log('Products in ProductTable:', store.products)
console.log('Products length:', store.products.length)

// Define columns for the data table
const columns = [
  {
    title: 'ID',
    key: 'id',
    width: 80,
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Price',
    key: 'price',
    width: 120,
  },
  {
    title: 'Status',
    key: 'active',
    width: 100,
    render(row) {
      return h(NTag, {
        type: row.active ? 'success' : 'error',
        size: 'small'
      }, {
        default: () => row.active ? 'Active' : 'Inactive'
      })
    }
  }
]
</script>

<template>
  <div>
    <div class="mb-4">
      DEBUG: LENGTH: {{ data.length }}
    </div>

    <!-- Loading state -->
    <div v-if="store.loading" class="text-center py-8">
      Loading products...
    </div>

    <!-- Error state -->
    <div v-else-if="store.error" class="text-center py-8 text-red-500">
      Error: {{ store.error }}
    </div>

    <!-- Products data table -->
    <div v-else>
      <n-data-table :columns="columns" :data="data" :loading="store.loading" :bordered="true" :striped="true" />
    </div>
  </div>
</template>
