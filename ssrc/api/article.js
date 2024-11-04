import request from '@/utils/request'
//获取文章分类
export const artArticleClassifyService = () => request.get('/my/cate/list')
//添加文章分类
export const artArticleClassifyAddService = data =>
  request.post('/my/cate/add', data)
//编辑文章分类
export const artArticleClassifyEditService = obj =>
  request.put('/my/cate/info', obj)
//删除文章分类
export const artArticleClassifyDeleteService = id =>
  request.delete(`/my/cate/del`, { params: { id } })
//获取文章列表
export const artArticleListService = obj =>
  request.get('/my/article/list', { params: obj })
//添加文章
export const artArticleAddService = obj => request.post('/my/article/add', obj)
//获取文章详情
export const artArticleDetailService = id =>
  request.get(`/my/article/info`, { params: { id } })
//编辑文章
export const artArticleEditService = obj => request.put('/my/article/info', obj)
//删除文章
export const artArticleDeleteService = id =>
  request.delete(`/my/article/info`, { params: { id } })
