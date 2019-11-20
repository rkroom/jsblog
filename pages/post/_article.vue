<template>
  <div class="container">
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
    <!--上一页下一页-->
    <div class="nextAndPrevious">
      <nuxt-link v-if="nextAndPrevious.previous"
        :to="{ name: 'post-article', params: { article:nextAndPrevious.previous.slug },query:nextAndPrevious.query }">
        {{'上一篇：'+ nextAndPrevious.previous.title }}
      </nuxt-link><br v-if="nextAndPrevious.previous" />
      <nuxt-link v-if="nextAndPrevious.next"
        :to="{ name: 'post-article', params: { article:nextAndPrevious.next.slug },query:nextAndPrevious.query }">
        {{'下一篇：'+ nextAndPrevious.next.title }}
      </nuxt-link>
    </div>
    <!--评论功能区域-->
    <div class="comment">
      <!--提交评论功能，由表单实现-->
      <el-form ref="commentForm" :model="commentForm" label-width="80px" label-position="left" :rules="rules">
        <el-form-item prop="author" label="名称" style="width:300px">
          <el-input v-model="commentForm.author" placeholder="如何称呼您"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱地址" style="width:300px">
          <el-input v-model="commentForm.email" placeholder="邮箱地址不会被公开"></el-input>
        </el-form-item>
        <el-form-item prop="commentcontent" label="评论内容">
          <!--设定评论的输入框大小会自动更改，最小为三行，最大为五行-->
          <el-input v-model="commentForm.commentcontent" :autosize="{ minRows: 3, maxRows: 5}" type="textarea"
            placeholder="内容">
            >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="commentSubmit('commentForm')">
            提交评论
          </el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
      <div v-for="comment in comments" :key="comment.id" class="commentinfo">
        <p>作者：{{ comment.author }}</p>
        内容：<p>{{ comment.commentcontent }}</p>
        <p>时间：{{ comment.postdate | dateFormat }}</p>
      </div>
    </div>
  </div>
</template>

<script>
// 引入highlight.js及其样式
import hljs from 'highlight.js'
import 'highlight.js/styles/androidstudio.css'
// 引入html标签高亮，将markup也设置为html样式
import htmlbars from 'highlight.js/lib/languages/htmlbars'
hljs.registerLanguage('markup', htmlbars)

export default {
  name: 'Article', //组件名
  head () {
    return {
      title: this.article.title + ' - ' + this.article.categories.category + ' - ' + this.$store.state.siteinfo.title
    }
  },
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
  data () {
    return {
      commentForm: {
        author: '',
        email: '',
        commentcontent: '',
        articles: {}
      },
      // 表单验证规则
      rules: {
        author: [{ required: true, message: '必填项目' }],
        email: [{ required: true, message: '必填项目' }],
        commentcontent: [{ required: true, message: '必填项目' }]
      },
      comments: {},
      nextAndPrevious: {
        next: {
          slug: null,
          title: null
        },
        previous: {
          slug: null,
          title: null
        },
        query: null
      }
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
    const data = await $axios.$get('/api/article', { //使用get方法访问接口
      params: {
        slug: params.article  //参数 ?slug=params.article，生成的完整链接为：http://127.0.0.1:8080/api/article?slug=params.article
      }
    })
    return { article: data.data, tagsign: data.data.tags[0] ? true : false }  //返回获取到的数据，利用三元运算来判断是否存在标签
  },
  methods: {
    // 提交评论时执行的方法
    commentSubmit (commentForm) {
      this.$refs[commentForm].validate((valid) => {
        if (valid) {
          this.$axios.put(`/api/comment`, this.commentForm
          ).then((result) => {
            this.$alert(result.data.msg, '提示', {
              confirmButtonText: '确定'
            })
          }).catch(() => {
            this.$alert("提交失败，请检查输入", '提示', {
              confirmButtonText: '确定'
            })
          })
        }
      })
    }
  },
  mounted: async function () {
    // 为文章添加前一篇后一篇按钮，利用async实现同步代码
    const nextArticle = await this.$axios.$get('/api/nextarticle', {
      params: {
        id: this.article.id,
        category: this.$route.query.category
      }
    })
    const previousArticle = await this.$axios.$get('/api/previousarticle', {
      params: {
        id: this.article.id,
        category: this.$route.query.category
      }
    })
    this.nextAndPrevious.next = nextArticle.data
    this.nextAndPrevious.previous = previousArticle.data
    this.nextAndPrevious.query = { category: this.$route.query.category }
    // 将hljs注册为全局函数，highlightjs-line-numbers会在运行前检测hljs是存在
    window.hljs = hljs
    // 引入highlightjs-line-numbers
    require('highlightjs-line-numbers.js')
    //获取pre标签的元素，循环为其添加换行属性并使其高亮
    document.querySelectorAll('pre').forEach((block) => {
      // 换行
      block.style.whiteSpace = "pre-wrap"
      // 高亮
      hljs.highlightBlock(block)
      // 行号
      hljs.lineNumbersBlock(block)
    })
    // 设定提交时评论对应文章的文章ID
    this.commentForm.articles = { id: this.article.id }
    this.$axios.$get(`/api/comment`, {
      params: {
        article: this.article.id
      }
    }).then(result => { this.comments = result.data })
    // 图片可能会超出显示框区域，将图片的宽度设置为显示框宽度
    var mainWidth = document.getElementById("main").clientWidth
    document.querySelectorAll('img').forEach((element) => {
      if (element.clientWidth > mainWidth) {
        element.style.width = "100%"
      }
    })
  }
}
</script>

<style scoped>
/* 添加边框线 */
.article {
  border-style: solid;
  border-color: #ddd;
  border-width: 1px;
  padding: 5px;
  margin: 5px;
}
#articleinfo ul {
  margin: 0;
  margin-top: 5px;
  padding: 0;
  color: #999;
  text-align: left;
  display: block;
  list-style-type: none;
}
#articleinfo li {
  display: inline-block;
}
#articleinfo li:first-child {
  padding-right: 5px;
}
h2 {
  padding: 0;
  margin: 0;
}
/*为评论添加边框线*/
.comment {
  padding: 10px;
}
.commentinfo {
  border-style: solid;
  border-color: #ddd;
  border-width: 1px;
  padding: 10px;
  margin-bottom: 10px;
}
</style>

<style>
/* for block of numbers */

.hljs-ln-numbers {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  text-align: center;
  color: #ccc;
  border-right: 10px solid transparent;
  vertical-align: top;
  padding-right: 5px;
}

/* for block of code */
.hljs-ln-code {
  padding-left: 10px;
  font-size: 15px;
}
</style>