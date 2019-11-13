<template>
  <div>
    <!--
      获取过来的分页数据应该是一个数组，遍历该数组，并且循环生成文章的摘要
    -->
    <div id="abstract" v-for="abstract in index" :key="abstract.slug">
      <!--获取标题，并且为其添加链接，这里使用了-->
      <h2>
        <nuxt-link :to="{ name: 'post-article', params: { article:abstract.slug } }">
          {{ abstract.title }}</nuxt-link>
      </h2>
      <div id="articleinfo">
        <ul>
          <!--获取作者-->
          <li> {{ abstract.username }} </li>
          <!--获取发布日期-->
          <li>{{ abstract.publishdate  }}</li>
          <!--获取分类目录-->
          <li>分类目录：{{ abstract.category }}</li>
        </ul>
      </div>
      <!--获取文章摘要-->
      {{ abstract.content }}...
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  async asyncData ({ $axios }) {
    const data = await $axios.$get(`http://127.0.0.1:8080/api/index`, {
      params: {
        page: 1
      }
    })
    return { index: data.data }
  }
}
</script>

<style scoped>
</style>