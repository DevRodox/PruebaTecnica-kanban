<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 class="text-xl font-bold mb-4 text-center">{{ title }}</h2>
        <p class="text-gray-600 mb-6 text-center">{{ message }}</p>
  
        <div class="flex justify-end gap-4">
          <button
            @click="$emit('cancel')"
            class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-300 ease-in-out"
          >
            Cancelar
          </button>
          <button
            @click="$emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300 ease-in-out"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    title: {
      type: String,
      default: '¿Estás seguro?'
    },
    message: {
      type: String,
      default: 'Esta acción no se puede deshacer.'
    }
  })
  </script>
  