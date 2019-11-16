<template>
  <div>
    <br />
    <!--这里利用element-ui的from组件实现，更多内容参考https://element.eleme.cn/#/zh-CN/component/form-->
    <el-form ref="loginFrom" :model="loginFrom" label-width="80px">
      <el-form-item label="用户名" width="100">
        <el-input v-model="loginFrom.username" style="width:150px" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" width="100">
        <el-input v-model="loginFrom.password" style="width:150px" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loginSubmit('loginForm')">
          登陆
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入cookie，process.client为客户端，即在客户端才执行
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'Login',
  data () {
    // 需要提供一个初始化数据模型以避免错误
    return {
      loginFrom: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    loginSubmit () {
      //利用Post方法，将表单数据传递到后端
      this.$axios.$post(`/api/login`, this.loginFrom).then(
        (result) => {
          // 如果正确的返回了token，则将token写入cookie
          if (result.code === 200) {
            //解析token数据，获取过期时间
            const info = JSON.parse(Base64.decode(result.data.split('.')[1]))
            // 设置token并指定有效期
            Cookie.set('Authorization', result.data, {
              expires: new Date(info.exp * 1000)
            })
            // 设置要提交到store中的数据
            const token = {
              Authorization: result.data,
              username: info.username,
              userid: info.id
            }
            //用this.$store即可访问store中的数据和使用store中的方法
            // 更新store中的数据
            this.$store.commit('setToken', token)
            // 登陆成功则跳转到admin/articlepost
            this.$router.push('admin/articlepost')
          }
        })
    }
  }
}
</script>