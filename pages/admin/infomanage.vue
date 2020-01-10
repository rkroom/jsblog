<template>
  <div>
    <!--分类目录区域，利用el-row和el-col将其划分为左右两侧，左侧显示已存在分类目录，右侧添加目录-->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table :data="categoriesData" border style="width: 100%">
          <el-table-column prop="category" label="分类">
          </el-table-column>
          <!--首页显示状态-->
          <el-table-column label="首页显示">
            <template slot-scope="scope">
              <el-button type="text" @click="handleStatus(scope.$index,scope.row)">{{ scope.row.index}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-form ref="categoryFrom" :model="categoryFrom" :rules="categoryRules">
          <el-form-item label="添加分类：" prop="addCategory">
            <el-input v-model="categoryFrom.addCategory" placeholder="请输入分类"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="categorySubmit('categoryFrom')">
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br>
    <!--标签区域-->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table :data="tagsData" border style="width: 100%">
          <el-table-column prop="tag" label="标签">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <el-form ref="tagFrom" :model="tagFrom" :rules="tagRules">
          <el-form-item label="添加标签：" prop="addTag">
            <el-input v-model="tagFrom.addTag" placeholder="请输入标签"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="tagSubmit('tagFrom')">
              提交
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <br>
    <!--网站属性区域-->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-table :data="siteInfo" border style="width: 100%">
          <el-table-column prop="attribute" label="属性">
          </el-table-column>
          <el-table-column label="内容">
            <template slot-scope="scope">
              <el-button type="text" @click="handleSiteInfo(scope.$index,scope.row)">{{ scope.row.value}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <br>
    <!--密码修改区域-->
    <el-form ref="passwordFrom" :model="passwd" :rules="passwdRules" label-width="100px" label-position="left">
      <el-form-item label="新密码：" prop="password">
        <el-input style="width:200px" v-model="passwd.password" placeholder="请输入密码" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="checkPassword">
        <el-input style="width:200px" v-model="passwd.checkPassword" placeholder="请确认密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="passwordSubmit('passwordFrom')">
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入cookie管理工具
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'infoManage',
  layout: 'adminLayout',
  data () {
    //自定义校验规则，此处校验两处密码是否一直
    var checkPasswd = (rule, value, callback) => {
      if (value === this.passwd.password) {
        return callback()
      } else {
        return callback(new Error('两次输入的密码不一致'))
      }
    }
    return {
      categoryFrom: {
        addCategory: null,
      },
      tagFrom: {
        addTag: null,
      },
      passwd: {
        password: null,
        checkPassword: null,
      },
      categoryRules: {
        addCategory: [{ required: true, message: '必须输入' }]
      },
      tagRules: {
        addTag: [{ required: true, message: '必须输入' }]
      },
      passwdRules: {
        // 密码输入验证，其验证规则为自定义的checkPasswd
        password: [{ required: true, message: '必须输入' }],
        checkPassword: [{ validator: checkPasswd, trigger: 'blur' }]
      }
    }
  },
  async asyncData ({ $axios }) {
    // 获取分类目录和标签参数
    const categoriesData = await $axios.$get(`/api/admin/categories`)
    const tagsData = await $axios.$get(`/api/admin/tags`)
    const siteInfo = await $axios.$get('/api/admin/site')
    return { categoriesData: categoriesData.data, tagsData: tagsData.data, siteInfo: siteInfo.data }
  },
  methods: {
    // 添加分类目录
    categorySubmit (categoryFrom) {
      this.$refs[categoryFrom].validate((valid) => {
        if (valid) {
          this.$confirm('此操作将添加一个分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.put(`/api/admin/category`, {
              category: this.categoryFrom.addCategory
            }).then((result) => {
              this.categoriesData.push({ category: this.categoryFrom.addCategory, index: result.data.data.index, id: result.data.data.id })
              this.$notify({
                type: 'success',
                message: result.data.msg
              })
            })
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消添加'
            })
          })
        }
      })
    },
    // 添加标签
    tagSubmit (tagFrom) {
      this.$refs[tagFrom].validate((valid) => {
        if (valid) {
          this.$confirm('此操作将添加一个标签, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.put(`/api/admin/tag`, {
              tag: this.tagFrom.addTag
            }).then((result) => {
              this.tagsData.push({ tag: this.tagFrom.addTag })
              this.$notify({
                type: 'success',
                message: result.data.msg
              })
            })
          }).catch(() => {
            this.$notify({
              type: 'info',
              message: '已取消添加'
            })
          })
        }
      })
    },
    // 修改密码
    passwordSubmit (passwordFrom) {
      this.$refs[passwordFrom].validate((valid) => {
        if (valid) {
          this.$confirm('此操作将更改密码，成功后，您需要重新登陆, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$axios.post(`/api/admin/password`, {
              id: this.$store.state.token.userid,
              password: this.passwd.password
            }).then(() => {
              // 清楚cookie和store，并跳转到登录页
              Cookie.remove('Authorization')
              const token = {
                Authorization: null,
                username: null,
                userid: null
              }
              this.$store.commit('setToken', token)
              this.$router.push('/login')
            })
          })
        }
      })
    },
    // 修改首页显示状态
    handleStatus (index, row) {
      this.$confirm('更改首页显示状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.$post(`/api/admin/indexcategory`, {
          id: row.id,
          status: !row.index
        }).then((result) => {
          this.$store.commit('setCategories', result.data)
          row.index = !row.index
          this.$notify({
            type: 'success',
            message: result.msg
          })
        })
      }).catch(() => {
        this.$notify({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    // 修改网站属性
    handleSiteInfo (index, row) {
      this.$prompt('请输入内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: function (value) {
          if (value) {
            return true
          } else {
            return '必须输入内容。'
          }
        }
      }).then(({ value }) => {
        this.$axios.post(`/api/admin/site`, {
          'id': row.id,
          'value': value
        }).then((result) => {
          // 如果修改的网站属性为公开属性，则修改store中对应的值
          if (row.authorization === false) {
            /* 在js中，复制复杂数据类型（Object）可能只是复制的对象地址，而非其数据
               这样的情况下，修改复制后的对象，也会同样影响到原对象，而vuex要求对数据的修改都通过其定义的修改方法来进行
               所以需要通过assign()方法来克隆一份数据，修改这份数据之后提交数据。
            */
            let site = {}
            Object.assign(site, this.$store.state.siteinfo)
            site[row.attribute] = value
            this.$store.commit('setSiteinfo', site)
          }
          row.value = value
          this.$notify({
            type: 'success',
            message: row.attribute + ' 修改为: ' + value
          })
        }
        )
      }).catch(() => {
        this.$notify({
          message: '已取消修改'
        })
      })
    }
  }

}
</script>
