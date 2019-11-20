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
          <mavon-editor toolbarsBackground="#E9EEF3" v-model="text" @save="saveHandle" />
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
import { articleWrite } from '../api/article'
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
    saveHandle () {
      console.log('text:', this.text)
    },
    async submitArticle () {
      const { userId, title, desc, text } = this
      const res = await articleWrite({ userId, title, desc, text })
      console.log('res:', res)
    },
    cancelArticle () {
      console.log('cancel')
    }
  },

  created () {
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