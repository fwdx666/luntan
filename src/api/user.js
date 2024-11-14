import request from '@/utils/request'
//用户注册
export const userRegisterService = obj => request.post('/api/reg', obj)
//用户登录
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })
//获取用户信息
export const userInfoService = () => request.get('/my/userinfo')
