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

      <div v-if="tasksStore.loading" class="flex justify-center items-center min-h-[50vh]">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(status, index) in statuses"
          :key="index"
          class="bg-gray-100 p-4 rounded-lg shadow-md min-h-[400px] max-h-[75vh] overflow-y-auto"
        >
          <h2 class="text-xl font-semibold mb-4">{{ status.label }}</h2>

          <draggable
            :list="filteredTasks(status.id)"
            group="tasks"
            item-key="id"
            @end="onDragEnd"
          >
            <template #item="{ element }">
              <TaskCard
                :task="element"
                @edit="openEditModal"
                @delete="confirmDelete"
              />
            </template>

            <template #footer>
              <div v-if="filteredTasks(status.id).length === 0" class="text-center text-gray-400 text-sm mt-4">
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
import { ref, onMounted } from 'vue'
import { useTasksStore } from '@/store/tasksStore'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import TaskCard from '@/components/TaskCard.vue'
import TaskModal from '@/components/TaskModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import draggable from 'vuedraggable'

const tasksStore = useTasksStore()

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

const filteredTasks = (statusId) => {
  return tasksStore.tasks.filter(task => task.status_id === statusId)
}

const onDragEnd = async (event) => {
  const { item, to } = event
  const newStatusIndex = Array.from(to.parentNode.children).indexOf(to)
  const newStatusId = statuses[newStatusIndex]?.id

  if (!newStatusId) return

  try {
    await tasksStore.changeTaskStatus(item.id, newStatusId)
  } catch (error) {
    console.error('Error al mover la tarea', error)
  }
}

const openModal = () => {
  selectedTask.value = {
    title: '',
    description: '',
    expiration_date: '',
    tag_id: ''
  }
  isModalOpen.value = true
}

const openEditModal = (task) => {
  selectedTask.value = { ...task }
  isModalOpen.value = true
}

const handleSaveTask = async (taskData) => {
  try {
    if (taskData.id) {
      await tasksStore.editTask(taskData.id, taskData)
    } else {
      await tasksStore.addTask(taskData)
    }
    closeModal()
  } catch (error) {
    console.error('Error al guardar la tarea', error)
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
    console.error('Error eliminando tarea', error)
  } finally {
    isConfirmDialogOpen.value = false
  }
}
</script>
