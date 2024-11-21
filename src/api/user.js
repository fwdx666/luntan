import request from '@/utils/request'
//用户注册
export const userRegisterService = obj => request.post('/api/reg', obj)
//用户登录
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })
//获取用户信息
export const userInfoService = () => request.get('/my/userinfo')
//更新用户昵称和邮箱信息
export const userUpdateInfoService = (id, nickname, email) =>
  request.put('/my/userinfo', { id, nickname, email })
//更新用户密码
export const userUpdatePasswordService = obj =>
  request.patch('/my/updatepwd', obj)
//更新用户头像
export const userUpdateAvatarService = avatar =>
  request.patch('/my/update/avatar', { avatar })
