<template>
  <AuthLayout>
    <div class="flex flex-col items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center">Iniciar Sesión</h1>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              class="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium">Contraseña</label>
            <input
              v-model="password"
              type="password"
              class="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            class="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors duration-300 ease-in-out"
            :disabled="loading"
          >
            {{ loading ? 'Ingresando...' : 'Entrar' }}
          </button>

          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import AuthLayout from '@/layouts/AuthLayout.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Error al iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>
