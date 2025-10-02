import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/lib/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const selectedProducts = ref([])
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const toggleProductSelection = (productId) => {
    const index = selectedProducts.value.indexOf(productId)
    if (index > -1) {
      selectedProducts.value.splice(index, 1)
    } else {
      selectedProducts.value.push(productId)
    }
  }

  const bulkUpdateStatus = async (productIds, status) => {
    loading.value = true
    error.value = null

    try {
      // Update products in the store optimistically
      products.value = products.value.map((product) =>
        productIds.includes(product.id) ? { ...product, is_active: status } : product,
      )

      // Here you would typically make an API call to update the backend
      // await api.bulkUpdateProductStatus(productIds, status)

      console.log(`Updated ${productIds.length} products to status: ${status}`)
    } catch (err) {
      error.value = err.message || 'Failed to update product status'
      console.error('Error updating product status:', err)
    } finally {
      loading.value = false
    }
  }

  const updateProductStatus = async (productId, status) => {
    loading.value = true
    error.value = null

    try {
      // Update product in the store optimistically
      const productIndex = products.value.findIndex((p) => p.id === productId)
      if (productIndex !== -1) {
        products.value[productIndex] = { ...products.value[productIndex], is_active: status }
      }

      // Here you would typically make an API call to update the backend
      // await api.updateProductStatus(productId, status)

      console.log(`Updated product ${productId} to status: ${status}`)
    } catch (err) {
      error.value = err.message || 'Failed to update product status'
      console.error('Error updating product status:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchProducts = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await api.getProducts({
        search: searchQuery.value,
        page_count: itemsPerPage.value,
        active: 1,
        page: currentPage.value,
        ...params,
      })

      if (response.data && response.data.data) {
        products.value = response.data.data
      } else {
        products.value = []
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    selectedProducts,
    searchQuery,
    currentPage,
    itemsPerPage,
    loading,
    error,
    toggleProductSelection,
    bulkUpdateStatus,
    updateProductStatus,
    fetchProducts,
  }
})
