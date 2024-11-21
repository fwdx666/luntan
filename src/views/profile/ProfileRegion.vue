<script setup></script>
<template>
  <router-view v-slot="{ Component }"
    ><keep-alive><component :is="Component" /></keep-alive
  ></router-view>
</template>

<style lang="scss" scoped></style>
