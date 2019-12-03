import { request } from '../libs/request'

// 查询评论列表
export const commentQuery = async function ({ article_id }) {
  return await request('comment', { article_id })
}
// 新增评论
export const commentAdd = async function ({ user_id, article_id, prev_id, content }) {
  return await request('comment/add', { user_id, article_id, prev_id, content })
}

// 删除评论
export const commentDelete = async function ({ comment_id }) {
  return await request('comment/delete', { comment_id })
}