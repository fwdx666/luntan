<script setup>
import { ref } from 'vue'
const hotItems = ref([
  {
    rank: 1,
    title: '当了一学期的大爷,当几天孙子又何妨',
    heat: '234万',
    heatIcon: true
  },
  { rank: 2, title: '到我这个年纪你们就都懂了', heat: '198万' },
  { rank: 3, title: '悬溺一响纯爱登场', heat: '150万' },
  { rank: 4, title: '这个世界到底谁在幸福', heat: '102万' },
  { rank: 5, title: '你的眼泪和屋檐上的脏水没有区别', heat: '85万' },
  { rank: 6, title: '随便一套,笑死全校', heat: '70万' },
  { rank: 7, title: '想你的一便又一便', heat: '65万' },
  { rank: 8, title: '已驾崩勿扰', heat: '56万' },
  { rank: 9, title: '死丫头把你腿毛燎了', heat: '44万' },
  { rank: 10, title: '谈赛博恋爱逗电子蛐蛐', heat: '25万' }
])
const morehot = () => {
  console.log('查看更多热度榜')
}
</script>
<template>
  <el-menu class="hot-list-container" :default-active="$route.path" router>
    <div class="hot-list-title">热度榜</div>
    <el-menu-item
      index="/login"
      v-for="item in hotItems"
      :key="item.rank"
      class="hot-item"
    >
      <span class="rank">{{ item.rank }}</span>
      <span :class="['title', item.heatIcon && 'heat-icon']">{{
        item.title
      }}</span>
      <span class="heat">{{ item.heat }}</span>
    </el-menu-item>
    <a href="#" class="more-link" @click="morehot()">查看更多热度榜</a>
  </el-menu>
</template>
<style lang="scss" scoped>
.hot-list-container {
  position: fixed;
  top: 120px; /* 你可以调整这个值来控制离页面顶部的距离 */
  right: 73px; /* 你可以调整这个值来控制离页面右侧的距离 */
  z-index: 1000; /* 确保它在其他内容之上 */
  width: 320px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.hot-list-title {
  padding: 15px;
  font-weight: bold;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #eaeaea;
}
.hot-item {
  height: 44px;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  align-items: center;
  transition: background-color 0.3s;
  cursor: pointer;
}
.hot-item:hover {
  background-color: #f9f9f9;
}
.hot-item .rank {
  font-weight: bold;
  font-size: 16px;
  color: #ff5a5f;
  margin-right: 10px;
}
.hot-item .title {
  flex-grow: 1;
  font-size: 14px;
  color: #333;
}
.hot-item .title.heat-icon {
  color: #ff5a5f;
}
.hot-item .heat {
  font-size: 14px;
  color: #999;
}
.more-link {
  display: block;
  text-align: center;
  padding: 10px 0;
  color: #ff5a5f;
  text-decoration: none;
  font-size: 14px;
  border-top: 1px solid #eaeaea;
}
.more-link:hover {
  background-color: #f9f9f9;
}
</style>
