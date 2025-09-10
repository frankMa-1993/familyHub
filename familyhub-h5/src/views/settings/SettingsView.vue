<template>
  <div class="settings-container">
    <!-- 顶部导航 -->
    <van-nav-bar 
      title="设置" 
      left-arrow 
      @click-left="$router.back()"
      fixed
      placeholder
    />

    <!-- 用户信息区域 -->
    <div class="user-section">
      <div class="user-card">
        <van-avatar :size="60" :src="userInfo.avatar">
          {{ userInfo.name.charAt(0) }}
        </van-avatar>
        <div class="user-info">
          <h3 class="user-name">{{ userInfo.name }}</h3>
          <p class="user-desc">{{ userInfo.role }} · {{ userInfo.family }}</p>
        </div>
        <van-icon name="arrow" size="16" color="#999" />
      </div>
    </div>

    <!-- 设置选项 -->
    <div class="settings-content">
      <!-- 基础设置 -->
      <div class="settings-group">
        <h4 class="group-title">基础设置</h4>
        <van-cell-group inset>
          <van-cell 
            title="个人信息" 
            icon="user-o" 
            is-link 
            @click="navigateTo('/profile')"
          />
          <van-cell 
            title="家庭管理" 
            icon="friends-o" 
            is-link 
            @click="navigateTo('/family')"
          />
          <van-cell 
            title="账户安全" 
            icon="shield-o" 
            is-link 
            @click="showComingSoon"
          />
          <van-cell 
            title="隐私设置" 
            icon="eye-o" 
            is-link 
            @click="showPrivacySettings = true"
          />
        </van-cell-group>
      </div>

      <!-- 应用设置 -->
      <div class="settings-group">
        <h4 class="group-title">应用设置</h4>
        <van-cell-group inset>
          <van-cell 
            title="老人模式" 
            icon="font-o"
          >
            <template #right-icon>
              <van-switch 
                v-model="isElderMode" 
                @change="toggleElderMode"
                size="20px"
              />
            </template>
          </van-cell>
          <van-cell 
            title="深色模式" 
            icon="moon-o"
          >
            <template #right-icon>
              <van-switch 
                v-model="isDarkMode" 
                @change="toggleDarkMode"
                size="20px"
              />
            </template>
          </van-cell>
          <van-cell 
            title="语言设置" 
            icon="chat-o" 
            is-link 
            @click="showLanguageSettings = true"
          >
            <template #value>
              <span class="cell-value">{{ currentLanguage }}</span>
            </template>
          </van-cell>
          <van-cell 
            title="字体大小" 
            icon="font-size" 
            is-link 
            @click="showFontSettings = true"
          >
            <template #value>
              <span class="cell-value">{{ currentFontSize }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 通知设置 -->
      <div class="settings-group">
        <h4 class="group-title">通知设置</h4>
        <van-cell-group inset>
          <van-cell 
            title="推送通知" 
            icon="bell"
          >
            <template #right-icon>
              <van-switch 
                v-model="notificationSettings.push" 
                @change="updateNotificationSettings"
                size="20px"
              />
            </template>
          </van-cell>
          <van-cell 
            title="财务提醒" 
            icon="balance-list-o"
          >
            <template #right-icon>
              <van-switch 
                v-model="notificationSettings.finance" 
                @change="updateNotificationSettings"
                size="20px"
              />
            </template>
          </van-cell>
          <van-cell 
            title="计划提醒" 
            icon="calendar-o"
          >
            <template #right-icon>
              <van-switch 
                v-model="notificationSettings.schedule" 
                @change="updateNotificationSettings"
                size="20px"
              />
            </template>
          </van-cell>
          <van-cell 
            title="家庭动态" 
            icon="friends-o"
          >
            <template #right-icon>
              <van-switch 
                v-model="notificationSettings.family" 
                @change="updateNotificationSettings"
                size="20px"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 数据管理 -->
      <div class="settings-group">
        <h4 class="group-title">数据管理</h4>
        <van-cell-group inset>
          <van-cell 
            title="数据同步" 
            icon="cloud-o" 
            is-link 
            @click="showSyncSettings = true"
          >
            <template #value>
              <span class="cell-value sync-status" :class="{ synced: isSynced }">
                {{ isSynced ? '已同步' : '未同步' }}
              </span>
            </template>
          </van-cell>
          <van-cell 
            title="数据备份" 
            icon="down" 
            is-link 
            @click="showBackupOptions = true"
          />
          <van-cell 
            title="数据导出" 
            icon="share" 
            is-link 
            @click="exportData"
          />
          <van-cell 
            title="清除缓存" 
            icon="delete-o" 
            is-link 
            @click="clearCache"
          >
            <template #value>
              <span class="cell-value">{{ cacheSize }}</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 帮助与支持 -->
      <div class="settings-group">
        <h4 class="group-title">帮助与支持</h4>
        <van-cell-group inset>
          <van-cell 
            title="使用帮助" 
            icon="question-o" 
            is-link 
            @click="showHelp"
          />
          <van-cell 
            title="意见反馈" 
            icon="comment-o" 
            is-link 
            @click="showFeedback"
          />
          <van-cell 
            title="联系客服" 
            icon="service" 
            is-link 
            @click="contactService"
          />
          <van-cell 
            title="检查更新" 
            icon="upgrade" 
            is-link 
            @click="checkUpdate"
          >
            <template #value>
              <span class="cell-value">v1.0.0</span>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 关于应用 -->
      <div class="settings-group">
        <h4 class="group-title">关于应用</h4>
        <van-cell-group inset>
          <van-cell 
            title="用户协议" 
            icon="description" 
            is-link 
            @click="showUserAgreement"
          />
          <van-cell 
            title="隐私政策" 
            icon="lock" 
            is-link 
            @click="showPrivacyPolicy"
          />
          <van-cell 
            title="关于我们" 
            icon="info-o" 
            is-link 
            @click="showAbout"
          />
        </van-cell-group>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <van-button 
        type="danger" 
        size="large" 
        block 
        round 
        @click="logout"
        class="logout-btn"
      >
        退出登录
      </van-button>
    </div>

    <!-- 隐私设置弹窗 -->
    <van-popup v-model:show="showPrivacySettings" position="bottom" :style="{ height: '60%' }">
      <div class="privacy-settings">
        <div class="popup-header">
          <van-button type="primary" size="small" text @click="showPrivacySettings = false">
            取消
          </van-button>
          <h3>隐私设置</h3>
          <van-button type="primary" size="small" @click="savePrivacySettings">
            保存
          </van-button>
        </div>
        
        <div class="privacy-content">
          <van-cell-group>
            <van-cell title="允许搜索">
              <template #right-icon>
                <van-switch v-model="privacySettings.allowSearch" size="20px" />
              </template>
            </van-cell>
            <van-cell title="显示在线状态">
              <template #right-icon>
                <van-switch v-model="privacySettings.showOnlineStatus" size="20px" />
              </template>
            </van-cell>
            <van-cell title="允许陌生人查看相册">
              <template #right-icon>
                <van-switch v-model="privacySettings.allowStrangerViewPhotos" size="20px" />
              </template>
            </van-cell>
            <van-cell title="数据分析">
              <template #right-icon>
                <van-switch v-model="privacySettings.dataAnalytics" size="20px" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </div>
    </van-popup>

    <!-- 语言设置弹窗 -->
    <van-action-sheet
      v-model:show="showLanguageSettings"
      :actions="languageActions"
      @select="onLanguageSelect"
      cancel-text="取消"
      description="选择语言"
    />

    <!-- 字体设置弹窗 -->
    <van-action-sheet
      v-model:show="showFontSettings"
      :actions="fontActions"
      @select="onFontSelect"
      cancel-text="取消"
      description="选择字体大小"
    />

    <!-- 同步设置弹窗 -->
    <van-popup v-model:show="showSyncSettings" position="bottom" :style="{ height: '50%' }">
      <div class="sync-settings">
        <div class="popup-header">
          <van-button type="primary" size="small" text @click="showSyncSettings = false">
            关闭
          </van-button>
          <h3>数据同步</h3>
          <van-button type="primary" size="small" @click="syncNow">
            立即同步
          </van-button>
        </div>
        
        <div class="sync-content">
          <div class="sync-status">
            <van-icon name="cloud-o" size="48" color="#1976d2" />
            <h4>{{ isSynced ? '数据已同步' : '数据未同步' }}</h4>
            <p>最后同步时间：{{ lastSyncTime }}</p>
          </div>
          
          <van-cell-group>
            <van-cell title="自动同步">
              <template #right-icon>
                <van-switch v-model="syncSettings.autoSync" size="20px" />
              </template>
            </van-cell>
            <van-cell title="仅WiFi同步">
              <template #right-icon>
                <van-switch v-model="syncSettings.wifiOnly" size="20px" />
              </template>
            </van-cell>
          </van-cell-group>
        </div>
      </div>
    </van-popup>

    <!-- 备份选项弹窗 -->
    <van-action-sheet
      v-model:show="showBackupOptions"
      :actions="backupActions"
      @select="onBackupSelect"
      cancel-text="取消"
      description="选择备份方式"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog, showDialog } from 'vant'
