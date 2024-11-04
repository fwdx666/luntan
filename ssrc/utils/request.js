import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
import { ElMessage } from 'element-plus'
const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 100000
})
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (response.data.code === 0) {
      return response
    }
    ElMessage({
      message: response.data.message || '请求失败嘤嘤',
      type: 'error'
    })
    return Promise.reject(response.data)
  },
  function (error) {
    // 对响应错误做点什么
    ElMessage({
      message: error.response.data.message || '请求失败嘤嘤',
      type: 'error'
    })
    if (error.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
export { baseURL }
export default instance
