<template>
  <div class="article-detail">
    <div class="top">
      <div class="title">
        <el-button>当前用户{{ phone }}</el-button>
        <el-button>文章标题{{articleDetail.title}}</el-button>
        
      </div>
      <div>
        <el-button @click="toList()">返回列表</el-button>
        <el-button type="primary" v-if="articleDetail.user_id === login_id" @click="toEdit()">编辑</el-button>
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
  padding-bottom: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    padding: 10px;
    box-sizing: border-box;
    .title {
      font-size: 30px;
      font-weight: bold;
    }
    span {
      cursor: pointer;
    }
  }
  .detail {
    height: calc(100% - 60px);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    .desc {
      padding: 10px;
    }
  }
}
</style>