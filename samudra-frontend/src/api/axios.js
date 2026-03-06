import axios from 'axios'

const STORAGE_KEY = 'samudra_token'

let authToken = localStorage.getItem(STORAGE_KEY) || null

export const setAuthToken = (token) => {
  authToken = token
  if (token) localStorage.setItem(STORAGE_KEY, token)
  else localStorage.removeItem(STORAGE_KEY)
}

export const getAuthToken = () => authToken

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_DIRECTUS_BASE_URL,
})

axiosInstance.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setAuthToken(null)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
