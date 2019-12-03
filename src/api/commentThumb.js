import { request } from '../libs/request'

// 给指定的评论点赞
export const commentThumb = async function ({ user_id, comment_id }) {
    return await request('comment/thumb', { user_id, comment_id })
}

// 取消给指定评论的点赞
export const commentThumbCancel = async function ({ user_id, comment_id }) {
    return await request('comment/thumb/cancel', { user_id, comment_id })
}
