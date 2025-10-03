import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products',
    },
    {
      path: '/products',
      name: 'ProductList',
      component: () => import('@/views/ProductList.vue'),
    },
    {
      path: '/products/add',
      name: 'AddProduct',
      component: () => import('@/views/AddProduct.vue'),
    },
    {
      path: '/products/:id/edit',
      name: 'EditProduct',
      component: () => import('@/views/AddProduct.vue'),
      props: true,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      redirect: '/products',
    },
  ],
})

export default router
