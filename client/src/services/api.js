import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
}

// Sweets API
export const sweetsAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.name) params.append('name', filters.name)
    if (filters.category) params.append('category', filters.category)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    
    const queryString = params.toString()
    return api.get(`/sweets${queryString ? `?${queryString}` : ''}`)
  },
  getById: (id) => api.get(`/sweets/${id}`),
  create: (data) => api.post('/sweets', data),
  update: (id, data) => api.put(`/sweets/${id}`, data),
  delete: (id) => api.delete(`/sweets/${id}`),
  purchase: (id, quantity = 1) => api.post(`/sweets/${id}/purchase`, { quantity }),
  restock: (id, quantity) => api.post(`/sweets/${id}/restock`, { quantity }),
}

export default api

