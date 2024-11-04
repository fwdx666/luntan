<script setup>
import { ref } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import { nextTick } from 'vue'
import { baseURL } from '@/utils/request'
import axios from 'axios'
import {
  artArticleAddService,
  artArticleDetailService,
  artArticleEditService
} from '@/api/article'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
const Url = ref('')
const isshowDrawer = ref(false)
const formRef = ref()
const quillRef = ref()
const defaultDrawerObj = ref({
  title: '',
  cate_id: '',
  content: '',
  cover_img: '', //file格式
  state: ''
})
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 30, message: '文章标题的长度为1~30个字符', trigger: 'blur' }
  ],
  cate_id: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
  //图片部分最特殊!!!用是否存在value来进行自定义验证
  cover_img: [
    {
      validator: (rule, value, callback) => {
        if (value) {
          callback()
        } else {
          callback(new Error('请上传文章封面'))
        }
      },
      trigger: 'change'
    }
  ]
}
const drawerObj = ref({})
//在打开抽屉组件的时候进行表单回显或者表单数据初始化, 而不是在关闭抽屉组件的时候做这件事情~
const open = async row => {
  isshowDrawer.value = true
  if (row.id) {
    const re = await artArticleDetailService(row.id)
    drawerObj.value = re.data.data
    Url.value = baseURL + re.data.data.cover_img
    drawerObj.value.cover_img = await imageUrlToFile(Url.value, 'cover_img')
  } else {
    drawerObj.value = { ...defaultDrawerObj.value }
    Url.value = ''
    nextTick(() => {
      quillRef.value.setHTML('')
    })
  }
}
const handleAvatarChange = file => {
  Url.value = URL.createObjectURL(file.raw)
  drawerObj.value.cover_img = file.raw
}
const emit = defineEmits(['success'])
//这里是凭借着drawerObj是否包含id值来判定是已发布还是草稿状态
const handlePublish = async obj => {
  await formRef.value.validate()
  drawerObj.value.state = obj

  const formData = new FormData()
  for (let key in drawerObj.value) {
    formData.append(key, drawerObj.value[key])
  }

  if (!drawerObj.value.id) {
    await artArticleAddService(formData)
    ElMessage.success('发布文章成功呀饱饱~')
    emit('success', '发布文章')
  } else {
    await artArticleEditService(formData)
    ElMessage.success('编辑文章成功呀饱饱~')
    emit('success', '编辑文章')
  }
  isshowDrawer.value = false
}
async function imageUrlToFile(imageUrl, fileName) {
  try {
    // 通过 axios 发送 GET 请求，获取图片的 Blob 数据
    const { data: blob } = await axios.get(imageUrl, { responseType: 'blob' })
    // 从 Blob 数据生成 File 对象
    const file = new File([blob], fileName, { type: blob.type })
    // 返回生成的 File 对象
    return file
  } catch (error) {
    console.error('图片转换为 File 对象时出错:', error) // 打印错误信息
    throw error // 抛出错误，方便调用者捕获
  }
}
defineExpose({
  open,
  conponents: {
    QuillEditor
  }
})
</script>
<template>
  <el-drawer
    v-model="isshowDrawer"
    :title="drawerObj.id ? '编辑文章' : '添加文章'"
    size="50%"
  >
    <el-form
      :model="drawerObj"
      :rules="rules"
      label-width="100px"
      ref="formRef"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="drawerObj.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <ChannelSelect
          v-model="drawerObj.cate_id"
          style="width: 100%"
        ></ChannelSelect>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-change="handleAvatarChange"
          :auto-upload="false"
        >
          <img v-if="Url" :src="Url" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <!-- 关于富文本编辑器: 
       1. 富文本编辑器中的文本框内容在与变量绑定时, 文本框内容改变的时候, 与之绑定的变量也会改变, 并且变量的值为string形式的html内容
       2. 富文本编辑器并不是完全响应式的, 当再次打开抽屉组件需要将抽屉组件中的内容全部清空时, 对于其他的地方只需清空与之绑定的变量即可, 但是对于富文本编辑器需要手动清空才可以, 用  quillRef.value.setHTML('')来实现富文本编辑器的清空效果。当然也有能够响应式的时候, 就是当与之绑定的变量的值的改变值不为空的时候, 富文本编辑器会自动响应式更新
       3. 如果要在script中对富文本编辑器的文本框进行赋值的话, 且赋的值是string形式的html内容, 需要在富文本编辑器中增加contentType="html", 让其知道需要解析的内容不是单纯文本框, 而是html标签 -->
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <QuillEditor
            ref="quillRef"
            theme="snow"
            v-model:content="drawerObj.content"
            contentType="html"
          ></QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <template #default>
          <el-button type="primary" @click="handlePublish('已发布')"
            >发布</el-button
          >
          <el-button type="info" @click="handlePublish('草稿')">草稿</el-button>
        </template>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style lang="scss" scoped>
.avatar-uploader {
  :deep() {
    .avatar {
      width: 178px;
      height: 178px;
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
      width: 178px;
      height: 178px;
      text-align: center;
    }
  }
}
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
