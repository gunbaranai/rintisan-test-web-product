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
      // Make API call to update the backend
      const response = await api.bulkUpdateProductStatus(productIds, status)

      // Check if API call was successful
      if (response.success || response.status === 'success') {
        // Update products in the store optimistically
        products.value = products.value.map((product) =>
          productIds.includes(product.id) ? { ...product, is_active: status } : product,
        )
        console.log(`Successfully updated ${productIds.length} products to status: ${status}`)
      } else {
        throw new Error(response.message || 'Failed to update product status')
      }
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
      // Make API call to update the backend
      const response = await api.updateProductStatus(productId, status)

      // Check if API call was successful
      if (response.success || response.status === 'success') {
        // Update product in the store optimistically
        const productIndex = products.value.findIndex((p) => p.id === productId)
        if (productIndex !== -1) {
          products.value[productIndex] = { ...products.value[productIndex], is_active: status }
        }
        console.log(`Successfully updated product ${productId} to status: ${status}`)
      } else {
        throw new Error(response.message || 'Failed to update product status')
      }
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

  const createProduct = async (productData) => {
    try {
      // Call your API endpoint
      const response = await api.createProduct(productData)

      // Add to local state if needed
      products.value.unshift({
        ...productData,
        id: response.data.id,
        isActive: true,
        updatedAt: new Date().toLocaleDateString('id-ID'),
      })

      return response
    } catch (error) {
      console.error('Failed to create product:', error)
      throw error
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
    createProduct,
  }
})
