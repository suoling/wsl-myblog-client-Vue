<template>
  <div class="article-list">
    <div class="top">
      <el-button type="primary" @click="articlePublish">写文章</el-button>
    </div>
    <div class="list">
      <div class="item"
        v-for="(item, index) in articleList"
        :key="index"
        @click="toDetail(item.id, item.user_id)"
      >
        <div class="item-top">
          <div class="title">{{item.title}}</div>
          <div class="delete" @click.stop="deleteArticle(item.id, item.user_id)">删除</div>
        </div>
        <div>{{item.description}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { articleQuery, articleDelete } from '../api/article';

export default {
  data () {
    return {
      articleList: []
    }
  },

  computed: {
    ...mapState('user', ['user_id']),
  },

  async created () {
    console.log('user_id:', this.user_id)
    this.query()
  },

  methods: {
    // 文章列表查询
    async query () {
      const { user_id } = this
      const res = await articleQuery({ user_id })
      console.log('res:', res)
      if (res.code === '000000') {
        this.articleList = Object.assign(res.articleList)
      } else {
        this.$message.error(res.msg);
      }
    },

    // 跳转至发布文章页
    articlePublish () {
      this.$router.push('/article/publish')
    },

    // 文章删除
    async deleteArticle (id, user_id) {
      const res = await articleDelete({ id, user_id })
      console.log('res:', res)
      if (res.code === '000000') {
        this.$message({
          type: 'success',
          message: res.msg
        });
        this.query()
      } else {
        this.$message.error(res.msg);
      }
    },

    // 跳转至文章详情
    toDetail (id, user_id) {
      this.$router.push(`/article/detail/${id}/${user_id}`)
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
    }
  }
}
</style>