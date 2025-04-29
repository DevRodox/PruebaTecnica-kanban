<template>
  <DashboardLayout>

    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Tablero de Tareas</h1>
        <button
          @click="openModal"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 ease-in-out"
        >
          Crear Tarea
        </button>
      </div>

      <div v-if="tasksStore.loading" class="fixed inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
        <div class="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>


      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(status, index) in statuses"
          :key="index"
          :data-status-id="status.id"
          class="bg-gray-100 p-4 rounded-lg shadow-md min-h-[400px] max-h-[75vh] overflow-y-auto"
        >
          <h2 class="text-xl font-semibold mb-4">{{ status.label }}</h2>

          <draggable
            :list="tasksByStatus[status.id]"
            :group="{ name: 'tasks', pull: true, put: true }"
            item-key="id"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <div class="cursor-grab active:cursor-grabbing">
                <TaskCard
                  :task="element"
                  @edit="openEditModal"
                  @delete="confirmDelete"
                />
              </div>
            </template>

            <template #footer>
              <div v-if="tasksByStatus[status.id].length === 0" class="text-center text-gray-400 text-sm mt-4">
                No hay tareas
              </div>
            </template>
          </draggable>
        </div>
      </div>

      <TaskModal
        v-if="isModalOpen"
        :task="selectedTask"
        @save="handleSaveTask"
        @close="closeModal"
      />

      <ConfirmDialog
        v-if="isConfirmDialogOpen"
        :title="'Eliminar tarea'"
        :message="'¿Seguro que quieres eliminar esta tarea?'"
        @cancel="closeConfirmDialog"
        @confirm="handleDeleteTask"
      />
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { format, addDays } from 'date-fns'
import { useTasksStore } from '@/store/tasksStore'
import { useAuthStore } from '@/store/authStore'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskModal from '@/components/TaskModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import draggable from 'vuedraggable'

const tasksStore = useTasksStore()
const authStore = useAuthStore()

const statuses = [
  { id: 1, label: 'Por Hacer' },
  { id: 2, label: 'En Proceso' },
  { id: 3, label: 'Completado' }
]

const isModalOpen = ref(false)
const selectedTask = ref(null)

const isConfirmDialogOpen = ref(false)
const taskToDelete = ref(null)

onMounted(() => {
  tasksStore.loadTasks()
})

const tasksByStatus = computed(() => {
  const grouped = { 1: [], 2: [], 3: [] }
  tasksStore.tasks.forEach(task => {
    if (grouped[task.status_id]) {
      grouped[task.status_id].push(task)
    }
  })
  return grouped
})

const onDragEnd = async (event) => {
  const item = event.item?._underlying_vm_

  if (!item) {
    console.warn('No se encontró item movido')
    return
  }

  const toColumn = event.to?.closest('[data-status-id]')
  if (!toColumn) {
    console.warn('No se encontró columna destino')
    return
  }

  const newStatusId = Number(toColumn.dataset.statusId)

  if (!newStatusId) {
    console.warn('No se encontró status_id válido')
    return
  }

  try {
    await tasksStore.changeTaskStatus(item.id, newStatusId)
    item.status_id = newStatusId
    console.log('Tarea movida exitosamente', { id: item.id, newStatusId })
  } catch (error) {
    console.error('Error al mover la tarea:', error.response?.data || error)
  }
}

const openModal = () => {
  selectedTask.value = {
    title: '',
    description: '',
    expiration_date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    tag_id: '',
    status_id: 1,
    user_ids: []
  }
  isModalOpen.value = true
}

const openEditModal = (task) => {
  selectedTask.value = { ...task }
  isModalOpen.value = true
}

const handleSaveTask = async (taskData) => {
  try {
    const payload = {
      ...taskData,
      user_ids: [authStore.user?.id || 1]
    }

    if (taskData.id) {
      await tasksStore.editTask(taskData.id, payload)
    } else {
      await tasksStore.addTask(payload)
    }
    closeModal()
  } catch (error) {
    console.error('Error al guardar la tarea:', error.response?.data || error)
  }
}

const closeModal = () => {
  isModalOpen.value = false
}

const confirmDelete = (task) => {
  taskToDelete.value = task
  isConfirmDialogOpen.value = true
}

const closeConfirmDialog = () => {
  isConfirmDialogOpen.value = false
}

const handleDeleteTask = async () => {
  try {
    await tasksStore.removeTask(taskToDelete.value.id)
  } catch (error) {
    console.error('Error eliminando tarea:', error)
  } finally {
    isConfirmDialogOpen.value = false
  }
}
</script>
