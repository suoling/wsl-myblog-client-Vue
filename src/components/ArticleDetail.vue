<template>
  <div class="article-detail">
    <div class="top">
      <el-button type="primary" @click="toEdit()">编辑</el-button>
    </div>
    <div class="detail">
      <h1>{{title}}</h1>
      <div v-html="textRender(md_content)"></div>
    </div>
  </div>
</template>

<script>
import { articleDetail } from '../api/article'
import marked from 'marked'

export default {
  data () {
    return {
      id: null,
      user_id: null,
      title: '',
      md_content: ''
    }
  },

  methods: {
    // md渲染成html
    textRender (md_content) {
      return marked(md_content)
    },

    // 去往文章编辑页面
    toEdit () {
      this.$router.push(`/article/edit/${this.id}`)
    }
  },

  async mounted () {
    const { id } = this.$route.params
    console.log(id)
    const res = await articleDetail({ id })
    if (res.code === '000000') {
      console.log('res:', res)
      this.id = res.articleDetail.id
      this.user_id = res.articleDetail.user_id
      this.title = res.articleDetail.title
      this.md_content = res.articleDetail.md_content
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
  .top {
    height: 30px;
    line-height: 30px;
    text-align: right;
    padding: 10px;
    box-sizing: border-box;
    span {
      cursor: pointer;
    }
  }
  .detail {
    height: calc(100% - 30px);
    overflow: auto;
    padding: 10px;
    box-sizing: border-box;
    .desc {
      padding: 10px;
    }
  }
}
</style>