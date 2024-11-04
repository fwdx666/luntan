<script setup>
import CommonShelf from '@/components/CommonShelf.vue'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import ChannelSelect from './components/ChannelSelect.vue'
import { artArticleListService, artArticleDeleteService } from '@/api/article'
import { Getdayjs } from '@/utils/format'
import ArticleEdit from './components/ArticleEdit.vue'
const ArticleEditRef = ref()
const loading = ref(false)
const ManageData = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})
const TableList = ref([])
const total = ref(0)
const getTableList = async () => {
  loading.value = true
  const re = await artArticleListService(ManageData.value)
  total.value = re.data.total
  TableList.value = re.data.data
  loading.value = false
}
getTableList()
const onSubmit = () => {
  ManageData.value.pagenum = 1
  getTableList()
}
const onReset = () => {
  ManageData.value.pagenum = 1
  ManageData.value.cate_id = ''
  ManageData.value.state = ''
  getTableList()
}
const handleSizeChange = newSize => {
  ManageData.value.pagesize = newSize
  ManageData.value.pagenum = 1
  getTableList()
}
const handleCurrentChange = newPage => {
  ManageData.value.pagenum = newPage
  getTableList()
}
const handleAdd = () => {
  ArticleEditRef.value.open({})
}
const handleEdit = row => {
  ArticleEditRef.value.open(row)
}
const handleDelete = async row => {
  await ElMessageBox.confirm('你确定要删除这条文章吗?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artArticleDeleteService(row.id)
  ElMessage.success('删除成功')
  getTableList()
}
const getSuccess = son => {
  if (son === '发布文章') {
    ManageData.value.pagenum = Math.ceil(
      (total.value + 1) / ManageData.value.pagesize
    )
  }
  getTableList()
}
</script>
<template>
  <CommonShelf title="文章管理">
    <template #extra>
      <el-button type="primary" @click="handleAdd">发布文章</el-button>
    </template>

    <el-form inline>
      <el-form-item label="文章分类: ">
        <ChannelSelect v-model="ManageData.cate_id"></ChannelSelect>
      </el-form-item>
      <el-form-item label="发布状态: ">
        <el-select v-model="ManageData.state" style="width: 220px">
          <el-option value="已发布" label="已发布"></el-option>
          <el-option value="草稿" label="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="TableList" v-loading="loading">
      <el-table-column prop="title" label="文章标题" width="400px">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ Getdayjs(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="150px" />
      <el-table-column label="操作" width="100px">
        <template #default="{ row }">
          <el-button
            @click="handleEdit(row)"
            type="primary"
            circle
            plain
            :icon="Edit"
          >
          </el-button>
          <el-button
            @click="handleDelete(row)"
            type="danger"
            circle
            plain
            :icon="Delete"
          >
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="description" />
      </template>
    </el-table>
    <el-pagination
      v-model:current-page="ManageData.pagenum"
      v-model:page-size="ManageData.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :total="total"
      background
      layout="jumper, total, sizes, prev, pager, next"
      style="margin-top: 20px; justify-content: flex-end"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <ArticleEdit ref="ArticleEditRef" @success="getSuccess"></ArticleEdit>
  </CommonShelf>
</template>
<style lang="scss" scoped>
// .el-table >>> .el-table__row {
//   min-height: 100px !important;
// }
// .el-table >>> .el-table__cell {
//   line-height: 100px !important;
// }
</style>
