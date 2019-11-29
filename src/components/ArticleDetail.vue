<template>
  <div class="article-detail" ref="articleDetail">
    <div class="top">
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
    <div class="comment">
      这里是评论区
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { articleDetail } from '../api/article'

export default {
  data () {
    return {
      articleDetail: ''
    }
  },

  computed: {
    ...mapState('user', ['login_id', 'phone']),
  },

  methods: {
    // 返回列表页
    toList () {
      this.$router.push(`/article/list`)
    },

    // 去往文章编辑页面
    toEdit () {
      this.$router.push(`/article/edit/${this.articleDetail.id}`)
    },

    
  },

  // 评论时页面滚动条始终在底部
  updated () {
    const { type } = this.$route.params
    if (type === 'comment') {
      this.$refs.articleDetail.scrollTop = this.$refs.articleDetail.scrollHeight
    }
  },

  async mounted () {
    const { id } = this.$route.params
    const res = await articleDetail({ id })
    if (res.code === '000000') {
      console.log('res:', res)
      this.articleDetail = res.articleDetail
    } else {
      this.$message.error(res.msg);
    }
  }
}
</script>

<style lang="scss" scoped>
.article-detail {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .top {
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
    // height: calc(100% - 60px);
    // overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    .desc {
      padding: 10px;
    }
  }

  .comment {
    padding: 10px;
    margin: 10px 0;
  }
}
</style>