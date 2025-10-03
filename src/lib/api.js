const API_BASE = `${import.meta.env.VITE_API_ENDPOINT}/management/product`
const AUTH_TOKEN = import.meta.env.VITE_API_KEY

export const api = {
  async getProducts({
    search = '', // search by name / nullable
    page_count = 10, // page count / nullable
    active = 1, // active (1: active, 0: inactive) / nullable
    page = 1, // page
  }) {
    const response = await fetch(`${API_BASE}/item/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search,
        page_count,
        active,
        page,
      }),
    })
    return response.json()
  },

  async bulkUpdateProductStatus(productIds, status) {
    // Convert productIds array to pipe-separated string
    const idBarang = productIds.join('|')
    // Convert boolean status to ON/OFF string
    const statusString = status ? 'ON' : 'OFF'

    console.log('Bulk updating products:', { idBarang, status: statusString })

    const response = await fetch(`${API_BASE}/item/changeitemstatus`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_barang: idBarang,
        status: statusString,
      }),
    })
    return response.json()
  },

  async updateProductStatus(productId, status) {
    // Convert boolean status to ON/OFF string
    const statusString = status ? 'ON' : 'OFF'

    console.log('Updating product:', { id_barang: productId, status: statusString })

    const response = await fetch(`${API_BASE}/item/changeitemstatus`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id_barang: productId.toString(),
        status: statusString,
      }),
    })
    return response.json()
  },

  async createProduct(productData) {
    const response = await fetch(`${API_BASE}/item/add`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    })
    return response.json()
  },
}
