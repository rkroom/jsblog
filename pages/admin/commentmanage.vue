<template>
  <!--评论的管理和文章的管理差不多，都是通过表格组件来实现的-->
  <el-table :data="commentData" :fit="true" border style="width: 100%" :cell-style="cellStyle"
    :row-class-name="tableRowClassName">
    <el-table-column prop="author" label="作者" width="230">
    </el-table-column>
    <el-table-column prop="email" label="邮箱" width="230">
    </el-table-column>
    <client-only>
      <el-table-column prop="postdate" :formatter="dateFormat" label="日期" width="95">
      </el-table-column>
    </client-only>
    <el-table-column prop="title" label="文章" width="400">
    </el-table-column>
    <el-table-column prop="commentcontent" label="内容" width="400">
    </el-table-column>
    <el-table-column label="审核">
      <template slot-scope="scope">
        <el-button v-if="scope.row.published === false" type="text" @click="handleStatus(scope.$index,scope.row)">
          {{ scope.row.publishStatus }}</el-button>
        <span v-if="scope.row.published">{{ scope.row.publishStatus }}</span>
      </template>
    </el-table-column>
    <!--删除按钮固定悬浮在右侧-->
    <el-table-column fixed="right" label="删除">
      <template slot-scope="scope">
        <el-button type="text" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'commentManage',
  layout: 'adminLayout',
  data () {
    return {
      commentData: [],
      cellStyle: {
        padding: 0
      }
    }
  },
  async asyncData ({ $axios }) {
    // 获取所有评论
    const commentData = await $axios.$get(`/api/admin/allcomment`)
    return { commentData: commentData.data }
  },
  methods: {
    // 为未发表评论添加样式
    tableRowClassName (row) {
      if (row.row.published === false) {
        return 'unpublished'
      }
    },
    // 发表评论
    handleStatus (index, row) {
      this.$confirm('此操作将展示该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(`/api/admin/publishcomment`, {
          id: row.id
        }).then((result) => {
          row.published = true
          row.publishStatus = "已通过"
          this.$notify({
            type: 'success',
            message: result.data.msg
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消发表'
        })
      })
    },
    // 删除评论
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.delete(`/api/admin/comment`, {
          data: {
            id: row.id
          }
        }).then(result => {
          this.commentData.splice(index, 1)
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
    // 日期格式化
    dateFormat (row, column, cellValue, index) {
      const daterc = row[column.property]
      if (daterc != null) {
        const dateMat = new Date(parseInt(daterc.toString().replace("/Date(", "").replace(")/", ""), 10))
        const year = dateMat.getFullYear()
        const month = dateMat.getMonth() + 1
        const day = dateMat.getDate()
        const timeFormat = year + "/" + month + "/" + day
        return timeFormat
      }
    }
  },
  mounted: function () {
    // 将true/false修改为“已发表”/“未发表”
    this.commentData.forEach(element => {
      if (element.published === false) {
        element.publishStatus = "未通过"
      } else {
        element.publishStatus = "已通过"
      }
    })
  }
}
</script>

<style scoped>
/* 未发表评论样式 */
.el-table >>> .unpublished {
  background: oldlace;
}
</style>
