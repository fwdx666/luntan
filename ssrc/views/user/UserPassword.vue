<script setup>
import { ref } from 'vue'
import CommonShelf from '@/components/CommonShelf.vue'
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const userStore = useUserStore()
const formRef = ref(null)
const router = useRouter()
const validateRePassword = (rule, value, callback) => {
  if (value !== pwdForm.value.new_pwd) {
    callback(new Error('确认密码和新密码必须相同'))
  } else {
    callback()
  }
}
const validateOldNewPassword = (rule, value, callback) => {
  if (value === pwdForm.value.old_pwd) {
    callback(new Error('新密码和原密码不能相同'))
  } else {
    callback()
  }
}
const rules = {
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '长度应为 6 到 15 位', trigger: 'blur' }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '长度应为 6 到 15 位', trigger: 'blur' },
    { validator: validateOldNewPassword, trigger: 'blur' }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' },
    { validator: validateRePassword, trigger: 'blur' }
  ]
}
const handleSubmit = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  ElMessage.success('修改密码成功~')
  userStore.removeToken()
  userStore.setUserInfo({})
  router.push('/login')
}
const handleReset = () => {
  formRef.value.resetFields()
}
</script>
<template>
  <CommonShelf title="重置密码">
    <el-row>
      <el-col :span="12">
        <el-form
          :model="pwdForm"
          :rules="rules"
          ref="formRef"
          label-width="100px"
          size="large"
        >
          <el-form-item label="原密码" prop="old_pwd">
            <el-input type="password" v-model="pwdForm.old_pwd" />
          </el-form-item>

          <el-form-item label="新密码" prop="new_pwd">
            <el-input type="password" v-model="pwdForm.new_pwd" />
          </el-form-item>

          <el-form-item label="确认新密码" prop="re_pwd">
            <el-input type="password" v-model="pwdForm.re_pwd" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleSubmit">修改密码</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </CommonShelf>
</template>
<style scoped>
/* 样式可以根据需要自定义 */
</style>
