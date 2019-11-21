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
        <el-col :span="2">描述：</el-col>
        <el-col :span="16">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入描述" v-model="desc"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="2">正文：</el-col>
        <el-col :span="20">
          <mavon-editor
            toolbarsBackground="#E9EEF3"
            v-model="text"
            @save="saveHandle"
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
import { articlePublish, imgUpload } from '../api/article'
export default {
  data () {
    return {
      title: '',
      desc: '',
      text: ''
    }
  },

  computed: {
    ...mapState('user', ['userId']),
  },

  methods: {
  
    // md正文保存
    saveHandle () {
      console.log('text:', this.text)
    },
  
    // 发布文章
    async submitArticle () {
      const { userId, title, desc, text } = this
      const res = await articlePublish({ userId, title, desc, text })
      console.log('res:', res)
    },
  
    // 取消发布文章
    cancelArticle () {
      this.title = ''
      this.desc = '',
      this.text = ''
      console.log('cancel')
    },
  
    // 图片上传
    async imgAdd (pos, $file) {
      console.log('pos, $file:', pos, $file)
      // 第一步.将图片上传到服务器.
      const data = new FormData();
      data.append('image', $file);
      console.log('data:', data)
      const res = await imgUpload({ data })
      console.log('imgUpload:', res)
    },

    // 图片删除
    imgDel () {

    }
  },

  async created () {
    console.log('userId:', this.userId)
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