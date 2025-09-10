<template>
  <div class="schedule-container">
    <!-- 顶部导航 -->
    <van-nav-bar 
      title="家庭计划" 
      left-arrow 
      @click-left="$router.back()"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="plus" size="20" @click="navigateToAdd" />
      </template>
    </van-nav-bar>

    <!-- 日历视图切换 -->
    <div class="view-switcher">
      <van-tabs v-model:active="activeView" @change="onViewChange">
        <van-tab title="今日" name="today" />
        <van-tab title="列表" name="list" />
        <van-tab title="日历" name="calendar" />
      </van-tabs>
    </div>

    <!-- 今日视图 -->
    <div v-if="activeView === 'today'" class="today-view">
      <div class="today-header">
        <div class="today-date">
          <h2>{{ todayText }}</h2>
          <p>{{ todayDateText }}</p>
        </div>
        <div class="today-stats">
          <div class="stat-item">
            <span class="stat-number">{{ todayEvents.length }}</span>
            <span class="stat-label">总计划</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ completedTodayEvents.length }}</span>
            <span class="stat-label">已完成</span>
          </div>
        </div>
      </div>

      <!-- 今日时间轴 -->
      <div class="timeline">
        <div 
          v-for="event in todayEvents" 
          :key="event.id"
          class="timeline-item"
          :class="{ completed: event.status === 'completed' }"
        >
          <div class="timeline-time">{{ event.time }}</div>
          <div class="timeline-dot" :class="event.priority"></div>
          <div class="timeline-content">
            <div class="timeline-card" @click="viewEvent(event)">
              <div class="card-header">
                <h5>{{ event.title }}</h5>
                <van-checkbox 
                  :model-value="event.status === 'completed'"
                  @update:model-value="toggleEventStatus(event)"
                />
              </div>
              <p>{{ event.description }}</p>
              <div class="card-footer">
                <van-tag :type="getEventTagType(event.priority)" size="mini">
                  {{ getPriorityText(event.priority) }}
                </van-tag>
                <span class="assignee">{{ event.assignee }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <van-empty 
          v-if="todayEvents.length === 0" 
          description="今日暂无计划"
          image="search"
        >
          <van-button type="primary" size="small" @click="navigateToAdd">
            添加今日计划
          </van-button>
        </van-empty>
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-if="activeView === 'list'" class="list-view">
      <div class="filter-section">
        <van-dropdown-menu>
          <van-dropdown-item 
            v-model="selectedCategory" 
            :options="categoryOptions"
            title="分类"
          />
          <van-dropdown-item 
            v-model="selectedMember" 
            :options="memberOptions"
            title="成员"
          />
          <van-dropdown-item 
            v-model="selectedStatus" 
            :options="statusOptions"
            title="状态"
          />
        </van-dropdown-menu>
      </div>

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多计划了"
          @load="onLoad"
        >
          <!-- 按日期分组 -->
          <div v-for="group in groupedEvents" :key="group.date" class="date-group">
            <div class="date-header">
              <span class="date-text">{{ formatDateGroup(group.date) }}</span>
              <span class="event-count">{{ group.events.length }}个计划</span>
            </div>
            
            <div class="events-list">
              <div 
                v-for="event in group.events" 
                :key="event.id"
                class="event-item"
                :class="{ completed: event.status === 'completed' }"
                @click="viewEvent(event)"
              >
                <div class="event-checkbox">
                  <van-checkbox 
                    :model-value="event.status === 'completed'"
                    @update:model-value="toggleEventStatus(event)"
                    :disabled="event.status === 'cancelled'"
                  />
                </div>
                
                <div class="event-content">
                  <div class="event-header">
                    <h5 class="event-title">{{ event.title }}</h5>
                    <van-tag :type="getEventTagType(event.priority)" size="mini">
                      {{ getPriorityText(event.priority) }}
                    </van-tag>
                  </div>
                  <p class="event-description">{{ event.description }}</p>
                  <div class="event-meta">
                    <span class="event-time">
                      <van-icon name="clock-o" size="12" />
                      {{ event.time }}
                    </span>
                    <span class="event-member">
                      <van-icon name="user-o" size="12" />
                      {{ event.assignee }}
                    </span>
                    <span class="event-category">
                      <van-icon name="label-o" size="12" />
                      {{ event.category }}
                    </span>
                  </div>
                </div>
                
                <div class="event-actions">
                  <van-icon name="arrow" size="16" color="#ccc" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <van-empty 
            v-if="groupedEvents.length === 0 && !loading" 
            description="暂无计划"
            image="search"
          >
            <van-button type="primary" size="small" @click="navigateToAdd">
              添加第一个计划
            </van-button>
          </van-empty>
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 日历视图 -->
    <div v-if="activeView === 'calendar'" class="calendar-view">
      <!-- 简化的月历显示 -->
      <div class="mini-calendar">
        <div class="calendar-header">
          <van-icon name="arrow-left" @click="prevMonth" />
          <h3>{{ currentMonthText }}</h3>
          <van-icon name="arrow" @click="nextMonth" />
        </div>
        
        <div class="calendar-grid">
          <div class="weekdays">
            <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
          </div>
          <div class="dates">
            <div 
              v-for="date in calendarDates" 
              :key="date.date"
              class="date-cell"
              :class="{
                'other-month': !date.isCurrentMonth,
                'today': date.isToday,
                'selected': date.isSelected,
                'has-events': date.events.length > 0
              }"
              @click="selectDate(date)"
            >
              <span class="date-number">{{ date.day }}</span>
              <div v-if="date.events.length > 0" class="event-dots">
                <div 
                  v-for="(event, index) in date.events.slice(0, 3)" 
                  :key="index"
                  class="event-dot"
                  :class="event.priority"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 选中日期的事件 -->
      <div v-if="selectedDateEvents.length > 0" class="selected-date-events">
        <h4>{{ formatSelectedDate }} 的计划</h4>
        <div class="events-list">
          <div 
            v-for="event in selectedDateEvents" 
            :key="event.id"
            class="event-item"
            @click="viewEvent(event)"
          >
            <div class="event-time">{{ event.time }}</div>
            <div class="event-content">
              <h5>{{ event.title }}</h5>
              <p>{{ event.description }}</p>
            </div>
            <van-tag :type="getEventTagType(event.priority)" size="mini">
              {{ getPriorityText(event.priority) }}
            </van-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 悬浮操作按钮 -->
    <van-floating-bubble
      axis="xy"
      icon="plus"
      @click="navigateToAdd"
      :style="{ right: '20px', bottom: '100px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import dayjs from 'dayjs'

