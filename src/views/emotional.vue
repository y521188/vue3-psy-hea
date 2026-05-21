<template>
    <div>
        <PageHead title="情绪日志" />
        <TableSearch :formItem="formItem" @search="handleSearch" />
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="userId" label="用户ID" width="70" />
            <el-table-column prop="moodScore" label="会话ID" width="100" >
                <template #default="scope">
                    <el-avatar>{{ scope.row.nickname }}</el-avatar>
                </template>
            </el-table-column>
            <el-table-column prop="diaryDate" label="记录日期" width="100" />
            <el-table-column label="情绪评分" >
                <template #default="scope">
                    <el-rate :model-value="scope.row.moodScore" :max="10" disabled />
                </template>
            </el-table-column>
            <el-table-column label="生活指标" width="120" >
                <template #default="scope">
                    <div>
                        <p>
                            睡眠:{{ scope.row.sleepQuality }}
                        </p>
                        <p>
                            压力:{{ scope.row.stressLevel }}
                        </p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="emotionalTriggers" label="情绪触发因素" width="100" />
            <el-table-column prop="diaryContent" label="日记内容" width="200" />
            <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
                <el-button @click="handleDetail(scope.row)" text type="primary">详情</el-button>
                <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
            </template>
            </el-table-column>
        </el-table>
        <el-pagination 
        style="margin-top: 25px"
        @current-change="handleChange"
        :total="pagination.total"
        :page-size="pagination.size"
        :current-page="pagination.current"
        layout="prev,pager,next"
        />

        <el-dialog 
        v-model="dialogVisible"
        title="情绪日志详情" 
        :close-on-click-modal="false"
        width="800px">
        <div>
            <p>
                用户ID:{{ currentRow.userId }}
            </p>
            <p>
                会话ID:{{ currentRow.moodScore }}
            </p>
            <p>
                记录日期:{{ currentRow.diaryDate }}
            </p>
            <p>
                情绪评分: <el-rate :model-value="currentRow.moodScore" :max="10" disabled />
            </p>
            <p>
                生活指标:{{ currentRow.sleepQuality }}/{{ currentRow.stressLevel }}
            </p>
            <p>
                情绪触发因素:{{ currentRow.emotionalTriggers }}
            </p>
            <p>
                日记内容:{{ currentRow.diaryContent }}
            </p>
        </div>
        <template #footer>
            <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
        </template>
        </el-dialog>
    </div>
</template>

<script setup>
import PageHead from '@/components/PageHead.vue'
import TableSearch from '@/components/TableSearch.vue'
import { ref, onMounted } from 'vue'
import { getEmotionalPage, deleteEmotional } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const formItem = [
  { comp: 'input', prop: 'userId', label: '用户ID', placeholder: '请输入用户ID' },
  {
    comp: 'select',
    prop: 'moodScoreRange',
    // label: '情绪评分',
    placeholder: '请选择评分范围',
    options: [{
      label: '低分（1-3）',
      value: '1-3'
    }, {
      label: '中分（4-6）',
      value: '4-6'
    }, {
      label: '高分（7-10）',
      value: '7-10'
    }]
  }
]

const dialogVisible = ref(false)
const currentRow = ref({})
const handleDetail = (row) => {
  dialogVisible.value = true
  currentRow.value = row
}

const handleDelete = (row) => {
  console.log(row)
  ElMessageBox.confirm('确认删除吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deleteEmotional(row.id).then(() => {
      ElMessage.success('删除成功')
      handleSearch()
    })
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}


const tableData = ref([])

const pagination = ref({
  total: 0,
  size: 10,
  current: 1
})

const searchForm = ref({
  userId: '',
  moodScoreRange: ''
})

const handleSearch = async (formData = {}) => {
  searchForm.value = { ...searchForm.value, ...formData }
  
  const params = {
    current: pagination.value.current,
    size: pagination.value.size,
    userId: searchForm.value.userId || undefined,
    moodScoreRange: searchForm.value.moodScoreRange || undefined
  }

  const { records, total } = await getEmotionalPage(params)
  tableData.value = records
  pagination.value.total = total
}

const handleChange = (page) => {
  pagination.value.current = page
  handleSearch()
}

onMounted(() => {
  handleSearch()
})
</script>
