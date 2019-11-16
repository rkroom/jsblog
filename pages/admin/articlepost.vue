<template>
  <!--发表文章-->
  <el-row :gutter="20">
    <el-form ref="articleFrom" label-width="80px" :rules="rules" :model="article" label-position="top">
      <h2>标题</h2>
      <el-form-item prop="title">
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
          <!--选择分类目录，当分类目录发生该表时调用categoryChange方法-->
          <el-select v-model="article.categories.id" @change="categoryChange" placeholder="请选择分类">
            <!--分类目录信息是一个列表，循环生成列表信息-->
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
        <!--标签信息，一篇文章可以有多个标签，所以这里采用了checkbox组件：https://element.eleme.cn/#/zh-CN/component/checkbox-->
        <!--将标签显示再同一行-->
        <!--传递给服务器的标签属性是列表内嵌数组的形式-->
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
  name: 'ArticlePost',
  layout: 'adminLayout',
  components: {
    TinymceEditor
  },
  /*
    layout: function (context) {
      return 'adminLayout'
    }
  */
  data () {
    return {
      article: {
        id: null,
        users: {
          id: this.$store.state.token.userid,
          username: this.$store.state.token.username
        },
        title: '',
        content: '',
        slug: '',
        categories: {
          id: '',
          category: ''
        },
        published: false,
        tags: []
      },
      // 表单验证规则，避免用户错误输入,Form-Item 的 prop 属性为需校验的字段名
      // 具体参考：https://element.eleme.cn/#/zh-CN/component/form
      rules: {
        title: [{ required: true, message: '必须输入' }],
        content: [{ required: true, message: '必须输入' }],
        slug: [{ required: true, message: '必须输入' }],
        categories: [{ required: true, message: '必须输入' }],
        published: [{ required: true, message: '必须输入' }]
      },
      checkList: [],
      categoriesObject: {},
      tagsObject: {}

    }
  },
  async asyncData ({ $axios }) {
    // 获取分类目录和标签
    const categoriesList = await $axios.$get(`/api/admin/categories`)
    const tagsList = await $axios.$get(`/api/admin/tags`)
    return { categoriesList: categoriesList.data, tagsList: tagsList.data }
  },
  methods: {
    articleSubmit (articleFrom) {
      // this.$refs[articleFrom].validate 表示启用验证规则
      this.$refs[articleFrom].validate((valid) => {
        // 验证成功才执行相应代码
        if (valid) {
          if (this.article.id === null) {
            //如果本地不存在文章id则执行put方法
            this.$axios.$put(`/api/admin/article`, this.article).then((result) => {
              // 新建文章成功后服务端会返回文章ID，这里将文章ID设置为本地参数，以区分是否是创建文章并实现在提交完
              // 文章后继续修改该篇文章，如果不加以区分，每一次提交文章都是提交了一篇新文章
              this.article.id = result.data.id
              this.$notify({
                // 显示成功提示信息
                message: result.msg,
                type: 'success'
              })
            }).catch(result => {
              // 如果发生错误，则显示错误提示信息
              this.$notify({
                message: "error",
                type: 'error'
              })
            })
          } else {
            // 如果本地存在文章ID，则执行Post方法
            this.$axios.$post(`/api/admin/article`, this.article).then((result) => {
              // 更新文章成功后服务端会返回文章ID
              this.$notify({
                // 显示成功提示信息
                message: result.msg,
                type: 'success'
              })
            }).catch(result => {
              // 如果发生错误，则显示错误提示信息
              this.$notify({
                message: "error",
                type: 'error'
              })
            })
          }
        }
      })
    },
    categoryChange (value) {
      // 当选择了不同的分类目录则修改article模型中分类目录数据
      this.article.categories.category = this.categoriesObject[value]
    },
    tagsChange (value) {
      // 当选择了不同的标签则修改article模型中标签数据
      let temp = []
      value.forEach(element => {
        temp.push({ id: this.tagsObject[element], tag: element })
      })
      this.article.tags = temp
    }
  },
  mounted: function () {
    /*
    将服务端传递来的 
    [
        {
            "id": 1,
            "category": "spring boot2"
        }
    ]
    形式的数据修改
    {spring boot2:2}
    形式，即将数组转换为键值对，方便程序使用
    */
    this.categoriesList.forEach(element => {
      this.categoriesObject[element.id] = element.category
    })
    this.tagsList.forEach(element => {
      this.tagsObject[element.tag] = element.id
    })
  }
}
</script>