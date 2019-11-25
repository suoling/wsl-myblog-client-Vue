<template>
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="2">标题：</el-col>
        <el-col :span="16">
          <el-input placeholder="请输入标题" v-model="title"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2">正文：</el-col>
        <el-col :span="20">
          <mavon-editor
            ref="markdown"
            toolbarsBackground="#E9EEF3"
            :ishljs = "true"
            v-model="md_content"
            @imgAdd="imgAdd"
            @imgDel="imgDel"
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
import { articlePublish, articleUpload } from '../api/article';

export default {
  data () {
    return {
      title: '',
      md_content: ''
    }
  },

  computed: {
    ...mapState('user', ['user_id']),
  },

  methods: {
    // 图片上传
    async imgAdd (pos, $file) {
      console.log('pos, $file:', pos, $file)
      const res = await articleUpload('image', $file)
      this.$refs.markdown.$img2Url(pos, res.imgUrl);
      console.log('upload res:', res)
    },

    // 图片删除
    imgDel () {

    },

    // 发布文章
    async submitArticle () {
      const { user_id, title, md_content } = this
      if (!title) {
        return
      }
      if (!md_content) {
        return
      }
      const res = await articlePublish({ user_id, title, md_content })
      console.log('res:', res)
      if (res.code === '000000') {
        this.$router.push('/article/list')
      } else {
        this.$message.error(res.msg);
      }

    },

    // 取消发布文章
    cancelArticle () {
      this.title = ''
      this.user_id = ''
      this.$router.push('/article/list')
    },
  },

  async created () {
    console.log('userId:', this.user_id)
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