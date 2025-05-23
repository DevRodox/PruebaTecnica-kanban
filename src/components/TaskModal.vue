<template>
  <transition name="fade">
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Editar Tarea' : 'Crear Tarea' }}</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium">Título</label>
            <input
              v-model="localTask.title"
              type="text"
              class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Descripción</label>
            <textarea
              v-model="localTask.description"
              class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium">Fecha de vencimiento</label>
            <input
              v-model="localTask.expiration_date"
              type="date"
              :min="todayDate"
              class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium">Prioridad</label>
            <select
              v-model="localTask.tag_id"
              class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500"
              required
            >
              <option disabled value="">Selecciona una prioridad</option>
              <option :value="1">Alta</option>
              <option :value="2">Media</option>
              <option :value="3">Baja</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-300"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
            >
              Guardar
            </button>
          </div>
        </form>

        <p v-if="error" class="text-red-500 text-sm text-center mt-4">{{ error }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, isAfter, isToday } from 'date-fns'

const props = defineProps({
  task: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      expiration_date: '',
      tag_id: '',
      status_id: '',
      user_ids: []
    })
  }
})

const emit = defineEmits(['save', 'close'])

const localTask = ref({ ...props.task })
const error = ref('')

const isEditMode = computed(() => !!props.task.id)
const todayDate = format(new Date(), 'yyyy-MM-dd')

const handleSubmit = () => {
  const today = new Date()
  const expiration = new Date(localTask.value.expiration_date)

  if (!isToday(expiration) && !isAfter(expiration, today)) {
    error.value = 'La fecha de vencimiento debe ser hoy o en el futuro.'
    return
  }

  emit('save', { ...localTask.value })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
