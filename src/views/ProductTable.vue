<script setup>
import { computed, h, reactive, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import {
  NBadge,
  NDataTable,
  NSwitch,
  NTag,
  NCard,
  NTabs,
  NTabPane,
  NInput,
  NSelect,
  NIcon,
  NButton
} from 'naive-ui'
import { formatDate } from '@/lib/utils'

// Props and emits
const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:selected', 'status-change', 'bulk-status-change'])

// Reactive state
const selectedProductIds = ref([])
const searchQuery = ref('')
const activeTab = ref('all')
const itemsPerPage = ref(10)
const currentPage = ref(1)

// Computed
const filteredProducts = computed(() => {
  console.log(reactive(props.products))
  let filtered = reactive(props.products)

  // Search filter
  if (searchQuery.value) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Status filter
  if (activeTab.value === 'active') {
    filtered = filtered.filter(product => product.is_active)
  } else if (activeTab.value === 'inactive') {
    filtered = filtered.filter(product => !product.is_active)
  }

  return filtered
})

const activeCount = computed(() =>
  props.products.filter(p => p.is_active).length
)

const inactiveCount = computed(() =>
  props.products.filter(p => !p.is_active).length
)

const store = useProductStore()

// Define columns for the data table
const columns = [
  {
    type: 'selection',
    // disabled: (row) => !!row.has_variant // Disable selection for variant rows
    // idea was right, execution could be better?
  },
  {
    title: 'Nama Barang',
    key: 'name',
    render: (row) => {
      // Main product row
      if (!row.variant) {
        return h('div', { class: 'flex items-center space-x-2' }, [
          h('span', { class: 'font-semibold' }, row.name),
          row.variant && h(NBadge, {
            value: `${row.variant.length} Varian`,
            type: 'info',
            size: 'small'
          }),
          row.add_on_link_count && h(NBadge, {
            value: `${row.add_on_link_count} Add On`,
            type: 'success',
            size: 'small'
          })
        ])
      }
      // Variant row (indented)
      return h('div', { class: 'pl-6 text-gray-600' }, row.name)
    }
  },
  {
    title: 'Harga',
    key: 'price',
    render: (row) =>
      h('span', new Intl.NumberFormat('id-ID').format(row.price))
  },
  {
    title: 'Kategori',
    key: 'category',
    render: (row) =>
      h(NTag, { type: 'info' }, { default: () => row.category.name })
  },
  {
    title: 'Tanggal Diperbaharui',
    key: 'updated_at',
    render: (row) =>
      h('span', { class: 'text-gray-500' }, formatDate(row.updated_at))
  },
  {
    title: 'Tindakan',
    key: 'actions',
    render: (row) =>
      h(NSwitch, {
        value: row.is_active,
        onUpdateValue: (value) => handleStatusChange(row.id, value),
        round: false
      })
  }
]

// Pagination
const pagination = reactive({
  page: currentPage,
  pageSize: itemsPerPage,
  showSizePicker: true,
  pageSizes: [5, 10, 25],
  onChange: (page) => {
    currentPage.value = page
  },
  onUpdatePageSize: (pageSize) => {
    itemsPerPage.value = pageSize
    currentPage.value = 1
  }
})

const pageSizeOptions = [
  { label: 'Tampilkan 5', value: 5 },
  { label: 'Tampilkan 10', value: 10 },
  { label: 'Tampilkan 25', value: 25 }
]

// Methods
const handleSelectionChange = (keys) => {
  selectedProductIds.value = keys
  emit('update:selected', keys)
}

const handleStatusChange = (id, status) => {
  emit('status-change', id, status)
}

const handleBulkStatusChange = (status) => {
  emit('bulk-status-change', selectedProductIds.value, status)
  selectedProductIds.value = []
}

const clearSelection = () => {
  selectedProductIds.value = []
}
</script>

<style>
.n-tabs .n-tabs-tab {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>

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
      <n-card>
        <div class="flex flex-row justify-between">
          <!-- Bulk Actions Header -->
          <div v-if="selectedProductIds.length > 0"
            class="bg-blue-50 p-4 rounded-lg mb-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <span class="text-blue-700 font-semibold">{{ selectedProductIds.length }} Produk dipilih</span>
              <n-button type="error" @click="handleBulkStatusChange(false)">
                Nonaktifkan
              </n-button>
              <n-button type="primary" @click="handleBulkStatusChange(true)">
                Aktifkan
              </n-button>
            </div>
            <n-button quaternary @click="clearSelection">
              Batalkan pilihan
            </n-button>
          </div>

          <!-- Status Tabs -->
          <n-tabs v-else v-model:value="activeTab" type="segment" class="max-w-max mb-4">
            <n-tab-pane name="all" :tab="`Semua Barang (${products.length})`">
              <!-- Content will be handled by table -->
            </n-tab-pane>
            <n-tab-pane name="active" :tab="`Aktif (${activeCount})`">
              <!-- Content will be handled by table -->
            </n-tab-pane>
            <n-tab-pane name="inactive" :tab="`Nonaktif (${inactiveCount})`">
              <!-- Content will be handled by table -->
            </n-tab-pane>
          </n-tabs>

          <!-- Search and Pagination Controls -->
          <div class="flex justify-between items-center mb-4">
            <n-input v-model:value="searchQuery" placeholder="Cari barang..." clearable class="w-64 mx-2">
              <template #prefix>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512">
                    <path
                      d="M456.69 421.39L362.6 327.3a173.81 173.81 0 0 0 34.84-104.58C397.44 126.38 319.06 48 222.72 48S48 126.38 48 222.72s78.38 174.72 174.72 174.72A173.81 173.81 0 0 0 327.3 362.6l94.09 94.09a25 25 0 0 0 35.3-35.3zM97.92 222.72a124.8 124.8 0 1 1 124.8 124.8a124.95 124.95 0 0 1-124.8-124.8z"
                      fill="currentColor"></path>
                  </svg>
                </n-icon>
              </template>
            </n-input>

            <n-select v-model:value="itemsPerPage" :options="pageSizeOptions" class="w-32 mx-2" />
          </div>
        </div>

        <!-- Product Table -->
        <n-data-table :columns="columns" :data="filteredProducts" :pagination="pagination" :row-key="row => row.id"
          @update:checked-row-keys="handleSelectionChange" />
      </n-card>
    </div>
  </div>
</template>
