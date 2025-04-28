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
      this.loading = true
      this.error = null

      try {
        const data = await fetchTasks()
        this.tasks = data.tasks || []
      } catch (error) {
        console.error(error)
        this.error = 'Error al cargar tareas'
      } finally {
        this.loading = false
      }
    },

    async addTask(taskData) {
      try {
        const newTask = await createTask(taskData)
        this.tasks.push(newTask)
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
        const updatedTask = await moveTask(id, newStatusId)
        const index = this.tasks.findIndex(task => task.id === id)
        if (index !== -1) {
          this.tasks[index].status_id = updatedTask.status_id
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
})
