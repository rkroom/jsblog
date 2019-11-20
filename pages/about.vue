<template>
  <div v-html="article.content" />
</template>

<script>
export default {
  name: 'about',
  async asyncData ({ $axios }) {
    // 这里设计的about是一篇别名为"about"的文章，可以在后台编辑相关信息
    const data = await $axios.$get('/api/article', {
      params: {
        slug: 'about'
      }
    })
    return { article: data.data }
  }
}
</script>