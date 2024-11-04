<script setup>
import { ref } from 'vue'
import {
  artArticleClassifyService,
  artArticleClassifyDeleteService
} from '@/api/article'
import { Edit, Delete } from '@element-plus/icons-vue'
import CommonShelf from '@/components/CommonShelf.vue'
import ChannelManage from './components/ChannelManage.vue'
const formData = ref([])
const loading = ref(false)
const channelManageRef = ref()
const getChannelList = async () => {
  loading.value = true
  const re = await artArticleClassifyService()
  formData.value = re.data.data
  loading.value = false
}
getChannelList()
const handleAdd = () => {
  channelManageRef.value.openDialog({})
}
const handleEdit = row => {
  channelManageRef.value.openDialog(row)
}
const handleDelete = async row => {
  await ElMessageBox.confirm('你确认删除该分类消息吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artArticleClassifyDeleteService(row.id)
  ElMessage.success('删除成功!')
  getChannelList()
}
const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <CommonShelf title="文章分类">
    <template #extra>
      <el-button type="primary" @click="handleAdd">添加分类</el-button>
    </template>
    <el-table v-loading="loading" :data="formData" style="width: 100%">
      <el-table-column label="序号" type="index" width="100" />
      <el-table-column prop="cate_name" label="分类名称" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button
            type="primary"
            plain
            circle
            :icon="Edit"
            @click="handleEdit(row)"
          >
          </el-button>
          <el-button
            type="danger"
            plain
            circle
            :icon="Delete"
            @click="handleDelete(row)"
          >
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据宝宝"></el-empty>
      </template>
    </el-table>
    <ChannelManage ref="channelManageRef" @success="onSuccess"></ChannelManage>
  </CommonShelf>
</template>
