import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/pages/Login.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (authStore.token && !authStore.user) {
    await authStore.validateSession()
  }

  if (to.meta.requiresAuth && !authStore.token) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.token) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
