<template>
  <div class="article-detail">
    <div class="nav">
      <div class="left">
        <el-link icon="el-icon-user" :underline="false" v-if="phone">当前用户：{{ phone }}</el-link>
        <el-link icon="el-icon-user" v-if="!phone" @click="toLogin()">前往登陆</el-link>
        <el-link type="primary">文章标题：{{articleDetail.title}}</el-link>
      </div>
      <div class="right">
        <el-link icon="el-icon-back" :underline="false" @click="toList()">返回列表</el-link>
        <el-link
          icon="el-icon-edit"
          :underline="false"
          v-if="articleDetail.user_id === login_id"
          @click="toEdit()"
        >编辑</el-link>
      </div>
    </div>
    <div class="detail markdown-body">
      <mavon-editor
        class="md"
        :value="articleDetail.md_content"
        :subfield = "false"
        :defaultOpen = "'preview'"
        :toolbarsFlag = "false"
        :editable="false"
        :scrollStyle="true"
        :ishljs = "true"
      ></mavon-editor>
    </div>
    <div class="comment" ref="commentBody">
      <div class="title">评论</div>
      <div class="add-comment">
        <div class="add">
          <div class="user">{{ phone }}</div>
          <div class="reply">
            <div class="input">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入评论..."
                v-model="commentInput"
                @focus="getFocus(0)"
              >
              </el-input>
            </div>
            <div v-if="commentId === 0" class="commit">
              <el-button type="primary" @click="submitComment()">提交</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="(item, index) in commentList" :key="index">
          <div class="user">{{item.user_id}}</div>
          <div class="content">{{item.content}}</div>
          <div class="bottom">
            <div class="create-time">
              <span>{{item.create_time | datefmt('YYYY-MM-DD HH:mm:ss')}}</span>
            </div>
            <div class="opera">
              <i
                class="el-icon-thumb"
                :class="item.thumb_flag === 1 ? 'actived' : ''"
                @click.stop="thumbOpera(item, index)"
              ><span>{{ item.thumb_count }}</span></i>
              <i class="el-icon-s-comment" @click="replyHandle(item.id, item.user_id)">回复</i>
            </div>
          </div>
          <div class="reply-content" v-if="item.children && item.children.length > 0">
            <div class="reply-item" v-for="(childItem, childIndex) in item.children" :key="childIndex">
              <div class="user">{{childItem.user_id}}</div>
              <div class="content">回复{{ item.user_id }}：{{childItem.content}}</div>
              <div class="bottom">
                <div class="create-time">
                  <span>{{childItem.create_time | datefmt('YYYY-MM-DD HH:mm:ss')}}</span>
                </div>
                <div class="opera">
                  <i
                    class="el-icon-thumb"
                    :class="childItem.thumb_flag === 1 ? 'actived' : ''"
                    @click.stop="thumbOpera(childItem, index)"
                  ><span>{{ childItem.thumb_count }}</span></i>
                  <i class="el-icon-s-comment" @click="replyHandle(childItem.id, childItem.user_id)">回复</i>
                </div>
              </div>
              <div class="reply" v-if="replyId === childItem.id">
                <div class="input">
                  <el-input
                    type="textarea"
                    ref="replyInput"
                    autosize
                    :placeholder="replyplaceholder"
                    v-model="replyInput"
                    @focus="getFocus(childItem.id)"
                    autofocus
                  >
                  </el-input>
                </div>
                <div v-if="commentId === childItem.id" class="commit">
                  <el-button type="primary" @click="submitComment(item.id)">提交</el-button>
                </div>
              </div>
            </div>
          </div>
          <div class="reply" v-if="replyId === item.id">
            <div class="input">
              <el-input
                type="textarea"
                ref="replyInput"
                autosize
                :placeholder="replyplaceholder"
                v-model="replyInput"
                @focus="getFocus(item.id)"
                autofocus
              >
              </el-input>
            </div>
            <div v-if="commentId === item.id" class="commit">
              <el-button type="primary" @click="submitComment(item.id)">提交</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { articleDetail } from '../api/article';
import { commentQuery, commentAdd } from '../api/comment';
import { commentThumb, commentThumbCancel } from '../api/commentThumb';

