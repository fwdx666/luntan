<script setup>
import { ref } from 'vue'
import {
  artArticleClassifyAddService,
  artArticleClassifyEditService
} from '@/api/article'
const dialogVisible = ref(false)
const formData = ref({})
const formRef = ref()
const openDialog = row => {
  dialogVisible.value = true
  formData.value = { ...row }
  // console.log(row)
}
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[0-9a-zA-Z]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}
const emits = defineEmits(['success'])
const onsubmit = async () => {
  await formRef.value.validate()
  if (!formData.value.id) {
    await artArticleClassifyAddService(formData.value)
    ElMessage.success('添加成功!')
  } else {
    await artArticleClassifyEditService(formData.value)
    ElMessage.success('编辑成功!')
  }
  emits('success')
  dialogVisible.value = false
}
defineExpose({
  openDialog
})
</script>
<template>
  <el-dialog
    v-model="dialogVisible"
    :title="formData.id ? '编辑分类' : '添加分类'"
    width="30%"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formRef"
      label-width="auto"
      style="max-width: 600px; margin: 30px"
    >
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formData.cate_name" />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formData.cate_alias" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
