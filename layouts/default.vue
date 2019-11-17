<template>
  <div>
    <!--<el-row>和<el-col>组件可以用以实现布局，row为行划分组件，col为列划分组件，通过row和col
      的组合可以实现自由的布局-->
    <el-row>
      <!--导航相关配置-->
      <!--@select为导航菜单激活时的回调，当点击导航菜单，就会调用<script>中的handleSelect函数
        更内内容参考：https://element.eleme.cn/#/zh-CN/component/menu-->
      <el-menu class="index-menu" mode="horizontal" @select="handleSelect">
        <el-menu-item index="index">
          <!--首页-->
          <nuxt-link :to="'/'">rkroom.com</nuxt-link>
        </el-menu-item>
        <!--分类目录-->
        <el-menu-item index="spring boot2">
          <!--主体内容在这个区域-->
          <nuxt-link :to="'/category/spring boot2/1'">spring boot2</nuxt-link>
        </el-menu-item>
      </el-menu>
    </el-row>
    <el-row class="blank">
      <!--element-ui支持响应式布局，可以根据不同的窗口大小显示相应的布局-->
      <!--左侧空白区域
        class="hidden-sm-and-down"，添加这个类，element-ui会使得该元素在窗口为768像素以下隐藏
        :xs=0，当窗口为768像素时，宽度为0（el-row的0/24）
        :sm="1"，当窗大于等于768像素时，宽度为1（el-row的1/24）
        :md="2"，当窗口大于等于992像素时，宽度为2
        :lg="4"，当窗口大于1200像素时，宽度为4
      -->
      <!-- xs	<768px ，sm	≥768px ，md	≥992px ，lg	≥1200px ，xl	≥1920px-->
      <el-col class="hidden-sm-and-down" :xs="0" :sm="1" :md="2" :lg="4">
        <br>
      </el-col>
      <!--主体区域响应式区域-->
      <el-col :xs="24" :sm="18" :md="18" :lg="13" :xl="10" class="main" id="main">
        <!--主体内容在这个区域-->
        <nuxt />
      </el-col>
      <!--侧边栏响应式区域-->
      <el-col :xs="0" :sm="2" :md="2" class="rside">
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  methods: {
    handleSelect (value) { //处理导航栏选中事件，value为el-menu-item中设置的index的值
      if (value === 'index') {
        this.$router.push('/') //this.$router.push，vue路由跳转，如果值为“index”，则跳转到首页
      } else {
        this.$router.push('/category/' + value + '/1')
      }
    }
  }
}
</script>

<style>
/* 未访问的链接 */
a:link {
  color: black;
}
/* 已访问的链接 */
a:visited {
  color: black;
}
/* 鼠标移动到链接上 */
.a:hover {
  color: #0800ff;
}
/* 选定的链接 */
a:active {
  color: #0800ff;
}
/* 主内容区域，有边框，边框为1px */
.main {
  flex-wrap: wrap;
  flex-direction: row;
  border: 1px #ddd;
  border-style: none solid none none;
}
/* 左侧空白区域 */
.blank {
  flex-wrap: wrap;
  flex-direction: row;
}
/*侧边栏*/
.rside {
  border: 1px #ddd;
  border-style: none none none none;
  padding: 10px;
}
/*取消链接下划线*/
a {
  text-decoration: none;
}
</style>