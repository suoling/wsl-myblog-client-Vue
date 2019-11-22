<template>
  <div class="article-detail">
    <div class="top"><span @click="toEdit(data.user_id, data.article_id)">编辑</span></div>
    <div class="detail">
      <h1>{{data.title}}</h1>
      <div class="desc">{{data.description}}</div>
      <div v-html="textRender(data.text)"></div>
    </div>
  </div>
</template>

<script>
import { articleQueryById } from '../api/article'
import marked from 'marked'

export default {
  data () {
    return {
      data: {
        title: '',
        description: '',
        text: ''
      }
    }
  },

  methods: {
    textRender (text) {
      return marked(text)
    },
    // 去往文章编辑页面
    toEdit (userId, articleId) {
      this.$router.push(`/article/edit/${userId}/${articleId}`)
    }
  },

  async mounted () {
    const { userId, articleId } = this.$route.params
    console.log(userId, articleId)
    const res = await articleQueryById({ userId, articleId })
    console.log('res:', res)
    this.data = Object.assign(this.data, res.data[0])
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