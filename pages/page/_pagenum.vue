<template>
  <div>
    <!--调用pagingIndex组件-->
    <pagingIndex :index="index" :articleNum="articleNum" :route="'/page/'" :currentPage="currentPage"></pagingIndex>
  </div>
</template>

<script>
import pagingIndex from '@/components/pagingindex'

export default {
  name: 'pageIndex',
  components: {
    pagingIndex
  },
  head () {
    return {
      title: this.$store.state.siteinfo.title + ' - ' + this.$store.state.siteinfo.subtitle + ' - 第' + this.$route.params.pagenum + '页'
    }
  },
  async asyncData ({ $axios, params }) {
    // 获取所有文章的分页数据
    const data = await $axios.$get(`/api/index`, {
      params: {
        page: params.pagenum
      }
    })
    // 获取文章数量
    const articleNum = await $axios.$get(`/api/articlenum`)
    return { index: data.data, articleNum: articleNum.data, currentPage: Number(params.pagenum) }
  }
}
</script>