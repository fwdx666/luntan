<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import {
  userUpdateInfoService,
  userUpdatePasswordService,
  userUpdateAvatarService
} from '@/api/user'
import router from '@/router'
const userStore = useUserStore()
//修改信息
const {
  user: { username, nickname, email, id }
} = userStore
const form = ref({})
const formRef = ref(null)
form.value = { username, nickname, email }
const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    {
      min: 2,
      max: 10,
      message: '昵称长度必须在2到10个字符之间',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur']
    }
  ]
}
//修改密码
const pwdFormRef = ref(null)
const pwdForm = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
const rules2 = {
  old_pwd: [
    { required: true, message: '原密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 15,
      message: '密码长度必须在6到15个字符之间',
      trigger: 'blur'
    }
  ],
  new_pwd: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 15,
      message: '密码长度必须在6到15个字符之间',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        // 自定义校验：原密码和新密码不能相同
        if (value === pwdForm.value.old_pwd) {
          callback(new Error('新密码不能和原密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  re_pwd: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        // 自定义校验：新密码和确认密码必须相同
        if (value !== pwdForm.value.new_pwd) {
          callback(new Error('确认密码和新密码必须一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
//修改头像
const imgUrl = ref(userStore.user.user_pic)
const onUploadFile = file => {
  const reader = new FileReader() // 1.创建 FileReader 对象
  reader.onloadend = () => {
    imgUrl.value = reader.result // 3.将 Base64 字符串赋值给 imgUrl
  }
  reader.readAsDataURL(file.raw) // 2.读取文件并转换为 Base64
}
const submitImg = async () => {
  await userUpdateAvatarService(imgUrl.value)
  await userStore.getUser()
  ElMessage.success('修改头像成功~')
}
const submitForm = async () => {
  await formRef.value.validate()
  await userUpdateInfoService(id, form.value.nickname, form.value.email)
  await userStore.getUser()
  ElMessage.success('修改个人信息成功~')
}
const submitPwdForm = async () => {
  await pwdFormRef.value.validate()
  await userUpdatePasswordService(pwdForm.value)
  userStore.removeToken()
  userStore.removeUser()
  ElMessage.success('修改密码成功~')
  router.push('/login')
}
</script>
<template>
  <!-- 修改头像 -->
  <div class="avatar-container">
    <el-upload
      ref="uploadRef"
      class="avatar-uploader"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onUploadFile"
    >
      <img v-if="imgUrl" :src="imgUrl" class="avatar" />
      <img v-else src="@/assets/default.png" width="200" />
    </el-upload>
    <el-button
      class="submit-btn"
      style="margin: 5px 0 15px 40px"
      @click="submitImg"
      >上传修改</el-button
    >
  </div>
  <!-- 修改个人信息---昵称和邮箱信息 -->
  <el-form
    ref="formRef"
    :model="form"
    :rules="rules"
    size="large"
    label-width="120px"
    class="form-container"
  >
    <el-form-item label="登录名称">
      <el-input v-model="form.username" :disabled="true" />
    </el-form-item>
    <el-form-item label="用户昵称" prop="nickname">
      <el-input v-model="form.nickname" placeholder="请输入昵称" />
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
      <el-input v-model="form.email" placeholder="请输入邮箱" />
    </el-form-item>
    <el-form-item>
      <el-button class="submit-btn submit-nickname-password" @click="submitForm"
        >修改信息</el-button
      >
    </el-form-item>
  </el-form>
  <!-- 修改密码信息 -->
  <el-form
    ref="pwdFormRef"
    :model="pwdForm"
    :rules="rules2"
    size="large"
    label-width="120px"
    class="form-container"
  >
    <el-form-item label="原密码" prop="old_pwd">
      <el-input
        v-model="pwdForm.old_pwd"
        type="password"
        placeholder="请输入原密码"
      />
    </el-form-item>
    <el-form-item label="新密码" prop="new_pwd">
      <el-input
        v-model="pwdForm.new_pwd"
        type="password"
        placeholder="请输入新密码"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="re_pwd">
      <el-input
        v-model="pwdForm.re_pwd"
        type="password"
        placeholder="请输入确认密码"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        class="submit-btn submit-nickname-password"
        @click="submitPwdForm"
        >修改密码</el-button
      >
    </el-form-item>
  </el-form>
</template>
<style lang="scss" scoped>
//更改昵称和邮箱样式
.form-container {
  position: relative;
  margin-left: 100px;
  width: 600px;
}
.el-form-item {
  margin-bottom: 20px;
  //修改昵称, 邮箱和密码按钮样式
  .submit-nickname-password {
    position: absolute;
    right: -150px;
    bottom: 80px;
  }
}
//修改按钮样式
.submit-btn {
  background: linear-gradient(45deg, #ff8c3d, #ffb84d); /* 调整为浅橙色渐变 */
  border: none;
  color: white;
  font-weight: bold;
  font-size: 16px;
  padding: 10px 20px;
  border-radius: 5px;
  box-shadow: 0 4px 10px rgba(255, 140, 0, 0.4); /* 浅橙色阴影 */
  transition: background 0.3s ease, transform 0.3s ease;
}

.submit-btn:hover {
  background: linear-gradient(45deg, #ff9f47, #ffcb6e); /* 悬浮时的渐变效果 */
  transform: translateY(-2px);
}

.submit-btn:active {
  background: linear-gradient(45deg, #e67b32, #ffb347); /* 点击时的渐变效果 */
  transform: translateY(2px);
}

.submit-btn:focus {
  outline: none;
}
//修改头像样式
.avatar-uploader {
  :deep() {
    .avatar {
      width: 200px;
      height: 200px;
      display: block;
    }
    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
}
.avatar-container {
  margin-left: 400px;
}
</style>
