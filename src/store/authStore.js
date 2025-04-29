import { defineStore } from 'pinia'
import { login as loginApi, logout as logoutApi, fetchUserProfile } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null
  }),
  actions: {
    async login(email, password) {
      try {
        const data = await loginApi(email, password)
    
        this.token = data.data.token
        localStorage.setItem('token', data.data.token)
    
        this.user = await fetchUserProfile()
    
        return true
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async logout() {
      try {
        if (this.token) {
          await logoutApi()
        }
      } catch (error) {
        console.error('Error cerrando sesión:', error)
      } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      }
    },

    async validateSession() {
      if (!this.token) return false

      try {
        this.user = await fetchUserProfile()
        return true
      } catch (error) {
        this.logout()
        return false
      }
    }
  }
})
