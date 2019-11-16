<template>
  <!--采用了container布局，具体可参考：https://element.eleme.cn/#/zh-CN/component/container-->
  <el-container>
    <el-header>
      <el-row>
        <el-col style="width:190px">
          <br>
        </el-col>
        <!--具有发表文章，文章管理，评论管理和相关信息管理四个模块-->
        <el-col style="width:810px">
          <el-menu @select="handleSelect" class="el-menu-demo" mode="horizontal" background-color="#545c64"
            text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="articlepost">
              <nuxt-link :to="'/admin/articlepost'">发表文章</nuxt-link>
            </el-menu-item>
            <el-menu-item index="articlemanage">
              <nuxt-link :to="'/admin/articlemanage'">文章管理</nuxt-link>
            </el-menu-item>
            <el-menu-item index="commentmanage">
              <nuxt-link :to="'/admin/commentmanage'">评论管理</nuxt-link>
            </el-menu-item>
            <el-menu-item index="infomanage">
              <nuxt-link :to="'/admin/infomanage'">相关信息</nuxt-link>
            </el-menu-item>
            <el-menu-item>
              <nuxt-link :to="'/'">rkroom.com</nuxt-link>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </el-header>
    <!--边栏-->
    <el-row>
      <el-col style="width:200px">
        <el-aside>
          <br>
        </el-aside>
      </el-col>
      <el-col style="width:824px">
        <el-main>
          <nuxt />
        </el-main>
      </el-col>
    </el-row>
    <el-footer>
      <el-row>
        <el-col style="width:180px">
          <br>
        </el-col>
        <!--在底部添加返回首页链接-->
        <el-col style="width:810px">
          <nuxt-link :to="'/'">返回首页</nuxt-link>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  //将auth作为中间件，访问该layout即会调用auth中间件
  middleware: 'auth',
  name: 'AdminLayout',
  methods: {
    //当点击导航栏时跳转
    handleSelect (value) {
      if (value) {
        this.$router.push('/admin/' + value)
      } else {
        this.$router.push('/')
      }
    }
  }
}
</script>