import { useSettingsStore } from '@/stores/settings'
import dayjs from 'dayjs'

const router = useRouter()
const settingsStore = useSettingsStore()

// 响应式数据
const showPrivacySettings = ref(false)
const showLanguageSettings = ref(false)
const showFontSettings = ref(false)
const showSyncSettings = ref(false)
const showBackupOptions = ref(false)

// 用户信息
const userInfo = ref({
  name: '张三',
  avatar: '',
  role: '家庭管理员',
  family: '张家大院'
})

// 设置状态
const isDarkMode = ref(false)
const isSynced = ref(true)
const cacheSize = ref('12.5MB')
const lastSyncTime = ref(dayjs().format('YYYY-MM-DD HH:mm'))

// 通知设置
const notificationSettings = ref({
  push: true,
  finance: true,
  schedule: true,
  family: false
})

// 隐私设置
const privacySettings = ref({
  allowSearch: true,
  showOnlineStatus: true,
  allowStrangerViewPhotos: false,
  dataAnalytics: true
})

// 同步设置
const syncSettings = ref({
  autoSync: true,
  wifiOnly: false
})

// 计算属性
const isElderMode = computed({
  get: () => settingsStore.isElderMode,
  set: (value) => settingsStore.setElderMode(value)
})

const currentLanguage = ref('简体中文')
const currentFontSize = ref('标准')

