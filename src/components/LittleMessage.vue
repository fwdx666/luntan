<script setup>
import { ref, onMounted } from 'vue'
import avatar from '@/assets/default.png'
import fenxiang from '@/assets/fenxiang.png'
import comment from '@/assets/pinlun.png'
import dz from '@/assets/dz.png'
import HotSearch from './HotSearch.vue'
import {
  artArticleListService,
  artArticleDetailsService,
  artArticleDeleteService
} from '@/api/article'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { Getdayjs } from '@/utils/format'
import AddEditArticle from '@/components/AddEditArticle.vue'
import { useRoute } from 'vue-router'
import { Delete, Edit } from '@element-plus/icons-vue'
const route = useRoute()
const showComment = ref(false)
const userStore = useUserStore()
const props = defineProps({
  articleId: {
    type: Number
  }
})
const arr = ref([])
const loading = ref(false)
const paging = ref({
  pagenum: 1,
  pagesize: 4,
  total: 0
})
const AddEditRef = ref('')
const applyPage = async () => {
  loading.value = true
  const re = await artArticleListService({
    pagenum: paging.value.pagenum,
    pagesize: paging.value.pagesize,
    cate_id: props.articleId
  })
  arr.value = re.data.data
  paging.value.total = re.data.total
  loading.value = false
  arr.value.forEach(async item => {
    const re = await artArticleDetailsService(item.id)
    //将html格式的文本内容转换成纯文本内容
    const tempElement = document.createElement('div')
    tempElement.innerHTML = re.data.data.content
    let formattedContent = tempElement.innerHTML
      .replace(/<p>/g, '\n') // 替换 <p> 为换行符
      .replace(/<\/p>/g, '') // 移除 </p>
      .replace(/<br>/g, '\n') // 替换 <br> 为换行符
      .replace(/&nbsp;/g, ' ') // 将 &nbsp; 替换为普通空格
    item.content = formattedContent.trim()
    if (item.title === '图图') {
      item.img = baseURL + re.data.data.cover_img
    }
  })
}
onMounted(() => {
  applyPage()
})
//handlePageChange业务逻辑: 当刚好删除了最后一页中的最后一条信息的时候, handlePageChange会将当前页面自动更新到倒数第二页, 所以在删除文章的业务逻辑中, 可以直接调用applyPage()来渲染页面, 而不需要先用paging.value.pagenum = Math.ceil((paging.value.total + 1) / paging.value.pagesize)来更新当前页面为倒数第二页, 然后再调用applyPage()来渲染页面
const handlePageChange = newpage => {
  paging.value.pagenum = newpage
  applyPage()
}
const ArticleEdit = id => {
  if (route.path === '/profile/myArticle') AddEditRef.value.openAddEdit({ id })
}
const ArticleDelete = async id => {
  await ElMessageBox.confirm('你确定要删除这篇文章吗?', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await artArticleDeleteService(id)
  ElMessage.success('删除文章成功~')
  applyPage()
}
//updateApplyPage的业务逻辑: 编辑文章之后重新渲染页面, 使当前页面显示的是被编辑文章所在的那一页的内容
const updateApplyPage = async value => {
  if (value === 'edit') applyPage()
}
const share = () => {
  console.log('分享')
}
const clickComment = () => {
  console.log('评论')
}
const setZan = () => {
  console.log('点赞赞')
}
</script>
<template>
  <el-row>
    <el-col :span="17" v-loading="loading">
      <div
        v-loading="loading"
        v-for="item in arr"
        :key="item.id"
        class="content-box"
      >
        <!-- 头像，用户名 -->
        <div class="content-box-top">
          <el-avatar
            class="content-box-avatar"
            shape="circle"
            :size="50"
            :src="userStore.user.user_pic || avatar"
          ></el-avatar>
          <div class="nickcatetime">
            <div class="nickName">{{ userStore.user.nickname }}</div>
            <div class="content-catetime">
              <div class="content-category-tag">{{ item.cate_name }}</div>
              <span class="content-box-time">
                {{ Getdayjs(item.pub_date) }}
              </span>
              <!-- 删除图标 -->
              <el-icon
                v-if="route.path === '/profile/myArticle'"
                style="cursor: pointer; margin: 0 5px 0"
                @click="ArticleDelete(item.id)"
                ><Delete
              /></el-icon>
              <!-- 编辑图标 -->
              <el-icon
                v-if="route.path === '/profile/myArticle'"
                style="cursor: pointer"
                @click="ArticleEdit(item.id)"
                ><Edit
              /></el-icon>
            </div>
          </div>
        </div>
        <!-- 内容 -->
        <div class="content-feed-content">
          <!-- 文字部分 -->
          <div class="content-feed-ogText">{{ item.content }}</div>
          <!-- 图片/视频部分 -->
          <div v-if="item.img" class="content-feed-ogImage">
            <a href="#"><img :src="item.img" alt="" /></a>
          </div>
          <!-- 底部一键三连部分 -->
          <div>
            <div class="content-bootom-svg">
              <!-- 分享链接 -->
              <div class="content-bottom-hover" @click="share()">
                <img :src="fenxiang" />
                <span>10</span>
              </div>
              <!-- 评论 -->
              <div class="content-bottom-hover" @click="clickComment()">
                <img :src="comment" />
                <span>20</span>
              </div>
              <!-- 赞 -->
              <div class="content-bottom-hover" @click="setZan()">
                <img :src="dz" />
                <span>5</span>
              </div>
            </div>
            <!-- 评论列表 -->
            <div v-if="showComment">
              <!-- <Comment :contentObj="contentObj"></Comment> -->
            </div>
          </div>
        </div>
      </div>
      <div class="example-pagination-block">
        <el-pagination
          layout="prev, pager, next"
          :total="paging.total"
          :page-size="paging.pagesize"
          :current-page="paging.pagenum"
          @current-change="handlePageChange"
          style="margin-left: 300px"
        />
      </div>
      <AddEditArticle
        ref="AddEditRef"
        @addEditSuccess="updateApplyPage"
      ></AddEditArticle>
    </el-col>
    <el-col :span="6"><HotSearch></HotSearch></el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.content-box {
  width: 780px;
  margin: 0 0 20px 0;
  padding: 20px 20px 0;
  background-color: #fff;
  box-shadow: 0px 0px 25px rgb(0 0 0 / 10%);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}
.content-box-top {
  display: flex;
  height: 50px;
}
.content-box-avatar {
  margin-right: 10px;
}
.nickcatetime {
  margin-top: 3px;
}
.nickName {
  font-weight: bolder;
  font-size: 15px;
  margin-bottom: 5px;
}
.content-catetime {
  display: flex;
  align-items: center;
}
.content-category-tag {
  margin-right: 4px;
  font-size: 12px;
  color: #939393;
  display: inline-block;
  min-width: 26px;
  border: 1px solid #ccc;
  border-radius: 2px;
  height: 12px;
  line-height: 12px;
  text-align: center;
  padding: 1px;
}
.content-box-time {
  font-size: 12px;
  color: darkgrey;
}
.content-feed-content {
  padding-left: 60px;
  margin: 0px 10px 0 0;
}
.content-feed-ogText {
  white-space: pre-wrap;
  color: #333;
  font-size: 16px;
  line-height: 24px;
}
.content-feed-ogImage {
  margin-top: 8px;
}
// 一键三连部分
.content-bootom-svg {
  display: flex;
  justify-content: space-between;
  font-weight: bolder;
  color: rgb(110, 110, 110);
  margin: 10px 15px 15px 0px;
}
.content-bottom-hover {
  display: flex;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
  color: rgb(110, 110, 110);
  img {
    width: 20px;
    height: 20px;
  }
  span {
    margin-left: 5px;
  }
}
// .content-bottom-hover:hover {
//   color: #409eff;
// }
</style>
