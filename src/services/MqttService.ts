import MqttConfig from '@renderer/configs/mqtt.config'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const createMqttService = (): AxiosInstance => {
  const axiosInstance = axios.create({
    timeout: 60000,
    // baseURL: 'http://localhost:3060',
    // baseURL: import.meta.env.VITE_EMQX_URL,
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',  // Nonaktifkan cache
      'Pragma': 'no-cache',         // Pastikan browser tidak menggunakan cache
      'Expires': '0'                // Mengatakan browser untuk tidak menyimpan cache
    },
    auth: {
      username: MqttConfig.username,
      password: MqttConfig.password
    }
  })

  // Menambahkan interceptor untuk response
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Menangani kesalahan pada response
      console.error('Error in API call:', error.response || error.message)
      return Promise.reject(error)
    }
  )

  return axiosInstance
}

// Fungsi untuk GET request
export const mqttGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const axiosInstance = createMqttService()
  const response = await axiosInstance.get<T>(url, config)
  return response.data
}

// Fungsi untuk POST request
export const mqttPost = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const axiosInstance = createMqttService()
  const response = await axiosInstance.post<T>(url, data, config)
  return response.data
}

// Fungsi untuk DELETE request
export const mqttDelete = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const axiosInstance = createMqttService()
  const response = await axiosInstance.delete<T>(url, config)
  return response.data
}

// Fungsi untuk PUT request
export const mqttPut = async <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const axiosInstance = createMqttService()
  const response = await axiosInstance.put<T>(url, data, config)
  return response.data
}
