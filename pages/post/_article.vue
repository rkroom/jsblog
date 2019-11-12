<template>
  <div class="article">
    <h2>
      <!--显示标题-->
      {{ article.title }}
    </h2>
    <div id="articleinfo">
      <ul>
        <!--获取作者-->
        <li> {{ article.users.username }} </li>
        <!--获取发布日期，并格式化，“|”是过滤符，会将前面的数据传递到后面的过滤器（filters）进行处理。-->
        <li>{{ article.publishdate | dateFormat }}</li>
        <!--获取分类目录-->
        <li>分类目录：{{ article.categories.category }}</li>
      </ul>
    </div>
    <!--显示标签-->
    <div class="tag">
      <span v-if="tagsign" style="color:#330033;margin:0">标签：</span>
      <span v-for="tag in article.tags" :key="tag.id">{{ tag.tag }}</span>
    </div>
    <!--显示正文，v-html会将标签渲染出来，在默认情况下，vue不会解析html标签以避免攻击-->
    <div v-html="article.content" />
  </div>
</template>

<script>
export default {
  name: 'Article', //组件名
  filters: {  //过滤器
    dateFormat: function (date) { //格式化日期
      const dateMat = new Date(date)
      const year = dateMat.getFullYear()
      const month = dateMat.getMonth() + 1
      const day = dateMat.getDate()
      const timeFormat = year + "/" + month + "/" + day
      return timeFormat
    }
  },
  /*
  asyncData可以在组件渲染之前获取一些数据，这里是从接口获取文章数据
  这里传递了$axios, params两个context变量的属性
  其中$axios代表axios这个http库，其用法可以参考：http://www.axios-js.com/zh-cn/docs/
  params是路由参数，在本例中就是url中post后面的那部分
  这里可以看出，url结构和pages目录下的文件结构是一样的
  当我们访问Nuxt程序时，会自动匹配pages目录下相应的文件
  在访问127.0.0.1:3000/post/文章别名时，程序会自动访问pages/post/_article.vue
  由于文章别名是一个会变化的量，所以这里在vue文件前面加了“_”，这代表其是一个动态路由
  关于nuxt路由的内容可以参考：https://zh.nuxtjs.org/guide/routing/
  */
  async asyncData ({ $axios, params }) {
    const data = await $axios.$get('http://127.0.0.1:8080/api/article', { //使用get方法访问接口
      params: {
        slug: params.article  //参数 ?slug=params.article，生成的完整链接为：http://127.0.0.1:8080/api/article?slug=params.article
      }
    })
    return { article: data, tagsign: data.tags[0] ? true : false }  //返回获取到的数据，利用三元运算来判断是否存在标签
  }
}
</script>

<style>
</style>