<template>
  <div class="article-list">
    <div class="top">
      <el-button type="primary" @click="articlePublish">写文章</el-button>
    </div>
    <div class="list">
      <el-tabs tab-position="top" style="height: 200px;" @tab-click="handleClick">
        <el-tab-pane label="所有" name="0">
          <div class="list" v-if="articleAllList && articleAllList.length">
            <div class="item"
                 v-for="(item, index) in articleAllList"
                 :key="index"
                 @click="toDetail(item.id)"
            >
              <div class="item-top">
                <div class="title">{{item.title}}</div>
                <div class="delete"
                  v-if="item.user_id === user_id"
                  @click.stop="deleteArticle(item.id)"
                >删除</div>
              </div>
              <div class="item-middle">{{item.description}}</div>
              <div class="item-bottom">
                <i class="el-icon-thumb"
                   :class="active ? 'actived' : ''"
                   @click.stop="thumb()">
                  <span>{{ item.thumbNum }}</span>
                </i>
              </div>
            </div>
          </div>
          <div class="no-data" v-else>
            该用户暂未发布文章，请点击右上角写文章去发布吧
          </div>
        </el-tab-pane>
        <el-tab-pane label="我的" name="1">
          <div class="list" v-if="articleList && articleList.length">
            <div class="item"
                 v-for="(item, index) in articleList"
                 :key="index"
                 @click="toDetail(item.id)"
            >
              <div class="item-top">
                <div class="title">{{item.title}}</div>
                <div class="delete" @click.stop="deleteArticle(item.id)">删除</div>
              </div>
              <div class="item-middle">{{item.description}}</div>
              <div class="item-bottom">
                <i class="el-icon-thumb"
                   :class="active ? 'actived' : ''"
                   @click.stop="thumb()">
                  <span>111</span>
                </i>
              </div>
            </div>
          </div>
          <div class="no-data" v-else>
            该用户暂未发布文章，请点击右上角写文章去发布吧
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { articleAllQuery, articleQueryByUser, articleDelete } from '../api/article';
import { thumbQuery } from '../api/thumb'

export default {
  data () {
    return {
      tabIndex: 0,
      articleAllList: [],
      articleList: [],
      active: true
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
      const { user_id, tabIndex } = this
      if (tabIndex === 0) {
        const res = await articleAllQuery()
        console.log('res:', res)
        if (res.code === '000000') {
          this.articleAllList = Object.assign(res.articleAllList)
        } else {
          this.$message.error(res.msg);
        }
      } else if (tabIndex === 1) {
        const res = await articleQueryByUser({ user_id })
        console.log('res:', res)
        if (res.code === '000000') {
          this.articleList = Object.assign(res.articleList)
        } else {
          this.$message.error(res.msg);
        }
      }
    },

    // tab切换
    handleClick (pane) {
      console.log(pane.name)
      this.tabIndex = Number(pane.name)
      this.query()
    },

    // 获取点赞数
    async thumbRender (item, article_id) {
      const res = await thumbQuery({ article_id })
      if (res.code === '000000') {
        return res.thumbNum || 0
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
        this.query()
      } else {
        this.$message.error(res.msg);
      }
    },

    // 跳转至文章详情
    toDetail (id) {
      this.$router.push(`/article/detail/${id}`)
    },

    // 点赞
    thumb () {

    }

  }
}
</script>

<style lang="scss" scoped>
.article-list {
  width: 100%;
  height: 100%;
  .top {
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