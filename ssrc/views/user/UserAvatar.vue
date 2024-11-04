<script setup>
import { ref } from 'vue'
import { Plus, Upload } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import CommonShelf from '@/components/CommonShelf.vue'
import { userUpdateAvatarService } from '@/api/user'
let mm = ref(0)
const userStore = useUserStore()
const imgUrl = ref(userStore.user.user_pic)
const uploadRef = ref(null)
const onUploadFile = file => {
  const reader = new FileReader() // 创建 FileReader 对象
  reader.onloadend = () => {
    imgUrl.value = reader.result // 将 Base64 字符串赋值给 imgUrl
  }
  reader.readAsDataURL(file.raw) // 读取文件并转换为 Base64
  mm.value = 1
}
const onSubmit = async () => {
  await userUpdateAvatarService(imgUrl.value)
  ElMessage.success('上传图像成功~')
  await userStore.getUserInfo()
}
</script>

<template>
  <CommonShelf title="更换头像">
    <el-row>
      <el-col :span="12">
        <el-upload
          ref="uploadRef"
          class="avatar-uploader"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onUploadFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <img v-else src="@/assets/avatar.jpg" class="avatar" />
        </el-upload>
        <br />
        <el-button
          type="primary"
          :icon="Plus"
          size="large"
          @click="uploadRef.$el.querySelector('input').click()"
        >
          选择图片
        </el-button>
        <el-button
          type="success"
          :icon="Upload"
          size="large"
          :disabled="mm === 0"
          @click="onSubmit"
        >
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </CommonShelf>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 278px;
      height: 278px;
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
</style>
