<template>
  <el-container>
    <el-header>Welcome to my blog，请登陆</el-header>
    <el-container>
      <el-aside width="25%">Aside</el-aside>
      <el-main>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="账号" prop="phone">
            <el-input prefix-icon="el-icon-user" v-model.number="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pass">
            <el-input prefix-icon="el-icon-key" type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">登陆</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="info" :underline="false" @click="signUp">去往注册</el-link>
          </el-form-item>
        </el-form>
      </el-main>
      <el-aside width="25%">Aside</el-aside>
    </el-container>
    <el-footer>wangsuoling@163.com</el-footer>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { userCheckPhone } from '../api/user'

export default {
  data() {
    const checkPhone = async (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }
      if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'));
      } else if (!(/^1\d{10}$/.test(value))) {
          callback(new Error('手机号格式输入错误'));
      } else {
        const phone = value
        const res = await userCheckPhone({ phone })
        if (!res.exist) {
          callback(new Error(res.msg));
        } else {
          callback()
        }
      }
    };
    const checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: { phone: '', pass: '' },
      rules: {
        phone: [ { validator: checkPhone, trigger: 'blur' } ],
        pass: [ { validator: checkPass, trigger: 'blur' } ]
      }
    };
  },

  computed: {
    ...mapState('user', ['login_id']),

  },

  watch: {
    login_id (val) {
      if (val) {
        this.$router.push('/article/list')
      }
    }
  },

  methods: {
    ...mapActions('user', ['login']),
  
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { phone, pass } = this.ruleForm
          const res = await this.login({ phone, pass })
          if (res.code === '999999') {
            this.$message.error(res.msg);
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    signUp () {
      this.$router.push('/')
    },
  },

  created () {
    console.log('login_id:', this.login_id)
  }
}
</script>

<style lang="scss" scoped>
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    height: 200px !important;
    line-height: 200px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  .el-container {
    height: 100%;
    &:nth-child(2) {
      height: calc(100% - 400px);
    }
  }
</style>
