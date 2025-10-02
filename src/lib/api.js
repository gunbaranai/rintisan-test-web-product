const API_BASE = import.meta.env.VITE_API_ENDPOINT
const AUTH_TOKEN = import.meta.env.VITE_API_KEY

export const api = {
  async getProducts({
    search = '', // search by name / nullable
    page_count = 10, // page count / nullable
    active = 1, // active (1: active, 0: inactive) / nullable
    page = 1, // page
  }) {
    console.log(search, page_count, active, page)
    const response = await fetch(`${API_BASE}/management/product/item/list`, {
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

  // async createProduct(productData) {
  //   const response = await fetch(`${API_BASE}/products`, {
  //     method: 'POST',
  //     headers: {
  //       Authorization: `Bearer ${AUTH_TOKEN}`,
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(productData),
  //   })
  //   return response.json()
  // },
}
