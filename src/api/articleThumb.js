import { request } from '../libs/request'

// 给指定的文章点赞
export const articleThumb = async function ({ user_id, article_id }) {
    return await request('article/thumb', { user_id, article_id })
}

// 取消给指定文章的点赞
export const articleThumbCancel = async function ({ user_id, article_id }) {
    return await request('article/thumb/cancel', { user_id, article_id })
}
