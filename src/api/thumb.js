import { request } from '../libs/request'

// 查询指定文章的点赞数
export const thumbQuery = async function ({ article_id }) {
    return await request('thumb/query', { article_id } )
}

// 给指定的文章点赞
export const thumb = async function ({ user_id, article_id }) {
    return await request('thumb', { user_id, article_id })
}

// 取消给指定文章的点赞
export const thumbCancel = async function ({ user_id, article_id }) {
    return await request('thumb/cancel', { user_id, article_id })
}
