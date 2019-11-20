import request from '../libs/request'

// 写文章
export const articleWrite = async function ({ userId, title, desc, text }) {
  return await request('article/write', { userId, title, desc, text })
}