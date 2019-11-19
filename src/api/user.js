import request from '../libs/request'

// 用户注册
export const userRegister = async function ({ phone, pass }) {
  return await request('users', { phone, pass })
}
// 检测手机号是否已注册
export const userCheckPhone = async function ({ phone }) {
  return await request('users/check', { phone })
}
// 登陆
export const userLogin = async function ({ phone, pass }) {
  return await request('users/login', { phone, pass })
}