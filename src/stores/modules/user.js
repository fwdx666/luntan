import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'userinfo',
  () => {
    const token = ref('')
    const user = ref({})
    const getToken = tokenValue => {
      token.value = tokenValue
    }
    const removeToken = () => {
      token.value = ''
    }
    const getUser = async () => {
      const re = await userInfoService()
      user.value = re.data.data
    }
    const removeUser = () => {
      user.value = {}
    }
    return { token, getToken, removeToken, user, getUser, removeUser }
  },
  {
    persist: true
  }
)
