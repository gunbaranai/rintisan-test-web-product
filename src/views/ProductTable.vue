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
    title: 'Nama Barang',
    key: 'name',
  },
  {
    title: 'Harga',
    key: 'price',
    width: 120,
  },
  {
    title: 'Kategori',
    key: 'category',
    render(row) {
      return row.category.name
    }
  },
  {
    title: 'Status',
    key: 'active',
    width: 100,
    render(row) {
      return h(NTag, {
        type: row.is_active === 1 ? 'success' : 'error',
        size: 'small'
      }, {
        default: () => row.is_active === 1 ? 'Active' : 'Inactive'
      })
    }
  }
]
</script>

<template>
  <div>
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
