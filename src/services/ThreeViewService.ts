import axios from 'axios'

const ThreeViewService = axios.create({
  timeout: 60000,
  // baseURL: 'http://localhost:3060',
  // baseURL: import.meta.env.VITE_THREEVIEW_URL,
  headers: {
    language: 'EN'
  }
})

ThreeViewService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error in API call:', error.response || error.message)
    return Promise.reject(error)
  }
)

export default ThreeViewService
