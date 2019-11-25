<template>
  <div>
    <!--采用表格组件显示文章,表格组件：https://element.eleme.cn/#/zh-CN/component/table-->
    <el-table :data="articleData" border style="width: 100%" :cell-style="cellStyle"
      :row-class-name="tableRowClassName">
      <el-table-column prop="title" label="标题" width="400">
      </el-table-column>
      <el-table-column label="编辑">
        <!--利用slot-scope实现自定义显示，用scope传递数据到slot，
      关于slot：https://cn.vuejs.org/v2/guide/components-slots.html-->
        <!--添加一个编辑按钮-->
        <template slot-scope="scope">
          <el-button type="text" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <!--添加文章发布状态，利用v-if实现，如果文章未发表则添加一个按钮使得文章可以被发表，
        而文章已经被发表则只显示已发表状态 -->
          <el-button v-if="scope.row.published === false" type="text" @click="handleStatus(scope.$index,scope.row)">
            {{ scope.row.publishStatus }}</el-button>
          <span v-if="scope.row.published">{{ scope.row.publishStatus }}</span>
        </template>
      </el-table-column>
      <!--添加删除按钮-->
      <el-table-column label="删除">
        <template slot-scope="scope">
          <el-button type="text" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-pagination background :hide-on-single-page="false" layout="prev, pager, next" :page-size="13"
      :total="articlesNum" @current-change="handlePaging">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'ArticleManage',
  layout: 'adminLayout',
  data () {
    return {
      cellStyle: {
        padding: 0
      }
    }
  },
  async asyncData ({ $axios }) {
    // 获取所有文章
    const articleData = await $axios.$get(`/api/admin/articles`, {
      params: {
        page: 1
      }
    })
    const articlesNum = await $axios.$get(`/api/admin/articlesnum`)
    return { articleData: articleData.data, articlesNum: articlesNum.data }
  },
  methods: {
    // 如果点击了edit按钮，则转入编辑页面
    handleEdit (index, row) {
      this.$router.push({
        // 向编辑页面传入参数，其值为该行文章的id
        path: '/admin/articleedit',
        query: {
          articleid: row.id
        }
      })
    },
    // 如果点击了状态按钮，则弹出提示，如果用户确认提示，则向后端发送发表发表请求
    // 如果用户取消发表，则弹出取消发表信息
    handleStatus (index, row) {
      this.$confirm('此操作将发表该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(`/api/admin/publisharticle`,
          {
            id: row.id
          }).then(result => {
            this.$notify({
              type: 'success',
              message: result.data.msg
            })
            // 将前端的表格组件该行中的数据进行修改
            row.published = true
            row.publishStatus = "已发表"
          })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消发表'
        })
      })
    },
    // 取消按钮
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/api/admin/article`, {
          data: {
            id: row.id
          }
        }).then(result => {
          // 从当前表格中删除该行数据
          this.articleData.splice(index, 1)
          this.$notify({
            type: 'success',
            message: result.data.msg
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 如果文章未发表，该行表格添加一个“unpublished”样式属性
    // unpublished的具体样式在<style>中进行设置
    tableRowClassName (row) {
      if (row.row.published === false) {
        return 'unpublished'
      }
    },
    handlePaging (page) {
      this.$axios.$get(`/api/admin/articles`, {
        params: {
          page: page
        }
      }).then((result) => {
        this.articleData = result.data
        this.articleData.forEach(element => {
          if (element.published === false) {
            element.publishStatus = "未发表"
          } else {
            element.publishStatus = "已发表"
          }
        })
      })
      this.$axios.$get(`/api/admin/articlesnum`).then((result) => {
        this.articlesNum = result.data
      })
    }
  },
  mounted: function () {
    // 将true/false修改为“已发表”/“未发表”
    this.articleData.forEach(element => {
      if (element.published === false) {
        element.publishStatus = "未发表"
      } else {
        element.publishStatus = "已发表"
      }
    })
  }
}
</script>

<style scoped>
.el-table >>> .unpublished {
  background: oldlace;
}
</style>
