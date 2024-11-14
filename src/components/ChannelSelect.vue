<script setup>
import { artArticleClassifyService } from '@/api/article'
import { ref } from 'vue'
const ChannelList = ref([])
const emit = defineEmits(['update:cateId'])
defineProps({
  cateId: {
    type: String
  }
})
const getChannelList = async () => {
  const re = await artArticleClassifyService()
  ChannelList.value = re.data.data
}
getChannelList()
</script>
<template>
  <el-select
    :modelValue="cateId"
    @update:modelValue="emit('update:cateId', $event)"
    ><el-option
      v-for="item in ChannelList"
      :key="item.id"
      :value="item.id"
      :label="item.cate_name"
    ></el-option
  ></el-select>
</template>
