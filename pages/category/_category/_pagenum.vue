<template>
  <div>
    <!--使用pagingIndex组件显示分页数据-->
    <pagingIndex :index="index" :articleNum="articleNum" :route="'/category/'+categoryName+'/'"
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
  data () {
    return {
      //获取路径中的params参数category
      categoryName: this.$route.params.category
    }
  },
  async asyncData ({ $axios, params }) {
    //获取分类目录的分页数据
    const data = await $axios.$get(`/api/category`, {
      params: {
        category: params.category,
        page: params.pagenum
      }
    })
    //获取对应分类目录的文章总数
    const articleNum = await $axios.$get(`/api/categroyarticlenum`, {
      params: {
        category: params.category
      }
    })
    //将当前页数转换为数字类型
    return { index: data.data, articleNum: articleNum.data, currentPage: Number(params.pagenum) }
  }
}
</script>

<style scoped>
</style>
