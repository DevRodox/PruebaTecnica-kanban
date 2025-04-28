import axios from 'axios'

const api = axios.create({
  baseURL: 'https://898a-2806-103e-27-3342-493d-3fd3-a70f-f91a.ngrok-free.app/',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
