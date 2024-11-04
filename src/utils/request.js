import axios from 'axios'
import { useUserStore } from '@/stores'
import router from '@/router'
const baseURL = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  baseURL,
  timeout: 100000
})
// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 如果用户处于登录状态, 那么就需要在所有请求接口的请求头中加上token令牌
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  error => Promise.reject(error)
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 如果response.status === 200, 并且response.data.code === 0, 那么就请求成功
    if (response.data.code === 0) {
      return response
    }
    //  如果response.status === 200, 但是response.data.code !== 0, 那么就请求失败, 但是由于是response.status === 200, 所以并不会触发 error 回调函数抛出错误, 因此这里需要手动抛出错误
    ElMessage.error(response.data.message || '请求失败!')
    //这里不用Promise.reject(response.data.message)是因为reject 返回的应该是一个可以描述错误的对象或信息，以便调用者能根据这个对象做出相应处理。
    return Promise.reject(response.data)
  },
  error => {
    // 对响应错误做点什么
    ElMessage.error(error.response.data.message || '请求失败!')
    if (error.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
//默认导出, 每个模块只可以有一次, 导入方式为: import 可以取任意名字 from '@/utils/request'
export default instance
//命名导出, 每个模块可以有很多次, 导入方式为: import { baseURL }(必须是导出时使用的名字) from '@/utils/request'
export { baseURL }
