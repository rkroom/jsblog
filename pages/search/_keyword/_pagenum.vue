<template>
  <div>
    <!--使用pagingIndex组件显示分页数据-->
    <pagingIndex :index="index" :articleNum="articleNum" :route="'/search/'+keywordName+'/'"
      :currentPage="currentPage">
    </pagingIndex>
    <br>
  </div>
</template>

<script>
import pagingIndex from '@/components/pagingindex'

export default {
  name: 'categoryIndex',
  components: {
    pagingIndex
  },
  head () {
    return {
      title: this.$store.state.siteinfo.title + ' - ' + this.$route.params.keyword + ' - 第' + this.$route.params.pagenum + '页'
    }
  },
  data () {
    return {
      //获取路径中的params参数category
      keywordName: this.$route.params.keyword
    }
  },
  async asyncData ({ $axios, params }) {
    //获取分类目录的分页数据
    const data = await $axios.$get(`/api/search`, {
      params: {
        keyword: params.keyword,
        page: params.pagenum
      }
    })
    //获取对应分类目录的文章总数
    const articleNum = await $axios.$get(`/api/searchnum`, {
      params: {
        keyword: params.keyword
      }
    })
    //将当前页数转换为数字类型
    return { index: data.data, articleNum: articleNum.data, currentPage: Number(params.pagenum) }
  }
}
</script>
