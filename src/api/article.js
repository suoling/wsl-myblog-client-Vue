import request from '../libs/request'

// 文章发布
export const articlePublish = async function ({ userId, title, desc, text }) {
  return await request('article/publish', { userId, title, desc, text })
}

// 文章列表查询
export const articleQuery = async function ({ userId }) {
  return await request('article/query', { userId })
}

// 文章删除
export const articleDelete = async function ({ userId, articleId }) {
  return await request('article/delete', { userId, articleId })
}

// 查询指定的文章
export const articleQueryById = async function ({ userId, articleId }) {
  return await request('article/queryById', { userId, articleId })
}

// 图片上传
export const imgUpload = async function ({ data }) {
  return await request('article/img/upload', { data }, 'post', { 'Content-Type': 'multipart/form-data' })
}