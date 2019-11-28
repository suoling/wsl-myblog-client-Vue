<template>
  <div class="article-list">
    <div class="top">
      <div>
        <el-button type="primary" @click="query('all')">所有</el-button>
        <el-button type="primary" @click="query('mine')">我的</el-button>
      </div>
      <div>
        <el-button type="primary" @click="articlePublish">写文章</el-button>
      </div>
    </div>
    <div class="list" v-if="articleList && articleList.length">
      <div class="item"
            v-for="(item, index) in articleList"
            :key="index"
            @click="toDetail(item.id)"
      >
        <div class="item-top">
          <div class="title">{{item.title}}</div>
          <div class="delete"
            v-if="item.user_id === login_id"
            @click.stop="deleteArticle(item.id)"
          >删除</div>
        </div>
        <div class="item-middle">{{item.description}}</div>
        <div class="item-bottom">
          <i class="el-icon-thumb"
              :class="item.thumb_flag === 1 ? 'actived' : ''"
              @click.stop="thumbOpera(item.id, item.user_id, item.thumb_flag)">
            <span>{{ item.thumb_count }}</span>
          </i>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>
      该用户暂未发布文章，请点击右上角写文章去发布吧
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { articleQuery, articleDelete } from '../api/article';
import { thumb, thumbCancel } from '../api/thumb';

export default {
  data () {
    return {
      type: 'all',
      articleList: []
    }
  },

  computed: {
    ...mapState('user', ['login_id']),
  },

  async created () {
    console.log('login_id:', this.login_id)
    this.query(this.type)
  },

  methods: {
    // 文章列表查询
    async query (type) {
      const { login_id } = this
      const res = await articleQuery({ type, login_id })
      console.log('res:', res)
      if (res.code === '000000') {
        this.type = type
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
    async deleteArticle (id) {
      const res = await articleDelete({ id })
      console.log('res:', res)
      if (res.code === '000000') {
        this.$message({
          type: 'success',
          message: res.msg
        });
        this.query(this.type)
      } else {
        this.$message.error(res.msg);
      }
    },

    // 跳转至文章详情
    toDetail (id) {
      this.$router.push(`/article/detail/${id}`)
    },

    // 点赞或者取消赞操作
    async thumbOpera (article_id, user_id, thumb_flag) {
      if (!this.login_id) {
        this.$message.error('请完成登陆');
        return
      }
      try {
        let res
        if (thumb_flag === 1) {
          res = await thumbCancel({ user_id: this.login_id, article_id })
        } else if (thumb_flag === 0) {
          res = await thumb({ user_id: this.login_id, article_id })
        }
        if (res.code === '000000') {
          this.query(this.type)
        }
      } catch (err) {
        console.log('err:', err)
      }
    }

  },
}
</script>

<style lang="scss" scoped>
.article-list {
  width: 100%;
  height: 100%;
  .top {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
  }
  .list {
    height: calc(100% - 50px);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    .item {
      padding: 10px;
      box-sizing: border-box;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      .item-top {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px dashed #ccc;
        .title {
          font-size: 20px;
          font-weight: bold;
        }
        .delete {
          cursor: pointer;
        }
      }
      .item-middle {
        padding: 10px 0;
        border-bottom: 1px dashed #ccc;
      }
      .item-bottom {
        padding: 10px 0;
        i {
          cursor: pointer;
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
  }
  .no-data {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
}
</style>