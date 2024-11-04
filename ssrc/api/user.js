import request from '@/utils/request'

// 用户注册
export const userRegisterService = obj => request.post('/api/reg', obj)
// 用户登录
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })
//获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')
//修改用户信息
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })
//修改用户头像
export const userUpdateAvatarService = avatar =>
  request.patch('/my/update/avatar', { avatar })
//修改用户密码
export const userUpdatePasswordService = obj =>
  request.patch('/my/updatepwd', obj)
