<!--
分页显示组件，本组件获取分页数据，并且将其显示出来
-->
<template>
  <div>
    <!--
      传递过来的分页数据应该是一个数组，对遍历该数组，并且循环生成文章的摘要
    -->
    <div id="abstract" v-for="abstract in index" :key="abstract.slug">
      <!--获取标题，并且为其添加链接-->
      <h2>
        <!--这里采用了利用名称跳转的方式，关于命名的生成规则可以参考https://zh.nuxtjs.org/guide/routing
        这里有params和query两个Vue路由中很重要的参数，简单理解来说，params是URL路径中的参数，而query则是URL
        中“?”后面的部分，例如 https://rkroom.com/post/how-to-user-git?category=spring%20boot2中
        how-to-user-git为params，category=spring%20boot2为query-->
        <!--如果在分类目录下，直接为链接添加分类目录参数-->
        <nuxt-link :to="{ name: 'post-article', params: { article:abstract.slug },query:query }">
          {{ abstract.title }}</nuxt-link>
      </h2>
      <div id="articleinfo">
        <ul>
          <!--获取作者-->
          <li> {{ abstract.username }} </li>
          <!--获取发布日期，并且利用过滤器进行格式化-->
          <li>{{ abstract.publishdate | dateFormat }}</li>
          <!--获取分类目录-->
          <li>分类目录：{{ abstract.category }}</li>
        </ul>
      </div>
      <!--获取文章摘要-->
      {{ abstract.content }}...
    </div>
    <br />
    <!--
    分页按钮区域，element自带了一个分页组件，但是其跳转一般是通过js进行的，这里我希望通过<a>标签来完成这项功能
    因此自己实现了一个分页
    -->
    <el-row type="flex" class="paging">
      <!--前一页按钮，获取当前页，并且生成前一页的连接，如果当前为第一页则不显示该按钮
      结合nuxt-link与el-button实现-->
      <nuxt-link v-if="(currentPage - 1) > 0" :to="route + (currentPage - 1)">
        <el-button size="mini" icon="el-icon-arrow-left"></el-button>
      </nuxt-link>
      <!--
        分页按钮，获取文章总数，并根据每页显示数量计算总页数，然后循环生成按钮
        并且为每一个按钮添加一个(page-页码)的ID
        -->
      <div v-for="page in Math.ceil(articleNum/10)" :key="page">
        <nuxt-link :to="route + page">
          <el-button size="mini" :id="'page-'+ page"><strong>
              {{ page }}
            </strong></el-button>
        </nuxt-link>
      </div>
      <!--后一页按钮，获取当前页，并且生成后一页的连接，如果当前为最后一页则不显示该按钮-->
      <nuxt-link v-if="(currentPage + 1) <= Math.ceil(articleNum/10)" :to="route + (currentPage + 1)">
        <el-button size="mini" icon="el-icon-arrow-right"></el-button>
      </nuxt-link>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'pagingIndex',
  /*
  获取父组件传递的值
  也可以不提供默认值和数据类型，例如下面的index:null。
  */
  props: {
    index: null,
    articleNum: {  // 文章数量
      type: Number, //需要Number类型
      default: 10  //默认值为10，如果父组件没有传递这个参数，则采用默认值
    },
    route: { //路径
      type: String,
      default: '/page/' //默认为page
    },
    currentPage: { //当前页
      type: Number,
      default: 1 //默认为1
    }
  },
  filters: { //过滤器，可以接受一个值，然后经过一定的处理，再返回
    /*
    将时间格式化成 年，月，日的形式
    */
    dateFormat: function (date) {
      const dateMat = new Date(date)
      const year = dateMat.getFullYear()
      const month = dateMat.getMonth() + 1
      const day = dateMat.getDate()
      const timeFormat = year + '/' + month + '/' + day
      return timeFormat
    }
  },
  data () {
    return {
      query: null
    }
  },
  /*created生命周期
  此时可以执行一些初始化操作
  */
  created: function () {
    /*
    判断当前的路径，如果是在分类目录之下，则对文章url添加参数
    */
    if (this.route !== '/page/') {
      this.query = { category: this.route.split("/")[2] }
    }
  },
  /*
  mounted生命周期，此时模板已经渲染，初始化页面完成后进行一些操作
  在Nuxt中，此时已经可以操作客户端的各种方法了，比如window，document
  */
  mounted: function () {
    /*
  根据当前页码的ID获取元素，并且为其添加一个el-button--primary属性，在Element-ui中，添加这个属性的按钮会显示出主按钮的样式
    */
    if (document.getElementById('page-1')) {
      document.getElementById('page-' + this.currentPage).classList.add('el-button--primary')
    }
  }
}
</script>

<style scoped>
</style>