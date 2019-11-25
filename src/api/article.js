import { request, requestForm } from '../libs/request'

// 文章发布
export const articlePublish = async function ({ user_id, title, md_content }) {
  return await request('article/publish', { user_id, title, md_content })
}

// 文章列表查询
export const articleQuery = async function ({ user_id }) {
  return await request('article/query', { user_id })
}

// 文章删除
export const articleDelete = async function ({ id, user_id }) {
  return await request('article/delete', { id, user_id })
}

// 查询指定的文章
export const articleQueryById = async function ({ id, user_id }) {
  return await request('article/queryById', { id, user_id })
}

// 文章编辑
export const articleEdit = async function ({ id, user_id, title, md_content }) {
  return await request('article/edit', { id, user_id, title, md_content })
}

// 图片上传
export const articleUpload = async function (type, file) {
  return await requestForm('article/upload', type, file)
}