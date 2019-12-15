<template>
  <div class="mask" v-if="showFlag">
    <div class="content">
      <div class="close">
        <i class="el-icon-close" @click="$emit('signUpClose')"></i>
      </div>
      <el-divider class="title">注册</el-divider>
      <el-main class="main">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="账号" prop="phone">
            <el-input prefix-icon="el-icon-user" v-model.number="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input prefix-icon="el-icon-collection-tag" v-model="ruleForm.nickname"></el-input>
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
        </el-form>
        <div class="login">
          <el-link type="primary" :underline="false" @click="$emit('toSignIn')">已有账号，去登录</el-link>
        </div>
      </el-main>
    </div>
  </div>
</template>

<script>
import { userRegister, userCheckPhone } from '../api/user'

export default {
  props: {
    showFlag : {
      type: Boolean,
      default: false
    }
  },

  data() {
    let checkPhone = async (rule, value, callback) => {
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
    let requireNickname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入昵称'))
      } else {
        callback()
      }
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: { exist: false, phone: '', nickname: '', pass: '', checkPass: '' },
      rules: {
        phone: [{ validator: checkPhone, trigger: 'blur' }],
        nickname: [{ validator: requireNickname, trigger: 'blur' }],
        pass: [{ validator: validatePass, trigger: 'blur' }],
        checkPass: [{ validator: validatePass2, trigger: 'blur' }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { phone, nickname, pass } = this.ruleForm
          const res = await userRegister({ phone, nickname, pass })
          console.log('res:', res)
          if (res.code === '000000') {
            this.$emit('signUpClose')
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
  },

  created () {

  }
}
</script>

<style lang="scss" scoped>
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background: rgba(0, 0, 0, 0.57);
  .content {
    padding: 50px 0;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform-origin: 0;
    .close {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
    .el-divider__text {
      font-size: 20px;
      font-weight: bold;
    }
    .main {
      .el-form {
        padding: 0px 50px 0 0;
      }
    }
    .login {
      text-align: center;
    }
  }
}
</style>