<template>
  <div class="hero-page">
    <div class="hero-container">
      <!-- 左侧文本区域 -->
      <div class="text-content">
        <h1 class="main-title">
          一次温暖的对话
          <br />
          <span class="highlight">化孤独为慰藉</span>
        </h1>
        <p class="desc-text">
          每个深夜，每个焦虑的时刻，我们都在这里。不必独自承受，让心与心的连接温暖您的每一天
        </p>
        <div class="button-group">
          <el-button @click="gotoLogin" type="primary" class="action-btn">开始倾诉，获得陪伴</el-button>
          <el-button class="secondary-btn">记录心情，释放情感</el-button>
        </div>
      </div>

      <!-- 右侧机器人图标 -->
      <div class="icon-wrapper">
        <img src="@/assets/robot-fill.png" alt="机器人图标" class="robot-icon" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'
const router = useRouter()
const gotoLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped>
.hero-page {
  width: 100vw;
  height: 100vh;
  background-color: #5a9b87; /* 还原图中的绿色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  max-width: 1200px;
}

.text-content {
  flex: 1;
  color: white;
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 1.5rem;
}

.highlight {
  color: #ffdd57; /* 黄色高亮文字 */
}

.desc-text {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.button-group {
  display: flex;
  gap: 1rem;
}

.action-btn {
  background-color: white;
  color: #5a9b87;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.secondary-btn {
  background-color: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 0.75rem 1.5rem;
}

.icon-wrapper {
  flex-shrink: 0;
  width: 200px;
  height: 200px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.robot-icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.side-btn {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}
</style>