import request from '@/utils/request'
//获取文章列表
export const artArticleListService = obj =>
  request.get('/my/article/list', { params: obj })
export const artArticleClassifyService = () => request.get('/my/cate/list')
//发布文章
export const artArticlePublishService = obj =>
  request.post('/my/article/add', obj)
//获取文章详情
export const artArticleDetailsService = id =>
  request.get('/my/article/info', { params: { id } })
//编辑文章
export const artArticleEditService = obj => request.put('/my/article/info', obj)
//删除文章
export const artArticleDeleteService = id =>
  request.delete('/my/article/info', { params: { id } })
