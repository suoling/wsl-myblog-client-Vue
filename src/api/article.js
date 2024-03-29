import { request, requestForm } from '../libs/request'

// 文章列表-指定用户
export const articleQuery = async function ({ type, login_id, page_size, page_num }) {
  return await request('article/query', { type, login_id, page_size, page_num })
}

// 文章详情
export const articleDetail = async function ({ id }) {
  return await request('article/queryDetail', { id })
}

// 文章发布
export const articlePublish = async function ({ login_id, title, md_content, html_code }) {
  return await request('article/publish', { login_id, title, md_content, html_code })
}

// 文章编辑
export const articleEdit = async function ({ id, title, md_content, html_code }) {
  return await request('article/edit', { id, title, md_content, html_code })
}

// 文章删除
export const articleDelete = async function ({ id }) {
  return await request('article/delete', { id })
}

// 图片上传
export const articleUpload = async function (type, file) {
  return await requestForm('article/upload', type, file)
}