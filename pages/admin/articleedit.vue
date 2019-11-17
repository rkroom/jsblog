<template>
  <!--编辑文章页面和发表文章的页面大部分是相同的-->
  <el-row :gutter="20">
    <el-form ref="articleFrom" label-width="80px" :rules="rules" :model="article" label-position="top">
      <h2>标题</h2>
      <el-form-item prop="title" :width="10">
        <el-input v-model="article.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item prop="content">
        <TinymceEditor v-model="article.content"></TinymceEditor>
      </el-form-item>
      <el-col :span="6">
        <el-form-item prop="slug">
          <el-input v-model="article.slug" placeholder="请输入别名"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="categories">
          <el-select @change="categoryChange" v-model="article.categories.id" placeholder="请选择分类">
            <el-option v-for="item in categoriesList" :key="item.value" :label="item.category" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="published">
          <el-select v-model="article.published">
            <el-option label="发布" :value="true">
            </el-option>
            <el-option label="存为草稿" :value="false">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-checkbox-group @change="tagsChange" v-model="checkList" v-for="tag in tagsList" :key="tag.id"
          style="float: left; margin: 5px;">
          <el-checkbox :label="tag.tag"></el-checkbox>
        </el-checkbox-group>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-button @click="articleSubmit('articleFrom')">
            提交
          </el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
import TinymceEditor from '@/components/tinymce-editor'

export default {
  name: 'ArticleEdit',
  layout: 'adminLayout',
  components: {
    TinymceEditor
  },
  data () {
    return {
      rules: {
        title: [{ required: true, message: '必须输入' }],
        content: [{ required: true, message: '必须输入' }],
        slug: [{ required: true, message: '必须输入' }],
        categories: [{ required: true, message: '必须输入' }],
        published: [{ required: true, message: '必须输入' }]
      },
      categoriesObject: {},
      tagsObject: {},
      checkList: []
    }
  },
  async asyncData ({ $axios, route }) {
    // 获取分类目录列表和标签列表
    // route.query.articleid参数由跳转来源页面提供
    const article = await $axios.$get(`/api/admin/article`, {
      params: {
        articleid: route.query.articleid
      }
    })
    const categoriesList = await $axios.$get(`/api/admin/categories`)
    const tagsList = await $axios.$get(`/api/admin/tags`)
    return { article: article.data, categoriesList: categoriesList.data, tagsList: tagsList.data }
  },
  methods: {
    articleSubmit (articleFrom) {
      this.$refs[articleFrom].validate((valid) => {
        if (valid) {
          this.$axios.post(`/api/admin/article`, this.article).then((result) => {
            this.$notify({
              type: 'success',
              message: result.data.msg
            })
          })
        }
      })
    },
    categoryChange (value) {
      this.article.categories.category = this.categoriesObject[value]
    },
    tagsChange (value) {
      let temp = []
      value.forEach(element => {
        temp.push({ id: this.tagsObject[element], tag: element })
      })
      this.article.tags = temp
    }
  },
  mounted: function () {
    this.categoriesList.forEach(element => {
      this.categoriesObject[element.id] = element.category
    })
    this.tagsList.forEach(element => {
      this.tagsObject[element.tag] = element.id
    })
    this.article.tags.forEach(element => {
      this.checkList.push(element.tag)
    })
  }
}
</script>
