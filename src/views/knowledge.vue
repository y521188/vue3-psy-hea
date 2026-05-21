<template>
    <div>
        <PageHead title="知识文章">
        <template #buttons>
          <el-button @click="dialogVisible = true" type="primary">新增</el-button>
        </template>
        </PageHead>
        <TableSearch :formItem="formItem"@search="handleSearch"></TableSearch>
        <el-table :data="tableData" style="width: 100%;margin-top: 25px;">
          <el-table-column label="文章标题" width="200">
            <template #default="scope">
            <div style="display: flex; align-items: center">
             <el-icon><timer /></el-icon>
             <span>{{ scope.row.title }}</span>
            </div>
          </template>
          </el-table-column>
          <el-table-column label="分类" width="190">
            <template #default="scope">
            <div style="display: flex; align-items: center">
             <el-icon><timer /></el-icon>
             <span>{{categoryMap[scope.row.categoryId] || '-' }}</span>
            </div>
          </template>
          </el-table-column>
          <el-table-column prop="authorName" label="作者" width="150"></el-table-column>
          <el-table-column prop="readCount" label="阅读量" width="150"></el-table-column>
          <el-table-column prop="updatedAt" label="发布时间" width="150"></el-table-column>
          <el-table-column label="操作" width="230" fixed='right'>
            <template #default="scope">
            <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button text type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          </el-table>
          <el-pagination
            layout="prev,pager,next"
            :total="pagination.total"
            :page-size="pagination.size"
            @current-change="handleChange"
          />
          <ArticleDialog v-model:modelValue="dialogVisible" :edit-id="editId" :categories="categories" @success="handleSuccess"></ArticleDialog>
    </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { categoryTree, articlePage,createArticle } from '@/api/admin'
import { onMounted, ref, reactive } from 'vue'
import ArticleDialog from '@/components/ArticleDialog.vue'
import { articleDetail, updateArticle, deleteArticle } from '@/api/admin'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const handleDelete = async (row) => {
  try {
    await deleteArticle(row.id)
    ElMessage.success('删除成功')
    handleSearch()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const editId = ref('') 
const handleEdit = (row) => {
  editId.value = row.id      // 存编辑id
  dialogVisible.value = true // 打开弹窗
}

onMounted(() => {
    categoryTree().then(data => {
        console.log(data,'分类树')
    })
})

const formItem = [
    {
      comp:'input',
        label: '文章标题',
        prop: 'title',
        placeholder: '请输入文章标题',
    }
    ,
    {
      comp:'select',
        // label: '文章分类',
        prop: 'category',
        placeholder: '请选择分类',
    },
    {
  comp: 'select',
  // label: '状态',
  prop: 'status',
  placeholder: '请选择状态',
  options: [
    {
      label: '草稿',
      value: '0'
    },
    {
      label: '已发布',
      value: '1'
    },
    {
      label: '已删除',
      value: '2'
    }
  ]
}]

const formRef = ref()
const loading = ref(false)

const categories = ref([])
const categoryMap = reactive({})
const tableData = ref([])
const searchForm = ref({
    title: '',
    category: '',
    status: ''
})

onMounted(async () => {
   const data = await categoryTree()

   categories.value = data.map(item => {
     categoryMap[item.id] = item.categoryName
     return {
       label: item.categoryName,
       value: item.id
     }
   })
   formItem[1].options = categories.value
   handleSearch()
})

const pagination = ref({
    total: 0,
    size: 10,
    currentPage: 1
})

const handleSearch = async (formData = {}) => {
    searchForm.value = { ...searchForm.value, ...formData }
    
    const params = {
        pageNum: pagination.value.currentPage,
        pageSize: pagination.value.size,
        title: searchForm.value.title || undefined,
        category: searchForm.value.category || undefined,
        status: searchForm.value.status || undefined
    }

    const { records, total, pageNum, pageSize } = await articlePage(params)
    tableData.value = records
    pagination.value.total = total
    pagination.value.currentPage = pageNum
    pagination.value.size = pageSize
}

const handleChange = (page) => {
    pagination.value.currentPage = page
    handleSearch()
}

const handleSuccess = () => {
  editId.value = ''  // 关键！关闭清空，下次打开就是新增
  handleSearch()     // 刷新列表
}
</script>
