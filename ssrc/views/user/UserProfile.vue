<script setup>
import { ref } from 'vue'
import CommonShelf from '@/components/CommonShelf.vue'
import { useUserStore } from '@/stores'
import { userUpdateInfoService } from '@/api/user'
const userStore = useUserStore()
const {
  user: { id, username, nickname, email }
} = userStore
const formData = ref({ id, username, nickname, email })
// 校验规则
const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 2, max: 10, message: '昵称必须为2-10个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ]
}
const formRef = ref(null)
const onSubmit = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(formData.value)
  userStore.getUserInfo()
  ElMessage.success('修改用户信息成功~')
}
</script>
<template>
  <CommonShelf title="基本资料">
    <el-row
      ><el-col :span="12">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="100px"
          class="user-form"
          size="large"
        >
          <!-- 第一行: 登录名称，禁用状态 -->
          <el-form-item label="登录名称">
            <el-input v-model="formData.username" disabled />
          </el-form-item>

          <!-- 第二行: 用户昵称，可输入，有校验 -->
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="formData.nickname"
              placeholder="请输入用户昵称"
            />
          </el-form-item>

          <!-- 第三行: 用户邮箱，可输入，有校验 -->
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入用户邮箱" />
          </el-form-item>

          <!-- 第四行: 提交按钮 -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col></el-row
    >
  </CommonShelf>
</template>
<style scoped></style>
