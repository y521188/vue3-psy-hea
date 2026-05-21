<template>
  <div class="navbar">
    <div class="flex-box">
      <el-button @click="toggleCollapse">
        <el-icon><Expand /></el-icon>
      </el-button>
      <p class="page-title">{{ route.meta.title }}</p>
    </div>
    <div class="flex-box">
      <el-dropdown @command="handleCommand">
        <div class="flex-box">
          <el-avatar :src="user.avatar" size="medium" />
          <p class="user-name">用户</p>
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item type="danger" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown, Expand } from '@element-plus/icons-vue'
import { useAdminStore } from '@/stores/admin'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus' // 这里修复：加上 ElMessageBox
import { logout } from '@/api/admin'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

// 折叠侧边栏
const toggleCollapse = () => {
  adminStore.toggleCollapse()
  console.log('当前状态：', adminStore.isCollapse)
}

// 用户信息
const user = ref({
  name: '张三',
  avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
})

// 下拉菜单命令
const handleCommand = async (command) => {
  console.log(command)
  
  if (command === 'logout') {
    try {
      // 弹出确认框
      await ElMessageBox.confirm('确定退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      // 调用退出接口
      await logout()

      // 清理所有登录状态
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      // adminStore.logout() // 如果仓库有清理方法，一定要调用！

      // 提示 + 跳转
      ElMessage.success('退出成功')
      router.push('/auth/login')
      
    } catch (err) {
      // 用户取消 或 接口报错
      if (err !== 'cancel') {
        ElMessage.error('退出失败')
        console.error(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  border-bottom: 1px solid #e5e7eb;
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .page-title {
    margin-left: 20px;
    font-size: 26px;
    font-weight: bold;
    color: #1f2937;
  }
}
</style>