const router = useRouter()

// 响应式数据
const activeView = ref('today')
const currentMonth = ref(dayjs())
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const selectedCategory = ref('')
const selectedMember = ref('')
const selectedStatus = ref('')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

// 日历相关
const weekdays = ['日', '一', '二', '三', '四', '五', '六']

// 筛选选项
const categoryOptions = [
  { text: '全部分类', value: '' },
  { text: '工作', value: 'work' },
  { text: '生活', value: 'life' },
  { text: '健康', value: 'health' },
  { text: '学习', value: 'study' },
  { text: '娱乐', value: 'entertainment' },
  { text: '其他', value: 'other' }
]

const memberOptions = [
  { text: '全部成员', value: '' },
  { text: '张三', value: 'zhangsan' },
  { text: '李四', value: 'lisi' },
  { text: '王五', value: 'wangwu' }
]

const statusOptions = [
  { text: '全部状态', value: '' },
  { text: '待完成', value: 'pending' },
  { text: '已完成', value: 'completed' },
  { text: '已取消', value: 'cancelled' }
]

// 模拟事件数据
const events = ref([
  {
    id: 1,
    title: '带妈妈去体检',
    description: '年度体检，记得带身份证和医保卡',
    date: dayjs().format('YYYY-MM-DD'),
    time: '09:00',
    category: 'health',
    assignee: '张三',
    priority: 'high',
    status: 'pending'
  },
  {
    id: 2,
    title: '接孩子放学',
    description: '学校门口接孩子',
    date: dayjs().format('YYYY-MM-DD'),
    time: '15:30',
    category: 'life',
    assignee: '李四',
    priority: 'medium',
    status: 'pending'
  },
  {
    id: 3,
    title: '家庭聚餐',
    description: '全家一起吃晚饭',
    date: dayjs().format('YYYY-MM-DD'),
    time: '18:00',
    category: 'life',
    assignee: '王五',
    priority: 'low',
    status: 'completed'
  },
  {
    id: 4,
    title: '购买生活用品',
    description: '超市采购日用品',
    date: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    time: '10:00',
    category: 'life',
    assignee: '张三',
    priority: 'medium',
    status: 'pending'
  }
])

// 计算属性
const currentMonthText = computed(() => {
  return currentMonth.value.format('YYYY年MM月')
})

