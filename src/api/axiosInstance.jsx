import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000,
})

axiosInstance.interceptors.request.use(config => config)

axiosInstance.interceptors.response.use(
  res   => res.data,
  error => Promise.reject(error.response?.data?.message || error.message)
)

export default axiosInstance