import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'userinfo',
  () => {
    const token = ref('')
    const getToken = () => {
      token.value = '2324efdgf'
    }
    return { token, getToken }
  },
  {
    persist: true
  }
)
