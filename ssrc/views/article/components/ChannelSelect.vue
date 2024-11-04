<script setup>
import { artArticleClassifyService } from '@/api/article.js'
import { ref } from 'vue'
const optionList = ref([])
const emit = defineEmits(['update:selectValue'])
defineProps({
  selectValue: {
    type: String
  }
})
const getChannelSelect = async () => {
  const re = await artArticleClassifyService()
  optionList.value = re.data.data
}
getChannelSelect()
</script>
<template>
  <el-select
    :modelValue="selectValue"
    @update:modelValue="emit('update:selectValue', $event)"
    style="width: 220px"
  >
    <el-option
      v-for="item in optionList"
      :key="item.id"
      :value="item.id"
      :label="item.cate_name"
    ></el-option>
  </el-select>
</template>
