<template>
  <div class="article-list">
    <div class="top">
      <el-button type="primary" @click="articlePublish">写文章</el-button>
    </div>
    <div class="list">
      <div class="item"
        v-for="(item, index) in articleList"
        :key="index"
        @click="toDetail(item.user_id, item.article_id)"
      >
        <div class="item-top">
          <div class="title">{{item.title}}</div>
          <div class="delete" @click.stop="deleteArticle(item.user_id, item.article_id)">删除</div>
        </div>
        <div>{{item.description}}</div>
        <!-- style='-webkit-box-orient: vertical' -->
        <div class="content" v-highlight  v-html="textRender(item.text)"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import marked from 'marked'
import { articleQuery, articleDelete } from '../api/article'

export default {
  data () {
    return {
      articleList: []
    }
  },

  computed: {
    ...mapState('user', ['userId']),
  },

  async created () {
    console.log('userId:', this.userId)
    this.query()
  },

  methods: {
    // 文章列表查询
    async query () {
      const { userId } = this
      const res = await articleQuery({userId})
      console.log('res:', res)
      this.articleList = res.data
    },
    // markdown渲染成html
    textRender (text) {
      return marked(text)
    },
    // 跳转至发布文章页
    articlePublish () {
      this.$router.push('/article/publish')
    },
    // 删除文章
    async deleteArticle (userId, articleId) {
      const res = await articleDelete({ userId, articleId })
      console.log('res:', res)
      this.query()
    },
    // 跳转至文章详情
    toDetail (userId, articleId) {
      this.$router.push(`/article/detail/${userId}/${articleId}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.article-list {
  width: 100%;
  height: 100%;
  .top {
    height: 50px;
    line-height: 50px;
    text-align: right;
    padding: 10px;
    box-sizing: border-box;
  }
  .list {
    height: calc(100% - 50px);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    .item {
      background-color: antiquewhite;
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
      .item-top {
        display: flex;
        justify-content: space-between;
        .title {
          font-size: 20px;
          font-weight: bold;
        }
        .delete {
          cursor: pointer;
        }
      }
      .text {
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // -webkit-line-clamp: 4;
      }
    }
  }
}
</style>