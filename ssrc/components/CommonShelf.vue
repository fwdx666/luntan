<script setup>
defineProps({
  title: {
    required: true,
    type: String
  }
})
</script>
<template>
  <el-card class="box-card">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <!-- <div class="extra"> -->
        <slot name="extra"></slot>
        <!-- </div> -->
      </div>
    </template>
    <slot></slot>
  </el-card>
</template>
<style lang="scss" scoped>
.box-card {
  min-height: 100%;
  box-sizing: border-box;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
