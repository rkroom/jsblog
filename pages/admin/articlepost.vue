<template>
  <h1>登陆测试</h1>
</template>

<script>
export default {
  name: 'articlePost',
  //使用middleware引入中间件
  middleware: 'auth'
}
</script>