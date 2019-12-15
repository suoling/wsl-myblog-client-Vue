<template>
  <div class="article-list">
    <div class="top">
      <div>
        <el-link icon="el-icon-user" :underline="false" v-if="phone">当前用户：{{ nickname }}</el-link>
        <el-link icon="el-icon-user" v-if="!phone" @click="toLogin()">前往登陆</el-link>
        <el-link
          :type="type === 'all' ? 'primary' : 'default'"
          :underline="false" @click="query('all')"
        >所有文章</el-link>
        <el-link
          :type="type === 'mine' ? 'primary' : 'default'"
          :underline="false" @click="query('mine')"
        >我的文章</el-link>
        <el-link
          :type="type === 'collect' ? 'primary' : 'default'"
          :underline="false" @click="query('collect')"
        >我的收藏</el-link>
      </div>
      <div>
        <el-link :underline="false">{{totalNum}}</el-link>
        <el-link icon="el-icon-document" :underline="false" @click="articlePublish">写文章</el-link>
      </div>
    </div>
    <div
      class="list"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="disabled"
    >
      <div class="item"
        v-for="(item, index) in articleList"
        :key="index"
        @click="toDetail(item.id, 'query')"
      >
        <div class="item-top">
          <div class="title">{{item.title}}</div>
          <div class="delete"
            v-if="item.user_id === login_id"
            @click.stop="deleteArticle(item.id)"
          ><i class="el-icon-delete"></i></div>
        </div>
        <div class="item-middle">{{item.description}}</div>
        <div class="item-bottom">
          <i
            class="el-icon-thumb"
            :class="item.thumb_flag === 1 ? 'actived' : ''"
            @click.stop="thumbOpera(item, index)"
          >
            <span>{{ item.thumb_count }}</span>
          </i>
          <i class="el-icon-s-comment"
            @click.stop="commentOpera(item.id, 'comment')">
            <span>{{ item.comment_count }}</span>
          </i>
          <i class="el-icon-share" @click.stop="shareOpera()"></i>
          <i
            class="el-icon-star-on"
            :class="item.collect_flag === 1 ? 'actived' : ''"
            @click.stop="starOpera(item, index)"
          ></i>
        </div>
      </div>
      <p class="no-data" v-if="loading">加载中...</p>
      <p class="no-data" v-if="noMore">没有更多的数据了...</p>
      <el-backtop target=".list"></el-backtop>
    </div>
    <sign-up
      :showFlag="registerFlag"
      v-on:toSignIn="loginFlag = true, registerFlag = false"
      v-on:signUpClose="loginFlag = false, registerFlag = false"
    />
    <sign-in
      :showFlag="loginFlag"
      v-on:toSignUp="loginFlag = false, registerFlag = true"
      v-on:signInClose="loginFlag = false, registerFlag = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import { articleQuery, articleDelete } from '../api/article';
import { articleThumb, articleThumbCancel } from '../api/articleThumb';
import { articleCollectQuery, articleCollect, articleCollectCancel } from '../api/articleCollect';