const todayText = computed(() => {
  const today = dayjs()
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][today.day()]
  return `今天 星期${weekday}`
})

const todayDateText = computed(() => {
  return dayjs().format('MM月DD日')
})

const formatSelectedDate = computed(() => {
  return dayjs(selectedDate.value).format('MM月DD日')
})

const todayEvents = computed(() => {
  const today = dayjs().format('YYYY-MM-DD')
  return events.value
    .filter(event => event.date === today)
    .sort((a, b) => a.time.localeCompare(b.time))
})

const completedTodayEvents = computed(() => {
  return todayEvents.value.filter(event => event.status === 'completed')
})

const groupedEvents = computed(() => {
  let filteredEvents = events.value

  // 筛选逻辑
  if (selectedCategory.value) {
    filteredEvents = filteredEvents.filter(event => event.category === selectedCategory.value)
  }
  if (selectedMember.value) {
    filteredEvents = filteredEvents.filter(event => event.assignee === selectedMember.value)
  }
  if (selectedStatus.value) {
    filteredEvents = filteredEvents.filter(event => event.status === selectedStatus.value)
  }

  // 按日期分组
  const groups = filteredEvents.reduce((acc, event) => {
    const date = event.date
    if (!acc[date]) {
      acc[date] = {
        date,
        events: []
      }
    }
    acc[date].events.push(event)
    return acc
  }, {} as Record<string, any>)

  return Object.values(groups).sort((a: any, b: any) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
})

const calendarDates = computed(() => {
  const startOfMonth = currentMonth.value.startOf('month')
  const endOfMonth = currentMonth.value.endOf('month')
  const startDate = startOfMonth.startOf('week')
  const endDate = endOfMonth.endOf('week')
  
  const dates = []
  let current = startDate
  
  while (current.isBefore(endDate) || current.isSame(endDate)) {
    const dateStr = current.format('YYYY-MM-DD')
    const dayEvents = events.value.filter(event => event.date === dateStr)
    
    dates.push({
      date: dateStr,
      day: current.date(),
      isCurrentMonth: current.isSame(currentMonth.value, 'month'),
      isToday: current.isSame(dayjs(), 'day'),
      isSelected: current.format('YYYY-MM-DD') === selectedDate.value,
      events: dayEvents
    })
    
    current = current.add(1, 'day')
  }
  
  return dates
})

const selectedDateEvents = computed(() => {
  return events.value.filter(event => event.date === selectedDate.value)
})

// 方法
const navigateToAdd = () => {
  router.push('/schedule/add')
}

const onViewChange = (name: string) => {
  activeView.value = name
}

const onRefresh = () => {
  setTimeout(() => {
    refreshing.value = false
    showToast.success('刷新成功')
  }, 1000)
}

const onLoad = () => {
  setTimeout(() => {
    loading.value = false
    finished.value = true
  }, 1000)
}

const viewEvent = (event: any) => {
  showToast(`查看计划：${event.title}`)
}

const toggleEventStatus = (event: any) => {
  event.status = event.status === 'completed' ? 'pending' : 'completed'
  showToast(event.status === 'completed' ? '已完成' : '标记为待完成')
}

const prevMonth = () => {
  currentMonth.value = currentMonth.value.subtract(1, 'month')
}

const nextMonth = () => {
  currentMonth.value = currentMonth.value.add(1, 'month')
}

const selectDate = (date: any) => {
  selectedDate.value = date.date
}

const formatDateGroup = (date: string) => {
  const today = dayjs().format('YYYY-MM-DD')
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  
  if (date === today) return '今天'
  if (date === tomorrow) return '明天'
  if (date === yesterday) return '昨天'
  return dayjs(date).format('MM月DD日')
}

const getEventTagType = (priority: string) => {
  const typeMap: Record<string, string> = {
    'high': 'danger',
    'medium': 'warning',
    'low': 'default'
  }
  return typeMap[priority] || 'default'
}

const getPriorityText = (priority: string) => {
  const textMap: Record<string, string> = {
    'high': '重要',
    'medium': '普通',
    'low': '一般'
  }
  return textMap[priority] || '一般'
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.schedule-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 80px;
}

.view-switcher {
  background: white;
  
  :deep(.van-tabs__nav) {
    background: white;
  }
}

.today-view {
  .today-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .today-date {
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
    
    .today-stats {
      display: flex;
      gap: 20px;
      
      .stat-item {
        text-align: center;
        
        .stat-number {
          display: block;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 12px;
          opacity: 0.8;
        }
      }
    }
  }
  
  .timeline {
    padding: 16px;
    
    .timeline-item {
      display: flex;
      margin-bottom: 20px;
      
      &.completed {
        opacity: 0.6;
        
        .timeline-card {
          background: #f8f9fa;
        }
      }
      
      .timeline-time {
        width: 60px;
        font-size: 12px;
        color: #666;
        text-align: right;
        padding-right: 12px;
        padding-top: 4px;
      }
      
      .timeline-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-top: 8px;
        margin-right: 12px;
        
        &.high {
          background: #f44336;
        }
        
        &.medium {
          background: #ff9800;
        }
        
        &.low {
          background: #4caf50;
        }
      }
      
      .timeline-content {
        flex: 1;
        
        .timeline-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          
          &:active {
            transform: scale(0.98);
          }
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            h5 {
              font-size: 16px;
              font-weight: 500;
              color: #333;
            }
          }
          
          p {
            font-size: 14px;
            color: #666;
            margin-bottom: 12px;
          }
          
          .card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .assignee {
              font-size: 12px;
              color: #999;
            }
          }
        }
      }
    }
  }
}

