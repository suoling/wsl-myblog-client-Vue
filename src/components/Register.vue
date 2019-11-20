<template>
  <el-container>
    <el-header>Welcome to my blog，请注册</el-header>
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
          <el-form-item label="确认密码" prop="checkPass">
            <el-input prefix-icon="el-icon-lock" type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-link type="info" @click="signIn">去往登陆</el-link>
          </el-form-item>
        </el-form>
      </el-main>
      <el-aside width="25%">Aside</el-aside>
    </el-container>
    <el-footer>wangsuoling@163.com</el-footer>
  </el-container>
</template>

<script>
import { userRegister, userCheckPhone } from '../api/user'

export default {
  data() {
    var checkPhone = async (rule, value, callback) => {
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
        if (res.exist) {
          callback(new Error(res.msg));
        } else {
          callback()
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        exist: false,
        phone: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        phone: [
          { validator: checkPhone, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { phone, pass } = this.ruleForm
          const res = await userRegister({ phone, pass })
          console.log('res:', res)
          if (res.code === '000000') {
            this.$router.push('/login')
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    signIn () {
      this.$router.push('/login')
    }
  },

  created () {

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
    // line-height: 160px;
    overflow: hidden;
  }
  
  .el-container {
    height: 100%;
    &:nth-child(2) {
      height: calc(100% - 400px);
    }
  }
</style>
