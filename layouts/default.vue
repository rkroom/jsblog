<template>
  <div>
    <el-row>
      <!--导航相关配置-->
      <el-menu class="index-menu" mode="horizontal">
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
      <!--主体内容在这个区域-->
      <nuxt />
    </el-row>
  </div>
</template>

<script>
</script>

<style>
</style>