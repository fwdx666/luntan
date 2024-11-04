import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'userinfo',
  () => {
    const token = ref('')
    const getToken = tokenValue => {
      token.value = tokenValue
    }
    return { token, getToken }
  },
  {
    persist: true
  }
)
