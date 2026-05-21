<template>
  <el-dialog
    title="文章详情"
    v-model="dialogVisible"
    width="50%"
    @close="handleClose"
  >
  <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="formData.title" placeholder="请输入文章标题" maxlength="200" show-word-limit clearable></el-input>
    </el-form-item>
    <el-form-item label="文章分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择分类">
        <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章摘要" prop="summary">
      <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要" maxlength="1000" show-word-limit :rows="4" clearable></el-input>
    </el-form-item>
    <el-form-item label="文章标签" prop="tags">
      <el-select v-model="formData.tagArray" placeholder="请输入标签" multiple filterable allow-create style="width: 100%;">
        <el-option v-for="tag in commonTags" :key="tag" :label="tag" :value="tag"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="图片上传" prop="coverImage">
      <div class="cover-upload">
        <el-upload
          class="avatar-uploader"
          action="#"
          :before-upload="beforeUpload"
          :http-request="handleUploadRequest"
          :show-file-list="false"
          accept="image/*"
        >
          <div v-if="!imageUrl" class="cover-placeholder">
            <p>点击上传封面</p>
          </div>
          <img v-else :src="imageUrl" alt="封面" class="cover-image">
      </el-upload>
        <div v-if="imageUrl" class="cover-remove">
          <el-button type="danger" size="mini" @click="handleRemove">移除封面</el-button>
        </div>
      </div>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <el-input type="textarea" v-model="formData.content" placeholder="请输入文章内容" maxlength="10000" show-word-limit :rows="10" clearable></el-input>
    </el-form-item>
  </el-form>
  <template #footer>
  <el-button @click="handleClose">取消</el-button>
  <el-button @click="handleSubmit" :loading="loading">
    {{ editId ? '保存修改' : '创建文章' }}
  </el-button>
</template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { createArticle } from '@/api/admin'
import { ElMessage } from 'element-plus'
import { uploadFile, articleDetail, updateArticle } from '@/api/admin'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  editId: {  // 新增
    type: String,
    default: ''
  }
})

watch(() => props.modelValue, async (val) => {
  if (val) {
    // 打开弹窗时，先清空！
    formData.title = ''
    formData.content = ''
    formData.coverImage = ''
    formData.summary = ''
    formData.categoryId = 1
    formData.tagArray = []
    formData.id = ''
    imageUrl.value = ''

    // 有 editId → 编辑回显
    if (props.editId) {
      const data = await articleDetail(props.editId)
      
      formData.title = data.title
      formData.content = data.content
      formData.categoryId = data.categoryId
      formData.summary = data.summary
      formData.tagArray = data.tags ? data.tags.split(',') : []
      formData.coverImage = data.coverImage
      formData.id = data.id

      imageUrl.value = data.coverImage 
        ? 'http://159.75.169.224:1235/' + data.coverImage
        : ''
    }
  }
})

const emit = defineEmits(['update:modelValue','success'])

const dialogVisible = computed({
    get() {
        return props.modelValue
    },
    set(val) {
        emit('update:modelValue', val)
    }
})

const formData = reactive({
    "title": "",
    "coverImage": "string",
    "content": "",
    "categoryId": 1,
    "summary": "",
    "tagArray": [],
    "id": "string"
})

const rules = reactive({
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' }
    ],
    categoryId: [
        { required: true, message: '请选择分类', trigger: 'change' }
    ],
})

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    const submitData = {
      ...formData,
      tags: formData.tagArray.join(',')
    }
    delete submitData.tagArray

    try {
      // 关键判断
      if (props.editId) {
        // 编辑：调用更新接口
        await updateArticle(submitData)
      } else {
        // 新增：原来的接口
        await createArticle(submitData)
      }

      ElMessage.success(props.editId ? '修改成功' : '创建成功')
      emit('success')
      handleClose()
    } catch (err) {
      ElMessage.error('操作失败')
    } finally {
      loading.value = false
    }
  })
}
const loading = ref(false)
const formRef = ref(null)


const handleClose = () => {
  emit('update:modelValue', false)

  // 可选：关闭清空表单
  formData.title = ''
  formData.content = ''
  formData.coverImage = ''
  formData.summary = ''
  formData.tagArray = []
  formData.categoryId = 1
  imageUrl.value = ''
  formRef.value?.clearValidate()
}

const imageUrl = ref('')
const beforeUpload = (file) => {
  // 针对上传的文件进行校验
  console.log(file)
  const isImage = file.type.startsWith('image/')
  const isLt5MB = file.size / 1024 / 1024 < 5
  if (!isImage) {
    ElMessage.error('上传封面图片，请选择图片文件')
    return false
  }
  if (!isLt5MB) {
    ElMessage.error('上传封面图片大小不能超过5MB')
    return false
  }
  return isImage
}

const handleUploadRequest = async ({ file }) => {
  const businessId = crypto.randomUUID()
  const fileRes = await uploadFile(file, {
    businessId: businessId
  })
  console.log('上传响应完整数据:', fileRes)
  
  const filePath = fileRes?.data || fileRes?.filePath || fileRes?.url || fileRes?.path || ''
  console.log('提取的文件路径:', filePath)
  
  // 移除开头的斜杠，避免双斜杠
  const cleanPath = filePath.replace(/^\/+/, '')
  imageUrl.value = `http://159.75.169.224:1235/` + cleanPath
  formData.coverImage = filePath
}



const commonTags = [
  '情绪管理', '焦虑', '抑郁', '压力', '睡眠', 
  '冥想', '正念', '放松', '心理健康', '自我成长',
  '人际关系', '工作压力', '学习方法', '生活技巧'
]

const handleRemove = () => {
  imageUrl.value = ''
  formData.coverImage = ''
}
</script>

<style scoped lang="scss">
.cover-placeholder {
  width: 200px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8b949e;
  background: #f6f8fa;
}
.cover-image {
  width: 200px;
  height: 120px;
  display: block;
}
</style>