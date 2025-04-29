<template>
    <div class="min-h-screen flex flex-col">
      <header class="bg-blue-600 text-white py-4 px-6 shadow-md flex justify-between items-center">
        <h1 class="text-xl font-bold">Gestor de Tareas</h1>
  
        <button
            @click="handleLogout"
            class="bg-white text-blue-600 text-sm px-2 py-1 rounded hover:bg-gray-100 transition"
        >
            Logout
        </button>


      </header>
  
      <main class="flex-1 bg-gray-50 p-4">
        <slot></slot>
      </main>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/store/authStore'
  
  const router = useRouter()
  const authStore = useAuthStore()
  
  const handleLogout = async () => {
    try {
      await authStore.logout()
      router.push('/')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }
  </script>
  