.list-view {
  .filter-section {
    background: white;
  }
  
  .date-group {
    margin-bottom: 16px;
    
    .date-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f8f9fa;
      
      .date-text {
        font-size: 14px;
        font-weight: 500;
        color: #333;
      }
      
      .event-count {
        font-size: 12px;
        color: #666;
      }
    }
    
    .events-list {
      background: white;
      
      .event-item {
        display: flex;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:active {
          background: #f8f9fa;
        }
        
        &.completed {
          opacity: 0.6;
          
          .event-title {
            text-decoration: line-through;
          }
        }
        
        .event-checkbox {
          margin-right: 12px;
        }
        
        .event-content {
          flex: 1;
          
          .event-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
            
            .event-title {
              font-size: 16px;
              color: #333;
            }
          }
          
          .event-description {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
          }
          
          .event-meta {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #999;
            
            span {
              display: flex;
              align-items: center;
              gap: 4px;
            }
          }
        }
        
        .event-actions {
          margin-left: 12px;
        }
      }
    }
  }
}

.calendar-view {
  padding: 16px;
  
  .mini-calendar {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      h3 {
        font-size: 18px;
        font-weight: 500;
        color: #333;
      }
      
      .van-icon {
        padding: 8px;
        cursor: pointer;
        
        &:active {
          background: #f0f0f0;
          border-radius: 4px;
        }
      }
    }
    
    .calendar-grid {
      .weekdays {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        margin-bottom: 8px;
        
        .weekday {
          text-align: center;
          font-size: 12px;
          color: #999;
          padding: 8px 0;
        }
      }
      
      .dates {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 2px;
        
        .date-cell {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 8px;
          position: relative;
          
          &:hover {
            background: #f0f0f0;
          }
          
          &.other-month {
            opacity: 0.3;
          }
          
          &.today {
            background: #667eea;
            color: white;
          }
          
          &.selected {
            background: #764ba2;
            color: white;
          }
          
          &.has-events {
            .date-number {
              font-weight: 600;
            }
          }
          
          .date-number {
            font-size: 14px;
            margin-bottom: 2px;
          }
          
          .event-dots {
            display: flex;
            gap: 2px;
            
            .event-dot {
              width: 4px;
              height: 4px;
              border-radius: 50%;
              
              &.high {
                background: #f44336;
              }
              
              &.medium {
                background: #ff9800;
              }
              
              &.low {
                background: #4caf50;
              }
            }
          }
        }
      }
    }
  }
  
  .selected-date-events {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    h4 {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
    }
    
    .events-list {
      .event-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:active {
          background: #f8f9fa;
        }
        
        .event-time {
          font-size: 12px;
          color: #666;
          min-width: 40px;
        }
        
        .event-content {
          flex: 1;
          
          h5 {
            font-size: 14px;
            color: #333;
            margin-bottom: 4px;
          }
          
          p {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
}

// 老人模式适配
:global(.elder-mode) .schedule-container {
  .today-header h2 {
    font-size: 28px !important;
  }
  
  .timeline-card {
    h5 {
      font-size: 18px !important;
    }
    
    p {
      font-size: 16px !important;
    }
  }
  
  .event-title {
    font-size: 18px !important;
  }
  
  .event-description {
    font-size: 16px !important;
  }
}
</style>