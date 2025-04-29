import { defineStore } from 'pinia'
import { fetchTasks, createTask, updateTask, deleteTask, moveTask } from '@/api/tasks'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),

  getters: {
    tasksByStatus: (state) => (statusId) => {
      return state.tasks.filter(task => task.status_id === statusId)
    }
  },

  actions: {
    async loadTasks() {
      try {
        const response = await fetchTasks()
        this.tasks = response.data.data || []
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    
    async addTask(taskData) {
      try {
        const response = await createTask(taskData)
        this.tasks.push(response.data)
      } catch (error) {
        console.error(error)
        throw error
      }
    },    

    async editTask(id, updatedData) {
      try {
        const updatedTask = await updateTask(id, updatedData)
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index] = updatedTask
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async removeTask(id) {
      try {
        await deleteTask(id)
        this.tasks = this.tasks.filter(task => task.id !== id)
      } catch (error) {
        console.error(error)
        throw error
      }
    },

    async changeTaskStatus(id, newStatusId) {
      try {
        console.log('changeTaskStatus llamado:', { id, newStatusId })
        const updatedTask = await moveTask(id, newStatusId)
        console.log('Respuesta de moveTask:', updatedTask)
    
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index].status_id = newStatusId
          console.log('Tarea actualizada localmente:', this.tasks[index])
        } else {
          console.warn('Tarea no encontrada en local tasks:', id)
        }
      } catch (error) {
        console.error('Error en changeTaskStatus:', error.response?.data || error)
        throw error
      }
    }    
  }
})
