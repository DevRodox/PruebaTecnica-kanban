<template>
  <div
    class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-grab active:cursor-grabbing relative"
    @click="$emit('edit', task)"
  >
    <button
      @click.stop="$emit('delete', task)"
      class="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-lg z-10"
    >
      ✖
    </button>

    <div class="flex justify-between items-start pr-6">
      <h3 class="text-lg font-semibold text-gray-800">{{ task.title }}</h3>
      <span
        class="text-xs font-bold uppercase rounded-full px-2 py-1"
        :class="priorityClass"
      >
        {{ priorityLabel }}
      </span>
    </div>

    <p class="text-sm text-gray-600 mt-2 line-clamp-3">
      {{ task.description || 'Sin descripción' }}
    </p>

    <div class="mt-4 text-right">
      <span class="text-xs text-gray-500">
        Vence: {{ formatDate(task.expiration_date) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { format } from 'date-fns'

const { task } = defineProps({
  task: {
    type: Object,
    required: true
  }
})

const priorityLabel = computed(() => {
  switch (task.tag_id) {
    case 1: return 'Alta'
    case 2: return 'Media'
    case 3: return 'Baja'
    default: return 'Sin Prioridad'
  }
})

const priorityClass = computed(() => {
  switch (task.tag_id) {
    case 1: return 'bg-red-300 text-red-800'
    case 2: return 'bg-yellow-300 text-yellow-800'
    case 3: return 'bg-green-300 text-green-800'
    default: return 'bg-gray-300 text-gray-800'
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'Sin fecha'
  return format(new Date(dateString), 'dd/MM/yyyy')
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
