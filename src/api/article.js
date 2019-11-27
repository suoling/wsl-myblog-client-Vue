import { request, requestForm } from '../libs/request'

// 文章列表-所有
export const articleAllQuery = async function () {
  return await request('article/queryAll' )
}

// 文章列表-指定用户
export const articleQueryByUser = async function ({ user_id }) {
  return await request('article/queryByUser', { user_id })
}

// 文章详情
export const articleDetail = async function ({ id }) {
  return await request('article/queryDetail', { id })
}

// 文章发布
export const articlePublish = async function ({ user_id, title, md_content }) {
  return await request('article/publish', { user_id, title, md_content })
}

// 文章编辑
export const articleEdit = async function ({ id, title, md_content }) {
  return await request('article/edit', { id, title, md_content })
}

// 文章删除
export const articleDelete = async function ({ id }) {
  return await request('article/delete', { id })
}

// 图片上传
export const articleUpload = async function (type, file) {
  return await requestForm('article/upload', type, file)
}