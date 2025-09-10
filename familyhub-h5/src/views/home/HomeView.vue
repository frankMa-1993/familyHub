<template>
  <div class="home-container">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <div class="welcome-header">
        <div class="greeting">
          <h2>{{ greeting }}</h2>
          <p>{{ currentFamily?.name || '我的家庭' }}</p>
        </div>
        <div class="avatar-section">
          <van-avatar size="48" :src="userInfo?.avatar">
            {{ userInfo?.name?.charAt(0) || 'U' }}
          </van-avatar>
        </div>
      </div>
      
      <!-- 天气信息卡片 -->
      <div class="weather-card">
        <van-icon name="sun-o" size="20" />
        <span>今日晴朗 22°C</span>
        <span class="weather-tip">适合户外活动</span>
      </div>
    </div>

    <!-- 快捷功能区域 -->
    <div class="quick-actions">
      <h3 class="section-title">快捷功能</h3>
      <div class="action-grid">
        <div class="action-item" @click="navigateTo('/finance/add')">
          <div class="action-icon finance">
            <van-icon name="balance-list-o" size="24" />
          </div>
          <span>记一笔</span>
        </div>
        <div class="action-item" @click="navigateTo('/photos/upload')">
          <div class="action-icon photos">
            <van-icon name="photo-o" size="24" />
          </div>
          <span>上传照片</span>
        </div>
        <div class="action-item" @click="navigateTo('/schedule/add')">
          <div class="action-icon schedule">
            <van-icon name="calendar-o" size="24" />
          </div>
          <span>添加计划</span>
        </div>
        <div class="action-item" @click="navigateTo('/family')">
          <div class="action-icon family">
            <van-icon name="friends-o" size="24" />
          </div>
          <span>家庭成员</span>
        </div>
      </div>
    </div>

    <!-- 今日概览 -->
    <div class="today-overview">
      <h3 class="section-title">今日概览</h3>
      
      <!-- 财务概览 -->
      <div class="overview-card">
        <div class="card-header">
          <van-icon name="balance-list-o" color="#1976D2" />
          <span>今日支出</span>
          <van-button type="primary" size="mini" plain @click="navigateTo('/finance')">
            查看详情
          </van-button>
        </div>
        <div class="card-content">
          <div class="amount">¥{{ todayExpense }}</div>
          <div class="trend">
            <van-icon name="arrow-down" color="#f44336" size="12" />
            <span>比昨日多支出 ¥25</span>
          </div>
        </div>
      </div>

      <!-- 计划提醒 -->
      <div class="overview-card">
        <div class="card-header">
          <van-icon name="calendar-o" color="#4CAF50" />
          <span>今日计划</span>
          <van-button type="success" size="mini" plain @click="navigateTo('/schedule')">
            查看全部
          </van-button>
        </div>
        <div class="card-content">
          <div class="schedule-list">
            <div class="schedule-item" v-for="item in todaySchedule" :key="item.id">
              <div class="schedule-time">{{ item.time }}</div>
              <div class="schedule-title">{{ item.title }}</div>
              <van-tag v-if="item.urgent" type="danger" size="mini">紧急</van-tag>
            </div>
            <div v-if="todaySchedule.length === 0" class="empty-state">
              <van-icon name="calendar-o" size="32" color="#ccc" />
              <p>今日暂无计划</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 家庭动态 -->
    <div class="family-activity">
      <h3 class="section-title">家庭动态</h3>
      <div class="activity-list">
        <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
          <van-avatar size="32" :src="activity.user.avatar">
            {{ activity.user.name.charAt(0) }}
          </van-avatar>
          <div class="activity-content">
            <div class="activity-text">
              <strong>{{ activity.user.name }}</strong> {{ activity.action }}
            </div>
            <div class="activity-time">{{ activity.time }}</div>
          </div>
          <van-icon name="arrow" size="16" color="#ccc" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

// 模拟数据
const userInfo = ref({
  name: '张三',
  avatar: ''
})

const currentFamily = ref({
  name: '张家大院'
})

const todayExpense = ref(156.8)

const todaySchedule = ref([
  { id: 1, time: '09:00', title: '带妈妈去体检', urgent: true },
  { id: 2, time: '14:30', title: '接孩子放学', urgent: false },
  { id: 3, time: '19:00', title: '家庭聚餐', urgent: false }
])

const recentActivities = ref([
  {
    id: 1,
    user: { name: '李四', avatar: '' },
    action: '上传了5张照片到"春游相册"',
    time: '2小时前'
  },
  {
    id: 2,
    user: { name: '王五', avatar: '' },
    action: '记录了一笔支出：超市购物 ¥89',
    time: '4小时前'
  },
  {
    id: 3,
    user: { name: '赵六', avatar: '' },
    action: '添加了新的家庭计划',
    time: '昨天'
  }
])

// 计算问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '夜深了'
  if (hour < 12) return '早上好'
  if (hour < 18) return '下午好'
  return '晚上好'
})

// 导航方法
const navigateTo = (path: string) => {
  router.push(path)
}

onMounted(() => {
  // 这里可以加载用户数据和家庭信息
})
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 80px; // 为底部导航栏留出空间
}

.welcome-section {
  padding: 20px 16px;
  color: white;
  
  .welcome-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    .greeting {
      h2 {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      p {
        font-size: 14px;
        opacity: 0.8;
      }
    }
  }
  
  .weather-card {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(10px);
    
    .weather-tip {
      margin-left: auto;
      font-size: 12px;
      opacity: 0.8;
    }
  }
}

.quick-actions, .today-overview, .family-activity {
  margin: 20px 16px;
  
  .section-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #333;
  }
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
    
    &:active {
      transform: scale(0.95);
    }
    
    .action-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.finance {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }
      
      &.photos {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        color: white;
      }
      
      &.schedule {
        background: linear-gradient(135deg, #4facfe, #00f2fe);
        color: white;
      }
      
      &.family {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
        color: white;
      }
    }
    
    span {
      font-size: 12px;
      color: #666;
      text-align: center;
    }
  }
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    span {
      flex: 1;
      font-weight: 500;
      color: #333;
    }
  }
  
  .card-content {
    .amount {
      font-size: 28px;
      font-weight: 600;
      color: #1976D2;
      margin-bottom: 4px;
    }
    
    .trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }
  }
}

.schedule-list {
  .schedule-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .schedule-time {
      font-size: 12px;
      color: #666;
      min-width: 40px;
    }
    
    .schedule-title {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 20px;
    color: #999;
    
    p {
      margin-top: 8px;
      font-size: 14px;
    }
  }
}

.activity-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .activity-content {
      flex: 1;
      
      .activity-text {
        font-size: 14px;
        color: #333;
        margin-bottom: 4px;
      }
      
      .activity-time {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// 老人模式适配
:global(.elder-mode) .home-container {
  .section-title {
    font-size: 20px;
  }
  
  .action-item span {
    font-size: 14px;
  }
  
  .activity-text {
    font-size: 16px !important;
  }
}
</style>