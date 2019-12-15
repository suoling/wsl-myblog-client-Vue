<template>
  <transition name="slide">
    <div class="no-fund">
      当前页面不存在，点击前往 
      <el-link type="primary" @click="$router.push('/')">文章列表页</el-link>
      <img src="@/assets/not_found.gif" />
    </div>
  </transition>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
.no-fund {
  width: 500px;
  margin: 100px auto;
  text-align: center;
}
</style>