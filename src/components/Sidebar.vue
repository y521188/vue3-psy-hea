<template>
  <el-aside>
    <el-menu
        default-active="dashboard"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        :collapse="isCollapse"
      >
        <div class="brand" >
          <el-image style="width: 50px; height: 50px;" :src="logo" alt="logo"/>
          <div class="info-card">
            <h1 class="brand-title">心理健康AI助手</h1>
            <p class="brand-subtitle">管理后台</p>
          </div>
        </div>
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path">
          <el-icon><component :is="item.meta.icon" /></el-icon>
          <span>{{ item.meta.title }}</span>  
        </el-menu-item>
        
      </el-menu>
  </el-aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { computed } from 'vue'

const router = useRouter()

const logo = new URL('@/assets/images/机器人.png', import.meta.url).href

const adminStore = useAdminStore()
const isCollapse = adminStore.isCollapse.value

const menuItems = computed(() => {
  const backRoute = router.options.routes.find(r => r.path === '/back')
  return backRoute?.children || []
})

const handleOpen = (key) => {
  console.log(key)
}

const handleClose = (key) => {
  console.log(key)
}

const handleSelect = (key, keyPath) => {
  console.log('Selected menu:', key)
  router.push(`/back/${key}`)
}

// console.log(router.options.routes[0].children)
</script>

<style lang="scss" scoped>
.brand {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;
  border-bottom: 1px solid #e4e7ed;
}
.brand-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #1f2937;
}
.brand-subtitle {
  font-size: 14px;
  color: #909399;
}

:deep(.el-aside) {
  overflow: hidden;
}

:deep(.el-menu) {
  overflow: hidden;
  height: 100%;
}
</style>
