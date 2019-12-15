<template>
  <el-container>
    <el-main>
      <el-row>
        <el-col :span="18">
          <el-input placeholder="请输入标题" v-model="title"></el-input>
        </el-col>
        <el-col :offset="1" :span="2">
          <el-button type="primary" @click="submitArticle()">
            {{type === 'update' ? '更新' : '发布'}}
          </el-button>
        </el-col>
        <el-col :offset="1" :span="2">
          <el-button @click="cancelArticle()">取消</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <mavon-editor
            ref="markdown"
            placeholder="请输入文章的内容"
            :ishljs="true"
            :boxShadow="false"
            v-model="md_content"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            @change="change"
          />
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';
import { articleDetail, articlePublish, articleUpload } from '../api/article';

export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      default: '',
    },
  },

  data () {
    return {
      title: '',
      md_content: '',
      html_code: ''
    }
  },

  computed: {
    ...mapState('user', ['login_id']),
  },

  methods: {
    // 图片上传
    async imgAdd (pos, $file) {
      console.log('pos, $file:', pos, $file)
      this.img_file[pos] = $file
      const res = await articleUpload('image', $file)
      this.$refs.markdown.$img2Url(pos, res.imgUrl);
      console.log('upload res:', res)
    },

    // 图片删除
    imgDel (pos) {
      delete this.img_file[pos]
    },

    // mavon-editor编辑区域发生变化时触发
    change (value, render) {
      // console.log(value, render)
      this.html_code = render
    },

    // 发布/更新-文章
    async submitArticle () {
      const { login_id, title, md_content, html_code } = this
      if (!title) {
        return
      }
      if (!md_content) {
        return
      }
      if (!html_code) {
        return
      }
      // console.log(login_id, title, md_content, html_code)
      const res = await articlePublish({ login_id, title, md_content, html_code })
      console.log('res:', res)
      if (res.code === '000000') {
        this.$router.push({ name: 'article/list' })
      } else {
        this.$message.error(res.msg);
      }

    },

    // 取消发布/更新-文章
    cancelArticle () {
      this.$router.push({ name: 'article/list' })
    },
  },

  async created () {
    console.log('type, id:', this.type, this.id)
    if (this.type === 'update') {
      const res = await articleDetail({ id: this.id })
      console.log('res:', res)
      this.title = res.articleDetail.title
      this.md_content = res.articleDetail.md_content
    }
  }
}
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    height: calc(100% - 60px);
    margin-bottom: 0;
    .el-col {
      height: 100%;
      .markdown-body {
        height: 100%;
      }
    }
  }
}
</style>