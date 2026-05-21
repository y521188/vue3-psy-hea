<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar users">
              <el-image style="width: 40px; height: 40px" :src="iconUrl1" />
            </div>
            <div class="info">
              <p class="title">总用户数</p>
              <p class="number">{{ aiData.systemOverview?.totalUsers || 0 }}</p>
              <p class="subtitle-title">活跃用户：{{ aiData.systemOverview?.activeUsers || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar like">
              <el-image style="width: 40px; height: 40px" :src="iconUrl2" />
            </div>
            <div class="info">
              <p class="title">情绪日志</p>
              <p class="number">{{ aiData.systemOverview?.totalDiaries || 0 }}</p>
              <p class="subtitle-title">今日新增：{{ aiData.systemOverview?.todayNewDiaries || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar comments">
              <el-image style="width: 40px; height: 40px" :src="iconUrl3" />
            </div>
            <div class="info">
              <p class="title">咨询会话</p>
              <p class="number">{{ aiData.systemOverview?.totalSessions || 0 }}</p>
              <p class="subtitle-title">今日新增: {{ aiData.systemOverview?.todayNewSessions || 0 }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-content">
            <div class="avatar smile">
              <el-image style="width: 40px; height: 40px" :src="iconUrl4" />
            </div>
            <div class="info">
              <p class="title">平均情绪</p>
              <p class="number">{{ aiData.systemOverview?.avgMoodScore || 7 }}/10</p>
              <p class="subtitle-title">情绪健康指数</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表行：折线图 + 柱状图 左右并排 -->
    <el-row style="margin-top: 20px" :gutter="20">
      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">情绪趋势折线图</div>
          </template>
          <div class="chart-content">
            <div ref="emotionChartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card style="width: 100%">
          <template #header>
            <div class="card-header">情绪趋势柱状图</div>
          </template>
          <div class="chart-content">
            <div ref="barChartRef" style="width: 100%; height: 300px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getAnalyticsOverview } from '@/api/admin'
import * as echarts from 'echarts'

const iconUrl1 = new URL('@/assets/images/users.png', import.meta.url).href
const iconUrl2 = new URL('@/assets/images/like.png', import.meta.url).href
const iconUrl3 = new URL('@/assets/images/comments.png', import.meta.url).href
const iconUrl4 = new URL('@/assets/images/smile.png', import.meta.url).href

const aiData = ref({})

// 两个图表 ref
const emotionChartRef = ref(null)
const barChartRef = ref(null)

let emotionChart = null
let barChart = null

// 初始化折线图
const initLineChart = () => {
  if (!emotionChartRef.value) return
  emotionChart = echarts.init(emotionChartRef.value)

  const trendList = aiData.value.emotionTrend || []
  const xData = trendList.map(v => v.date)
  const scoreData = trendList.map(v => v.avgMoodScore)

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['平均情绪评分'], top: 10 },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value', min: 0, max: 10 },
    series: [{
      name: '平均情绪评分',
      type: 'line',
      data: scoreData,
      smooth: true,
      color: '#4E8CFF'
    }]
  }
  emotionChart.setOption(option)
}

// 初始化柱状图（同数据）
const initBarChart = () => {
  if (!barChartRef.value) return
  barChart = echarts.init(barChartRef.value)

  const trendList = aiData.value.emotionTrend || []
  const xData = trendList.map(v => v.date)
  const scoreData = trendList.map(v => v.avgMoodScore)

  const option = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['平均情绪评分'], top: 10 },
    xAxis: { type: 'category', data: xData },
    yAxis: { type: 'value', min: 0, max: 10 },
    series: [{
      name: '平均情绪评分',
      type: 'bar',
      data: scoreData,
      itemStyle: { color: '#42b983' }
    }]
  }
  barChart.setOption(option)
}

// 统一初始化两个图
const initAllCharts = () => {
  initLineChart()
  initBarChart()
}

const handleResize = () => {
  emotionChart?.resize()
  barChart?.resize()
}

onMounted(() => {
  getAnalyticsOverview().then(res => {
    console.log('后端返回数据:', res)
    aiData.value = res
    initAllCharts()
  }).catch(err => {
    console.error('获取数据失败:', err)
  })
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  emotionChart?.dispose()
  barChart?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  .card-content {
    display: flex;
    align-items: center;
    .avatar {
      margin-right: 12px;
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      &.users {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      &.like {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }
      &.comments {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }
      &.smile {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
    .info {
      .title {
        font-size: 14px;
        color: #7f8c8d;
        margin-bottom: 4px;
      }
      .number {
        font-size: 24px;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 4px;
      }
      .subtitle-title {
        font-size: 12px;
        color: #95a5a6;
      }
    }
  }
  .chart-content {
    padding: 20px;
    height: 300px;
    canvas {
      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>