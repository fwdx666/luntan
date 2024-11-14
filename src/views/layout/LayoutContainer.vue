<script setup>
import { ref, onMounted } from 'vue'
import {
  Search,
  User,
  SwitchButton,
  CaretBottom,
  Avatar,
  Edit,
  School,
  Sunny,
  ChatDotSquare
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import router from '@/router'
import AddEditArticle from '@/components/AddEditArticle.vue'
const inputSearch = ref('')
const userStore = useUserStore()
const AddEditArticleRef = ref(null)
onMounted(async () => {
  await userStore.getUser()
})
const handleCommand = async command => {
  if (command === 'logout') {
    await ElMessageBox.confirm('你确定要退出登录吗?', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    userStore.removeToken()
    userStore.removeUser()
    router.push('/login')
  } else if (command !== '') {
    router.push(`/${command}`)
  } else if (command === '') {
    AddEditArticleRef.value.openAddEdit({})
  }
}
// 待完成业务逻辑: 发布文章成功之后不仅要跳转到相应的文章分类路由, 还需要渲染那个分类的最后一页(就是使当前页面显示那个分类最后一页的内容)
const updateApplyPage = async value => {
  if (value === 'add') {
    //可以参考一下这个错误代码, 弄半天实在弄不出来这个业务逻辑呜呜
    // paging.value.pagenum = Math.ceil(
    //   (paging.value.total + 1) / paging.value.pagesize
    // )
    console.log(111)
  }
}
const onEnterSearch = () => {
  console.log('进行搜索')
}
</script>
<template>
  <div id="banner">
    <el-row>
      <el-col :span="7">
        <div class="logo">
          <img src="@/assets/logo.png" alt="" />
          <p>社区</p>
        </div>
      </el-col>
      <el-col :span="6" class="search-container">
        <el-icon><Search /></el-icon>
        <input
          v-model="inputSearch"
          placeholder="请输入关键词"
          class="search-input"
        />
        <span class="divider"></span>
        <el-button class="search-button" @click="onEnterSearch()"
          >搜索</el-button
        >
      </el-col>
      <el-col :span="11">
        <div class="right">
          <div class="btn">
            <el-dropdown placement="bottom-end" @command="handleCommand">
              <span class="el-dropdown__box">
                <el-avatar :src="userStore.user.user_pic || avatar" />
                <el-icon><CaretBottom /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="" :icon="Edit"
                    >发布文章</el-dropdown-item
                  >
                  <el-dropdown-item command="check" :icon="School"
                    >切换学校</el-dropdown-item
                  >
                  <el-dropdown-item command="profile" :icon="User"
                    >个人中心</el-dropdown-item
                  >
                  <el-dropdown-item command="logout" :icon="SwitchButton"
                    >退出登录</el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-container class="layout-container">
    <el-aside
      width="200px"
      v-if="
        $route.path !== '/profile' &&
        $route.path !== '/profile/myArticle' &&
        $route.path !== '/profile/basicInfo'
      "
    >
      <el-menu
        active-text-color="#ff8c00"
        :default-active="$route.path"
        text-color="#333"
        router
      >
        <div class="content-title">
          <el-icon><ChatDotSquare /></el-icon><span>讨论区</span>
        </div>
        <el-menu-item index="/42458">
          <el-icon><Sunny /></el-icon>
          <span>考研交流</span>
        </el-menu-item>
        <el-menu-item index="/42602">
          <el-icon><Sunny /></el-icon>
          <span>找工作交流</span>
        </el-menu-item>
        <el-menu-item index="/study">
          <el-icon><Sunny /></el-icon>
          <span>日常学习问题</span>
        </el-menu-item>
        <el-menu-item index="">
          <el-icon><Sunny /></el-icon>
          <span>寻物启事</span>
        </el-menu-item>
        <el-menu-item index="">
          <el-icon><Sunny /></el-icon>
          <span>闲置出售</span>
        </el-menu-item>
        <el-menu-item index="">
          <el-icon><Sunny /></el-icon>
          <span>拼单拼车</span>
        </el-menu-item>
        <el-menu-item index="">
          <el-icon><Sunny /></el-icon>
          <span>表白墙</span>
        </el-menu-item>
        <el-menu-item index="/42397">
          <el-icon><Sunny /></el-icon>
          <span>日常唠嗑</span>
        </el-menu-item>
        <el-menu-item index="">
          <el-icon><Sunny /></el-icon>
          <span>树洞倾诉</span>
        </el-menu-item>
        <el-menu-item index="">
          <el-icon><Sunny /></el-icon>
          <span>竞赛组队</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-aside width="200px" v-else>
      <el-menu
        active-text-color="#ff8c00"
        :default-active="$route.path"
        text-color="#333"
        router
      >
        <div class="content-title">
          <el-icon><Avatar /></el-icon><span>个人中心</span>
        </div>
        <el-menu-item index="/profile/myArticle">
          <el-icon><Sunny /></el-icon>
          <span>我的文章</span>
        </el-menu-item>
        <el-menu-item index="/profile/basicInfo">
          <el-icon><Sunny /></el-icon>
          <span>基本资料</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main><router-view></router-view></el-main>
  </el-container>
  <AddEditArticle
    ref="AddEditArticleRef"
    @addEditSuccess="updateApplyPage"
  ></AddEditArticle>
</template>
<style lang="scss" scoped>
#banner {
  height: 80px;
  background: #fff;
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.11);
  //最左边的logo和字
  .logo {
    height: 60px;
    display: flex;
    margin-right: 100px;
    margin-top: 10px;
    img {
      width: 50px;
      height: 50px;
      margin: 10px 10px 0 10px;
    }
    p {
      font-size: 22px;
      margin-top: 22px;
      color: rgb(63, 61, 61);
    }
  }
  //搜索框
  .search-container {
    display: flex;
    align-items: center;
    width: 320px;
    margin-top: 25px;
    padding: 5px;
    background-color: #f0f0f0;
    border-radius: 20px;
    .el-icon {
      color: #939393;
      margin: 0 5px 0;
    }
    .search-input::placeholder {
      color: #939393;
    }
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background-color: transparent;
      font-size: 14px;
      color: #333;
    }
    .divider {
      width: 1px;
      height: 20px;
      background-color: #dcdcdc;
    }
    .search-button {
      background: none;
      border: none;
      color: #ff8c00;
      font-size: 14px;
      cursor: pointer;
    }
  }
  //切换学校和写文章按钮
  .right {
    display: flex;
    .btn {
      margin-left: 200px;
      //头像下拉框部分
      .el-dropdown__box {
        display: flex;
        align-items: center;
        margin-top: 25px;
        margin-left: 400px;
        .el-icon {
          color: #999;
          margin-left: 10px;
        }
        &:active,
        &:focus {
          outline: none;
        }
      }
    }
  }
}
.layout-container {
  margin-top: 20px;
  height: 698px;
  box-sizing: border-box;
  // background-color: pink;
  .el-aside {
    .el-menu {
      border-right: none;
      .el-menu-item:hover {
        background-color: #f9f9f9;
      }
      .content-title {
        display: flex;
        align-items: center;
        margin: 20px 0 15px 20px;
        color: #9e9e9e; /* 灰色字体 */
        cursor: default; /* 鼠标变成默认状态 */
        font-size: 18px;
        span {
          margin-left: 5px;
        }
      }
      .el-menu-item {
        font-size: 15px;
      }
    }
  }
}
</style>
