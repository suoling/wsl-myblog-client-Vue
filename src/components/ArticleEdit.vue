<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="2">标题：</el-col>
        <el-col :span="16">
          <el-input
            placeholder="请输入标题"
            v-model="title"
          ></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2">正文：</el-col>
        <el-col :span="20">
          <mavon-editor
            ref="markdown"
            toolbarsBackground="#E9EEF3"
            :ishljs="true"
            v-model="md_content"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
            @change="change"
          />
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="3">
          <el-button type="primary" @click="submitArticle()">提交</el-button>
        </el-col>
        <el-col :span="3">
          <el-button @click="cancelArticle()">取消</el-button>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';
import { articleDetail, articleUpload, articleEdit } from '../api/article';

export default {
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
      this.img_file[pos] = $file;
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

    // 文章编辑提交
    async submitArticle () {
      const { id } = this.$route.params;
      const { title, md_content, html_code } = this
      const res = await articleEdit({ id, title, md_content, html_code })
      if (res.code === '000000') {
        console.log('res:', res)
        this.$router.push('/article/list')
      } else {
        this.$message.error(res.msg);
      }
    },

    // 取消文章编辑
    cancelArticle () {
      this.$router.push('/article/list')
    },
  },

  async created () {
    const { id } = this.$route.params
    const res = await articleDetail({ id })
    console.log('res:', res)
    this.title = res.articleDetail.title
    this.md_content = res.articleDetail.md_content
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.markdown-body {
  height: 500px;
}
</style>