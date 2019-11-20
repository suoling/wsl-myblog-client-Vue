import request from '../libs/request'

// 写文章
export const articlePublish = async function ({ userId, title, desc, text }) {
  return await request('article/publish', { userId, title, desc, text })
}

// 文章列表查询
export const articleQuery = async function ({ userId }) {
  return await request('article/query', { userId })
}

// 图片上传
export const imgUpload = async function ({ data }) {
  return await request('article/img/upload', { data }, 'post', { 'Content-Type': 'multipart/form-data' })
}