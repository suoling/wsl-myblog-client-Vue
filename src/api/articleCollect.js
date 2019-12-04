import { request } from '../libs/request'

// 收藏列表
export const articleCollectQuery = async function ({ login_id, page_size, page_num }) {
  return await request('article/collect/query', { login_id, page_size, page_num })
}

// 收藏
export const articleCollect = async function ({ login_id, article_id }) {
  return await request('article/collect', { login_id, article_id })
}

// 取消收藏
export const articleCollectCancel = async function ({ login_id, article_id }) {
  return await request('article/collect/cancel', { login_id, article_id })
}