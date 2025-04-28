import api from './index'

export const fetchTasks = async () => {
  const response = await api.get('/tasks')
  return response.data
}

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData)
  return response.data
}

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData)
  return response.data
}

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`)
}

export const moveTask = async (id, newStatusId) => {
  const response = await api.put(`/tasks/toggle-complete/${id}`, { status_id: newStatusId })
  return response.data
}
