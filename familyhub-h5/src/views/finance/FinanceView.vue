<template>
  <div class="finance-container">
    <!-- 顶部导航 -->
    <van-nav-bar 
      title="家庭财务" 
      left-arrow 
      @click-left="$router.back()"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="chart-trending-o" size="20" @click="navigateToStatistics" />
      </template>
    </van-nav-bar>

    <!-- 财务概览卡片 -->
    <div class="overview-section">
      <div class="overview-card">
        <div class="card-header">
          <h3>本月概览</h3>
          <van-button type="primary" size="mini" plain @click="switchMonth">
            {{ currentMonth }}月
          </van-button>
        </div>
        
        <div class="overview-stats">
          <div class="stat-item income">
            <div class="stat-icon">
              <van-icon name="arrow-up" />
            </div>
            <div class="stat-content">
              <div class="stat-label">收入</div>
              <div class="stat-value">¥{{ monthlyIncome }}</div>
            </div>
          </div>
          
          <div class="stat-item expense">
            <div class="stat-icon">
              <van-icon name="arrow-down" />
            </div>
            <div class="stat-content">
              <div class="stat-label">支出</div>
              <div class="stat-value">¥{{ monthlyExpense }}</div>
            </div>
          </div>
          
          <div class="stat-item balance">
            <div class="stat-icon">
              <van-icon name="balance-o" />
            </div>
            <div class="stat-content">
              <div class="stat-label">结余</div>
              <div class="stat-value" :class="{ negative: monthlyBalance < 0 }">
                ¥{{ monthlyBalance }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <van-button 
        type="primary" 
        size="large" 
        round 
        block 
        icon="plus"
        @click="navigateToAdd"
        class="add-btn"
      >
        记一笔
      </van-button>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <van-tabs v-model:active="activeTab" @change="onTabChange">
          <van-tab title="全部" name="all" />
          <van-tab title="收入" name="income" />
          <van-tab title="支出" name="expense" />
        </van-tabs>
      </div>
      
      <div class="filter-controls">
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
            v-model="selectedSort" 
            :options="sortOptions"
            title="排序"
          />
        </van-dropdown-menu>
      </div>
    </div>

    <!-- 记录列表 -->
    <div class="records-section">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <!-- 按日期分组显示 -->
          <div v-for="group in groupedRecords" :key="group.date" class="date-group">
            <div class="date-header">
              <span class="date-text">{{ formatDate(group.date) }}</span>
              <span class="date-amount">
                支出 ¥{{ group.totalExpense }} 收入 ¥{{ group.totalIncome }}
              </span>
            </div>
            
            <div class="records-list">
              <div 
                v-for="record in group.records" 
                :key="record.id"
                class="record-item"
                @click="viewRecord(record)"
              >
                <div class="record-icon">
                  <van-icon :name="getCategoryIcon(record.category)" :color="record.type === 'income' ? '#4CAF50' : '#f44336'" />
                </div>
                
                <div class="record-content">
                  <div class="record-title">{{ record.title }}</div>
                  <div class="record-info">
                    <span class="record-category">{{ record.category }}</span>
                    <span class="record-member">{{ record.member }}</span>
                  </div>
                </div>
                
                <div class="record-amount" :class="record.type">
                  {{ record.type === 'income' ? '+' : '-' }}¥{{ record.amount }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 空状态 -->
          <van-empty 
            v-if="groupedRecords.length === 0 && !loading" 
            description="暂无记录"
            image="search"
          >
            <van-button type="primary" size="small" @click="navigateToAdd">
              添加第一笔记录
            </van-button>
          </van-empty>
        </van-list>
      </van-pull-refresh>
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
const currentMonth = ref(new Date().getMonth() + 1)
const monthlyIncome = ref(8500.00)
const monthlyExpense = ref(6234.50)
const activeTab = ref('all')
const selectedCategory = ref('')
const selectedMember = ref('')
const selectedSort = ref('time_desc')
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

// 计算结余
const monthlyBalance = computed(() => monthlyIncome.value - monthlyExpense.value)

// 筛选选项
const categoryOptions = [
  { text: '全部分类', value: '' },
  { text: '餐饮', value: 'food' },
  { text: '交通', value: 'transport' },
  { text: '购物', value: 'shopping' },
  { text: '娱乐', value: 'entertainment' },
  { text: '医疗', value: 'medical' },
  { text: '教育', value: 'education' },
  { text: '工资', value: 'salary' },
  { text: '其他', value: 'other' }
]

const memberOptions = [
  { text: '全部成员', value: '' },
  { text: '张三', value: 'zhangsan' },
  { text: '李四', value: 'lisi' },
  { text: '王五', value: 'wangwu' }
]

const sortOptions = [
  { text: '时间倒序', value: 'time_desc' },
  { text: '时间正序', value: 'time_asc' },
  { text: '金额倒序', value: 'amount_desc' },
  { text: '金额正序', value: 'amount_asc' }
]

// 模拟数据
const records = ref([
  {
    id: 1,
    title: '午餐',
    amount: 45.00,
    type: 'expense',
    category: '餐饮',
    member: '张三',
    date: '2024-03-15',
    time: '12:30',
    note: '公司楼下餐厅'
  },
  {
    id: 2,
    title: '地铁',
    amount: 6.00,
    type: 'expense',
    category: '交通',
    member: '张三',
    date: '2024-03-15',
    time: '08:30'
  },
  {
    id: 3,
    title: '工资',
    amount: 8500.00,
    type: 'income',
    category: '工资',
    member: '张三',
    date: '2024-03-01',
    time: '09:00'
  },
  {
    id: 4,
    title: '超市购物',
    amount: 156.80,
    type: 'expense',
    category: '购物',
    member: '李四',
    date: '2024-03-14',
    time: '19:20'
  }
])

// 按日期分组的记录
const groupedRecords = computed(() => {
  const filtered = records.value.filter(record => {
    if (activeTab.value !== 'all' && record.type !== activeTab.value) return false
    if (selectedCategory.value && record.category !== selectedCategory.value) return false
    if (selectedMember.value && record.member !== selectedMember.value) return false
    return true
  })

  // 按日期分组
  const groups = filtered.reduce((acc, record) => {
    const date = record.date
    if (!acc[date]) {
      acc[date] = {
        date,
        records: [],
        totalIncome: 0,
        totalExpense: 0
      }
    }
    acc[date].records.push(record)
    if (record.type === 'income') {
      acc[date].totalIncome += record.amount
    } else {
      acc[date].totalExpense += record.amount
    }
    return acc
  }, {} as Record<string, any>)

  return Object.values(groups).sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

// 方法
const navigateToAdd = () => {
  router.push('/finance/add')
}

const navigateToStatistics = () => {
  router.push('/finance/statistics')
}

const switchMonth = () => {
  showToast('月份切换功能开发中')
}

const onTabChange = (name: string) => {
  activeTab.value = name
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

const viewRecord = (record: any) => {
  showToast(`查看记录：${record.title}`)
}

const formatDate = (date: string) => {
  const today = dayjs().format('YYYY-MM-DD')
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  
  if (date === today) return '今天'
  if (date === yesterday) return '昨天'
  return dayjs(date).format('MM月DD日')
}

const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, string> = {
    '餐饮': 'food-o',
    '交通': 'logistics',
    '购物': 'shopping-cart-o',
    '娱乐': 'music-o',
    '医疗': 'medic',
    '教育': 'book-o',
    '工资': 'gold-coin-o',
    '其他': 'more-o'
  }
  return iconMap[category] || 'more-o'
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.finance-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 80px;
}

.overview-section {
  padding: 16px;
  
  .overview-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 20px;
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h3 {
        font-size: 18px;
        font-weight: 600;
      }
    }
    
    .overview-stats {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      
      .stat-item {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .stat-content {
          .stat-label {
            font-size: 12px;
            opacity: 0.8;
            margin-bottom: 4px;
          }
          
          .stat-value {
            font-size: 16px;
            font-weight: 600;
            
            &.negative {
              color: #ffcdd2;
            }
          }
        }
      }
    }
  }
}

.quick-actions {
  padding: 0 16px 16px;
  
  .add-btn {
    background: linear-gradient(135deg, #4CAF50, #45a049);
    border: none;
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  }
}

.filter-section {
  background: white;
  
  .filter-tabs {
    :deep(.van-tabs__nav) {
      background: white;
    }
  }
  
  .filter-controls {
    border-top: 1px solid #f0f0f0;
  }
}

.records-section {
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
      
      .date-amount {
        font-size: 12px;
        color: #666;
      }
    }
    
    .records-list {
      background: white;
      
      .record-item {
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
        
        .record-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
        
        .record-content {
          flex: 1;
          
          .record-title {
            font-size: 16px;
            color: #333;
            margin-bottom: 4px;
          }
          
          .record-info {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #999;
          }
        }
        
        .record-amount {
          font-size: 16px;
          font-weight: 600;
          
          &.income {
            color: #4CAF50;
          }
          
          &.expense {
            color: #f44336;
          }
        }
      }
    }
  }
}

// 老人模式适配
:global(.elder-mode) .finance-container {
  .overview-card {
    .stat-value {
      font-size: 18px !important;
    }
  }
  
  .record-item {
    .record-title {
      font-size: 18px !important;
    }
    
    .record-amount {
      font-size: 18px !important;
    }
  }
}
</style>