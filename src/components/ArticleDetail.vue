<template>
  <div class="article-detail">
    <div class="top"><span @click="toEdit()">编辑</span></div>
    <div class="detail">
      <h1>{{title}}</h1>
      <div v-html="textRender(md_content)"></div>
    </div>
  </div>
</template>

<script>
import { articleQueryById } from '../api/article'
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
      this.$router.push(`/article/edit/${this.id}/${this.user_id}`)
    }
  },

  async mounted () {
    const { id, user_id } = this.$route.params
    console.log(id, user_id)
    const res = await articleQueryById({ id, user_id })
    if (res.code === '000000') {
      console.log('res:', res)
      this.data = Object.assign({}, res.articleDetail)
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