// 语言选项
const languageActions = [
  { name: '简体中文', value: 'zh-CN' },
  { name: '繁體中文', value: 'zh-TW' },
  { name: 'English', value: 'en' }
]

// 字体选项
const fontActions = [
  { name: '小', value: 'small' },
  { name: '标准', value: 'normal' },
  { name: '大', value: 'large' },
  { name: '特大', value: 'xlarge' }
]

// 备份选项
const backupActions = [
  { name: '本地备份', value: 'local' },
  { name: '云端备份', value: 'cloud' },
  { name: '导出到邮箱', value: 'email' }
]

// 方法
const navigateTo = (path: string) => {
  router.push(path)
}

const toggleElderMode = (value: boolean) => {
  settingsStore.setElderMode(value)
  showToast(value ? '已开启老人模式' : '已关闭老人模式')
}

const toggleDarkMode = (value: boolean) => {
  isDarkMode.value = value
  showToast(value ? '已开启深色模式' : '已关闭深色模式')
}

const updateNotificationSettings = () => {
  showToast('通知设置已更新')
}

const savePrivacySettings = () => {
  showPrivacySettings.value = false
  showToast('隐私设置已保存')
}

const onLanguageSelect = (action: any) => {
  showLanguageSettings.value = false
  currentLanguage.value = action.name
  showToast(`语言已切换为${action.name}`)
}

const onFontSelect = (action: any) => {
  showFontSettings.value = false
  currentFontSize.value = action.name
  showToast(`字体大小已设置为${action.name}`)
}

const syncNow = () => {
  showToast('正在同步数据...')
  setTimeout(() => {
    isSynced.value = true
    lastSyncTime.value = dayjs().format('YYYY-MM-DD HH:mm')
    showToast('数据同步完成')
  }, 2000)
}

const onBackupSelect = (action: any) => {
  showBackupOptions.value = false
  switch (action.value) {
    case 'local':
      showToast('本地备份功能开发中')
      break
    case 'cloud':
      showToast('云端备份功能开发中')
      break
    case 'email':
      showToast('邮箱导出功能开发中')
      break
  }
}

const exportData = () => {
  showConfirmDialog({
    title: '数据导出',
    message: '将导出您的所有数据，包括财务记录、照片等',
  }).then(() => {
    showToast('数据导出功能开发中')
  })
}

