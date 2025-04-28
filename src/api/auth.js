import api from './index'

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password })
  return response.data
}

export const logout = async () => {
  await api.post('/logout')
}

export const fetchUserProfile = async () => {
  const response = await api.get('/users/profile')
  return response.data
}
