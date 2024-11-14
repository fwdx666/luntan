<script setup>
import { ref, nextTick, defineEmits } from 'vue'
import ChannelSelect from '@/components/ChannelSelect.vue'
import { Plus } from '@element-plus/icons-vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import {
  artArticlePublishService,
  artArticleDetailsService,
  artArticleEditService
} from '@/api/article'
import router from '@/router'
import { baseURL } from '@/utils/request'
import axios from 'axios'
const dialogVisible = ref(false)
const defaultModel = ref({
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: '已发布'
})
const formModel = ref({})
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 15, message: '标题长度在1-15个字符哦', trigger: 'blur' }
  ],
  cate_id: [
    { required: true, message: '请选择文章分类', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (
          value === '' &&
          (formModel.value.cover_img !== '' ||
            formModel.value.title !== '' ||
            formModel.value.content !== '')
        ) {
          callback(new Error('请选择文章分类'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  cover_img: [{ required: true, message: '请上传文章封面', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}
const imageUrl = ref('')
const formRef = ref(null)
const quillRef = ref(null)
const emit = defineEmits(['addEditSuccess'])
const openAddEdit = async isAddEdit => {
  dialogVisible.value = true
  if (isAddEdit.id) {
    //是编辑文章, 进行表单回显
    const re = await artArticleDetailsService(isAddEdit.id)
    formModel.value = re.data.data
    imageUrl.value = baseURL + formModel.value.cover_img
    formModel.value.cover_img = await convertUrlToFile(
      imageUrl.value,
      formModel.value.cover_img
    )
  } else {
    //是发布文章, 进行表单重置
    formModel.value = { ...defaultModel.value }
    imageUrl.value = ''
    nextTick(() => {
      quillRef.value.setHTML('')
    })
  }
}
const convertUrlToFile = async (imageUrl, fileName) => {
  try {
    // 发送 GET 请求获取图片的二进制数据
    const response = await axios.get(imageUrl, {
      responseType: 'blob' // 指定响应类型为 'blob'
    })

    // 将 Blob 转换为 File 对象
    const file = new File([response.data], fileName, {
      type: response.data.type
    })

    // 返回 File 对象
    return file
  } catch (error) {
    console.error('图片转换失败:', error)
  }
}
const handleImageChange = async file => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formModel.value.cover_img = file.raw
  await formRef.value.validateField('cover_img')
}
const submitAddEdit = async () => {
  await formRef.value.validate()
  //无论是发布文章还是编辑文章都需要做的操作
  const formData = new FormData()
  for (let key in formModel.value) {
    formData.append(key, formModel.value[key])
  }
  //若为编辑文章, 则调编辑文章相关接口
  if (formModel.value.id) {
    await artArticleEditService(formData)
    ElMessage.success('编辑文章成功~')
    emit('addEditSuccess', 'edit')
  }
  //若为发布文章, 则调发布文章相关接口
  else {
    await artArticlePublishService(formData)
    ElMessage.success('添加文章成功~')
    router.push(`/${formModel.value.cate_id}`)
    emit('addEditSuccess', 'add')
  }
  dialogVisible.value = false
}
const QuillEditorValidate = async () => {
  await formRef.value.validateField('content')
}
defineExpose({
  openAddEdit,
  component: {
    QuillEditor
  }
})
</script>
<template>
  <el-dialog
    class="el-dialog-ref"
    v-model="dialogVisible"
    :title="formModel.id ? '快捷编辑' : '快捷发布'"
    width="500"
    style="border-radius: 10px"
  >
    <!-- 这里是写内容部分的地方 -->
    <el-form
      :model="formModel"
      :rules="rules"
      ref="formRef"
      label-width="100px"
    >
      <el-form-item label="文章标题" prop="title"
        ><el-input v-model="formModel.title" placeholder="请输入标题"></el-input
      ></el-form-item>
      <el-form-item label="文章分类" prop="cate_id"
        ><channel-select v-model="formModel.cate_id"></channel-select
      ></el-form-item>
      <el-form-item label="文章封面" prop="cover_img">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleImageChange"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
            theme="snow"
            ref="quillRef"
            v-model:content="formModel.content"
            contentType="html"
            @blur="QuillEditorValidate()"
          ></QuillEditor>
        </div>
      </el-form-item>
    </el-form>
    <!-- 这里是添加文章弹框尾部, 看是否要发布文章 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button
          type="primary"
          style="border-radius: 20px"
          @click="submitAddEdit"
        >
          发送
        </el-button>
      </div>
    </template>
  </el-dialog>
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
// .el-dialog-ref {
//   :deep() {
//     .el-dialog__title {
//       color: red;
//     }
//   }
// }
.editor {
  width: 100%;
  :deep(.ql-editor) {
    min-height: 200px;
  }
}
</style>