const clearCache = () => {
  showConfirmDialog({
    title: '清除缓存',
    message: '确定要清除应用缓存吗？这将释放存储空间',
  }).then(() => {
    cacheSize.value = '0MB'
    showToast('缓存已清除')
  })
}

const showHelp = () => {
  showDialog({
    title: '使用帮助',
    message: '如需帮助，请查看用户手册或联系客服\n\n客服电话：400-123-4567\n工作时间：9:00-18:00',
    confirmButtonText: '我知道了'
  })
}

const showFeedback = () => {
  showDialog({
    title: '意见反馈',
    message: '您的意见对我们很重要\n\n反馈邮箱：feedback@familyhub.com\n或通过应用内反馈功能提交',
    confirmButtonText: '我知道了'
  })
}

const contactService = () => {
  showDialog({
    title: '联系客服',
    message: '客服热线：400-123-4567\n在线客服：周一至周五 9:00-18:00\n邮箱：service@familyhub.com',
    confirmButtonText: '我知道了'
  })
}

const checkUpdate = () => {
  showToast('正在检查更新...')
  setTimeout(() => {
    showToast('已是最新版本')
  }, 1500)
}

const showUserAgreement = () => {
  showDialog({
    title: '用户协议',
    message: '请仔细阅读用户协议内容...\n\n（这里应该显示完整的用户协议）',
    confirmButtonText: '我知道了'
  })
}

const showPrivacyPolicy = () => {
  showDialog({
    title: '隐私政策',
    message: '我们重视您的隐私保护...\n\n（这里应该显示完整的隐私政策）',
    confirmButtonText: '我知道了'
  })
}

const showAbout = () => {
  showDialog({
    title: 'FamilyHub 家庭管家',
    message: '版本：v1.0.0\n发布时间：2024-03-15\n\n一个专为家庭设计的生活管理应用，帮助您更好地管理家庭财务、照片和计划。\n\n© 2024 FamilyHub Team',
    confirmButtonText: '我知道了'
  })
}

const showComingSoon = () => {
  showToast('功能开发中，敬请期待')
}

const logout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
  }).then(() => {
    showToast('已退出登录')
    router.replace('/login')
  })
}

onMounted(() => {
  // 初始化设置
})
</script>

<style lang="scss" scoped>
.settings-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 80px;
}

.user-section {
  padding: 16px;
  
  .user-card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
    
    &:active {
      transform: scale(0.98);
    }
    
    .user-info {
      flex: 1;
      margin-left: 16px;
      
      .user-name {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
      
      .user-desc {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

.settings-content {
  padding: 0 16px;
  
  .settings-group {
    margin-bottom: 20px;
    
    .group-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
      padding-left: 4px;
    }
    
    :deep(.van-cell-group) {
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      
      .van-cell {
        padding: 16px;
        
        &:active {
          background: #f8f9fa;
        }
        
        .van-cell__title {
          font-size: 16px;
          color: #333;
        }
        
        .cell-value {
          font-size: 14px;
          color: #666;
          
          &.sync-status {
            &.synced {
              color: #07c160;
            }
          }
        }
      }
    }
  }
}

.logout-section {
  padding: 20px 16px;
  
  .logout-btn {
    height: 48px;
    font-size: 16px;
    font-weight: 500;
  }
}

.privacy-settings, .sync-settings {
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }
  }
}

.privacy-content {
  padding: 20px;
  
  :deep(.van-cell-group) {
    .van-cell {
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

.sync-content {
  padding: 20px;
  
  .sync-status {
    text-align: center;
    padding: 20px 0;
    margin-bottom: 20px;
    
    h4 {
      font-size: 18px;
      color: #333;
      margin: 12px 0 8px;
    }
    
    p {
      font-size: 14px;
      color: #666;
    }
  }
  
  :deep(.van-cell-group) {
    border-radius: 8px;
    overflow: hidden;
    
    .van-cell {
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
}

// 老人模式适配
:global(.elder-mode) .settings-container {
  .user-name {
    font-size: 20px !important;
  }
  
  .group-title {
    font-size: 18px !important;
  }
  
  :deep(.van-cell) {
    .van-cell__title {
      font-size: 18px !important;
    }
    
    .cell-value {
      font-size: 16px !important;
    }
  }
}
</style>