export default {
  data () {
    return {
      articleDetail: '',
      commentList: [],
      commentInput: '',
      commentId: null,
      replyId: null,
      reply: false,
      replyInput: '',
      replyplaceholder: ''
    }
  },

  computed: {
    ...mapState('user', ['login_id', 'phone']),
  },

  methods: {
    // 查询更新评论列表
    async queryComment (article_id) {
      const res = await commentQuery({ article_id })
      console.log('res:', res)
      if (res.code === '000000') {
        this.commentList = res.commentList
      } else {
        this.$message.error(res.msg);
      }
    },

    // 去往登陆
    toLogin () {
      this.$router.push('/login')
    },

    // 返回列表页
    toList () {
      this.$router.push(`/article/list`)
    },

    // 去往文章编辑页面
    toEdit () {
      this.$router.push(`/article/edit/${this.articleDetail.id}`)
    },

    // 添加评论
    getFocus (id) {
      if (!this.login_id) {
        this.$message.error('请前往登陆');
        return
      }
      this.commentId = id
    },

    // 添加回复
    replyHandle (id, user_id) {
      if (!this.login_id) {
        this.$message.error('请前往登陆');
        return
      }
      this.replyId = id
      this.replyplaceholder = `回复${user_id}：`
    },

    // 提交评论
    async submitComment (prev_id) {
      if (!prev_id) {
        prev_id = 0
      } 
      const { id: article_id } = this.articleDetail
      const { login_id: user_id, commentInput, replyInput } = this
      let content = !prev_id ? commentInput : replyInput
      try {
        const res = await commentAdd({ user_id, article_id, prev_id, content })
        if (res.code === '000000') {
          console.log('res:', res)
          this.commentInput = ''
          this.replyInput = ''
          this.commentId = null
          this.replyId = null
          this.queryComment(article_id)
        } else {
          this.$message.error(res.msg);
        }
      } catch (err) {
        console.log('err:', err)
      }
    },

    // 点赞或者取消赞操作
    async thumbOpera (item) {
      const { id, thumb_flag } = item
      if (!this.login_id) {
        this.$message.error('请前往登陆');
        return
      }
      // 取消赞
      if (thumb_flag === 1) {
        try {
          const res = await commentThumbCancel({ user_id: this.login_id, comment_id: id })
          if (res.code === '000000') {
            this.queryComment(item.article_id)
          } else {
            this.$message.error(res.msg);
          }
        } catch(err) {
          console.log('err:', err)
        }
      }
      // 点赞
      if (thumb_flag === 0) {
        try {
          const res = await commentThumb({ user_id: this.login_id, comment_id: id  })
          if (res.code === '000000') {
            this.queryComment(item.article_id)
          } else {
            this.$message.error(res.msg);
          }
        } catch(err) {
          console.log('err:', err)
        }
      }
    },
  },

  async mounted () {
    const { id, type } = this.$route.params
    const res = await articleDetail({ id })
    if (res.code === '000000') {
      console.log('res:', res)
      this.articleDetail = res.articleDetail
      this.queryComment(id)
    } else {
      this.$message.error(res.msg);
    }
    if (type === 'comment') {
      this.$refs.commentBody.scrollIntoView()
    }
  }
}
</script>

<style lang="scss" scoped>
.article-detail {
  width: 100%;
  height: 100%;
  overflow-y: auto;

  // outline: none;
  // border-color: #409eff;
  .nav {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    padding: 10px;
    box-sizing: border-box;
    .el-link {
      margin: 0 5px;
      &:first-child {
        margin: 0 15px 0 0;
      }
    }
  }
  .detail {
    padding: 10px;
    box-sizing: border-box;
    .desc {
      padding: 10px;
    }
  }

  .comment {
    padding: 0 15px 50px;
    .reply {
      width: 80%;
      .input {
        margin-bottom: 5px;
      }
      .commit {
        text-align: right;
      }
    }
    .title {
      padding: 10px;
      margin: 10px 0;
      text-align: center;
    }
    .add-comment {
      .add {
        padding: 20px;
        background: #f5f7fa;
        border-radius: 20px;
        display: flex;
        justify-content: flex-start;
        .user {
          line-height: 36px;
          margin-right: 10px;
        }
      }
    }
    .comment-list {
      padding-left: 30px;
      .comment-item {
        padding-bottom: 10px;
        border-bottom: 1px solid #e4e7ed;
        .user {
          padding: 10px 0;
        }
        .content {

        }
        .bottom {
          padding: 10px 0;
          display: flex;
          justify-content: space-between;
          .create-time {

          }
          .opera {
            width: 150px;
            display: inline-flex;
            justify-content: space-between;
            i {
              cursor: pointer;
              &:hover {
                color: deepskyblue;
              }
              span {
                margin: 0 10px;
                color: #000;
              }
            }
            .actived {
              color: deepskyblue;
            }
          }
        }
        .reply-content {
          padding: 10px;
          background: #f5f7fa;
          .reply-item {
            border-bottom: 1px solid #e4e7ed;
          }
        }
      }
    }
  }
}
</style>