export default {
  props: {
    listFlag: {
      type: String,
      default: ''
    }
  },

  components: {
    'sign-up': SignUp,
    'sign-in': SignIn,
  },

  data () {
    return {
      type: 'all',
      articleList: [],
      page_size: 0,
      page_num: 10,
      totalNum: 0,
      loading: false,
      registerFlag: false,
      loginFlag: false
    }
  },

  computed: {
    ...mapState('user', ['login_id', 'phone', 'nickname']),

    noMore () {
      return this.page_size === Math.floor(this.totalNum / this.page_num)
    },

    disabled () {
      return this.loading || this.noMore
    }
  },

  created () {
    console.log('login_id:', this.login_id)
    this.query(this.type)
  },

  mounted () {
    console.log('listFlag:', this.listFlag)
  },

  methods: {
    // 列表加载更多
    loadMore () {
      console.log('loadMore');
      this.loading = true
      this.page_size = this.page_size + 1
      this.query(this.type)
    },

    // 去往登陆
    toLogin () {
      // this.$router.push({ path: '/login' })
      this.loginFlag = true
    },

    // 文章列表查询
    async query (type) {
      const { login_id, page_num } = this
      if (!login_id && type !== 'all') {
        // this.$message.error('请前往登陆');
        this.registerFlag = true
        return
      }
      if (type !== this.type) {
        this.page_size = 0
        this.articleList = []
      }
      let res
      if (type === 'all' || type === 'mine') {
        res = await articleQuery({ type, login_id, page_size: this.page_size, page_num })
      } else {
        res = await articleCollectQuery({ login_id, page_size: this.page_size, page_num })
      }
      console.log('res:', res)
      if (res.code === '000000') {
        this.type = type
        this.articleList = [...this.articleList, ...res.result.articleList]
        this.totalNum = res.result.totalCount
        this.loading = false
      } else {
        this.$message.error(res.msg);
      }
    },

    // 跳转至发布文章页
    articlePublish () {
      if (!this.login_id) {
        // this.$message.error('请前往登陆');
        this.registerFlag = true
        return
      }
      this.$router.push({ path: '/article/opera', query: { type: 'publish' } })
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
    toDetail (id, type) {
      this.$router.push({ name: 'article/detail', params: { id, type } })
    },

    // 点赞或者取消赞操作
    async thumbOpera (item, index) {
      const { id, thumb_flag } = item
      if (!this.login_id) {
        // this.$message.error('请前往登陆');
        this.registerFlag = true
        return
      }
      // 取消赞
      if (thumb_flag === 1) {
        try {
          const res = await articleThumbCancel({ user_id: this.login_id, article_id: id })
          if (res.code === '000000') {
            const itemNew = Object.assign({}, item, {
              thumb_flag: 0,
              thumb_count: item.thumb_count - 1
              })
            this.articleList = Object.assign([], this.articleList, { [index]: itemNew })
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
          const res = await articleThumb({ user_id: this.login_id, article_id: id  })
          if (res.code === '000000') {
            const itemNew = Object.assign({}, item, {
              thumb_flag: 1,
              thumb_count: item.thumb_count + 1
              })
            this.articleList = Object.assign([], this.articleList, { [index]: itemNew })
          } else {
            this.$message.error(res.msg);
          }
        } catch(err) {
          console.log('err:', err)
        }
      }
    },

    // 分享
    shareOpera () {
      if (!this.login_id) {
        // this.$message.error('请前往登陆');
        this.registerFlag = true
        return
      }
      console.log('share')
    },

    // 收藏或者取消收藏操作
    async starOpera (item, index) {
      const { login_id, type } = this
      const { id, collect_flag } = item
      if (!login_id) {
        // this.$message.error('请前往登陆');
        this.registerFlag = true
        return
      }
      // 取消收藏
      if (collect_flag === 1) {
        try {
          const res = await articleCollectCancel({ user_id: login_id, article_id: id })
          if (res.code === '000000') {
            const itemNew = Object.assign({}, item, { collect_flag: 0 })
            if (type === 'collect') {
              this.articleList = [...this.articleList.slice(0, index), ...this.articleList.slice(index + 1)]
            } else {
              this.articleList = Object.assign([], this.articleList, { [index]: itemNew })
            }
          } else {
            this.$message.error(res.msg);
          }
        } catch(err) {
          console.log('err:', err)
        }
      }
      // 收藏
      if (collect_flag === 0) {
        try {
          const res = await articleCollect({ user_id: login_id, article_id: id  })
          if (res.code === '000000') {
            const itemNew = Object.assign({}, item, { collect_flag: 1 })
            this.articleList = Object.assign([], this.articleList, { [index]: itemNew })
          } else {
            this.$message.error(res.msg);
          }
        } catch(err) {
          console.log('err:', err)
        }
      }
    },

    // 评论
    commentOpera (id, type) {
      if (!this.login_id) {
        // this.$message.error('请前往登陆');
        this.registerFlag = true
        return
      }
      this.$router.push(`/article/detail/${id}/${type}`)
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
    .el-link {
      margin: 0 5px;
      &:first-child {
        margin: 0 15px 0 0;
      }
    }
  }
  .list {
    height: calc(100% - 50px);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    position: relative;
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
        width: 100%;
        // display: inline-flex;
        // justify-content: space-around;
        border-bottom: 1px dashed #ccc;
        i {
          width: 25%;
          text-align: center;
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
  }
  .no-data {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
}
</style>