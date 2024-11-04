<script setup>
import { ref, watch } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { useUserStore } from '@/stores'
import router from '@/router'
const isRegister = ref(false)
const formRef = ref()
const userStore = useUserStore()
const formModel = ref({
  username: '',
  password: '',
  repassword: ''
})
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[0-9a-zA-Z]{1,10}$/,
      message: '用户名必须是1-10位的字母数字',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15位的非空字符',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.password) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}
const register = async () => {
  await formRef.value.validate()
  await userRegisterService(formModel.value)
  ElMessage.success('注册成功~')
  isRegister.value = false
}
const login = async () => {
  await formRef.value.validate()
  const re = await userLoginService(formModel.value)
  userStore.getToken(re.data.token)
  ElMessage.success('登录成功~')
  router.push('/')
}
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: ''
  }
})
</script>
<template>
  <div class="container">
    <div class="banner">校园信息论坛</div>
    <div class="main">
      <div class="phone">
        <el-form
          :model="formModel"
          :rules="rules"
          ref="formRef"
          autocomplete="off"
          size="large"
          v-if="isRegister"
        >
          <el-form-item>
            <h1>注册</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="formModel.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="repassword">
            <el-input
              v-model="formModel.repassword"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入再次密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="register"
            >
              注册
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = false">
              ← 返回
            </el-link>
          </el-form-item>
        </el-form>
        <el-form
          :model="formModel"
          :rules="rules"
          ref="formRef"
          size="large"
          autocomplete="off"
          v-else
        >
          <el-form-item>
            <h1>登录</h1>
          </el-form-item>
          <el-form-item prop="username">
            <el-input
              v-model="formModel.username"
              :prefix-icon="User"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formModel.password"
              :prefix-icon="Lock"
              type="password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="flex">
            <div class="flex">
              <el-checkbox>记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button
              class="button"
              type="primary"
              auto-insert-space
              @click="login"
              >登录</el-button
            >
          </el-form-item>
          <el-form-item class="flex">
            <a href="http://38617112yi.zicp.vip/oauth/login">
              <img src="@/assets/1.png" alt="" />
            </a>
            <a href="https://im.qq.com/index/">
              <img src="@/assets/2.png" alt="" />
            </a>
            <el-link
              type="info"
              :underline="false"
              @click="isRegister = true"
              style="margin-left: 300px"
            >
              注册 →
            </el-link>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
img {
  width: 40px;
  height: 40px;
  margin-left: 20px;
}
.container {
  width: 1000px;
  height: 700px;
  border-radius: 10px;
  // background: #fff;
  margin: 0 auto;
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.11);
  .banner {
    padding-left: 10px;
    box-sizing: border-box;
    width: 1000px;
    height: 100px;
    background: #409eff;
    line-height: 100px;
    font-size: 20px;
    color: #fff;
  }
  .main {
    width: 1000px;
    height: 600px;
    .phone {
      width: 50%;
      margin: 10px auto;
      .button {
        width: 100%;
      }
      .flex {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
