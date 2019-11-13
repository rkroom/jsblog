<template>
  <div>
    <!--使用组件的方式为<组件名></组件名>，通过“:参数”=数据的方法进行传值，这些值将会传递到子组件
    总体文章分页路径为“/page/”-->
    <pagingIndex :index="index" :articleNum="articleNum" :route="'/page/'"></pagingIndex>
  </div>
</template>

<script>
import pagingIndex from '@/components/pagingindex' //引入pagingIndex组件，@代表根目录

export default {
  name: 'Index',
  components: {  //注册组件，如果不注册，组件无法使用
    pagingIndex
  },
  data () {
    return {
    }
  },
  async asyncData ({ $axios }) {
    // 获取首页数据
    const data = await $axios.$get(`/api/index`, {
      params: {
        page: 1
      }
    })
    // 获取文章数量
    const articleNum = await $axios.$get(`/api/articleNum`)
    return { index: data.data, articleNum: articleNum.data }
  }
}
</script>

<style scoped>
</style>