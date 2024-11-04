import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'
export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const user = ref({})
    const setToken = newToken => {
      token.value = newToken
    }
    const removeToken = () => {
      token.value = ''
    }
    const getUserInfo = async () => {
      const re = await userGetInfoService()
      user.value = re.data.data
    }
    const setUserInfo = obj => {
      user.value = obj
    }
    return {
      token,
      setToken,
      removeToken,
      user,
      getUserInfo,
      setUserInfo
    }
  },
  {
    persist: true
  }
)
