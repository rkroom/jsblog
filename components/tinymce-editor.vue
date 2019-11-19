<template>
  <div class="tinymce-editor">
    <!--client-only，只在客户端运行这个组件-->
    <client-only>
      <editor v-model="myValue" :init="init">
      </editor>
    </client-only>
  </div>
</template>
<script>
//tinymce的配置说明：https://www.tiny.cloud/docs/configure
//引入tinymce的vue组件
import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'TinymceEditor',
  components: {
    Editor
  },
  // 从父组件传递的参数
  props: {
    value: {
      type: String,
      default: ''
    },
    //插件
    plugins: {
      type: [String, Array],
      // Array类型的参数，采用return形式返回
      default: function () {
        return [
          'advlist autolink lists link image charmap print preview anchor',
          'searchreplace visualblocks code fullscreen',
          'table directionality template paste codesample',
          'wordcount'
        ]
      }
    },
    // 工具栏
    toolbar: {
      type: [String, Array],
      default: 'insertfile undo redo | styleselect | forecolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link image '
    },
    // 高度
    height: {
      type: Number,
      default: 600
    }
  },
  data () {
    return {
      // 初始化配置
      // tinymce的配置说明：https://www.tiny.cloud/docs/configure
      init: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.min.css',
        browser_spellcheck: true,
        contextmenu: false,
        plugins: this.plugins,
        toolbar: this.toolbar,
        browser_spellcheck: true,
        contextmenu: false,
        height: this.height,
        // 语言标签
        codesample_languages: [
          { text: 'HTML/XML', value: 'html' },
          { text: 'JavaScript', value: 'javascript' },
          { text: 'CSS', value: 'css' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'C', value: 'c' },
          { text: 'C++', value: 'cpp' },
          { text: 'bash', value: 'bash' }
        ]
      },
      myValue: this.value
    }
  },
  mounted: function () {
    // 由于tinymce只在客户端运行，所以在进入客户端后再引入相关文件
    // tinymce的插件是模块化的，需要使用某个插件都需要先引入某个插件
    if (process.client) {
      let tinymce = require('tinymce/tinymce')
      require('tinymce/skins/content/default/content.css')
      require('tinymce/themes/silver/')
      require('tinymce/plugins/table')
      require('tinymce/plugins/advlist')
      require('tinymce/plugins/wordcount')
      require('tinymce/plugins/autolink')
      require('tinymce/plugins/charmap')
      require('tinymce/plugins/codesample')
      require('tinymce/plugins/fullscreen')
      require('tinymce/plugins/link')
      require('tinymce/plugins/paste')
      require('tinymce/plugins/print')
      require('tinymce/plugins/searchreplace')
      require('tinymce/plugins/template')
      require('tinymce/plugins/visualblocks')
      require('tinymce/plugins/anchor')
      require('tinymce/plugins/code')
      require('tinymce/plugins/directionality')
      require('tinymce/plugins/image')
      require('tinymce/plugins/lists')
      require('tinymce/plugins/preview')
      require('tinymce/plugins/spellchecker')
      require('tinymce/plugins/table')
    }
  },
  // 监视器组件，当值发生改变会触发相应的方法
  // 将tinymce的内容传递到父组件
  watch: {
    value (newValue) {
      this.myValue = newValue
    },
    myValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
