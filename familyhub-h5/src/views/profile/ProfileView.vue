<template>
  <div class="profile-container">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="个人中心"
      left-arrow
      @click-left="$router.back()"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="setting-o" size="20" @click="navigateToSettings" />
      </template>
    </van-nav-bar>

    <!-- 用户信息卡片 -->
    <div class="user-section">
      <div class="user-card">
        <div class="user-avatar">
          <van-avatar size="80" :src="userInfo.avatar">
            {{ userInfo.name.charAt(0) }}
          </van-avatar>
          <div class="avatar-edit" @click="editAvatar">
            <van-icon name="photograph" size="16" color="white" />
          </div>
        </div>

        <div class="user-info">
          <h3 class="user-name">{{ userInfo.name }}</h3>
          <p class="user-role">{{ userInfo.role }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-number">{{ userStats.familyMembers }}</span>
              <span class="stat-label">家庭成员</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userStats.totalRecords }}</span>
              <span class="stat-label">记录数</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ userStats.joinDays }}</span>
              <span class="stat-label">加入天数</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷功能 -->
    <div class="quick-functions">
      <div class="function-grid">
        <div class="function-item" @click="navigateTo('/finance')">
          <div class="function-icon finance">
            <van-icon name="balance-list-o" size="24" />
          </div>
          <span>我的账单</span>
        </div>
        <div class="function-item" @click="navigateTo('/photos')">
          <div class="function-icon photos">
            <van-icon name="photo-o" size="24" />
          </div>
          <span>我的相册</span>
        </div>
        <div class="function-item" @click="navigateTo('/schedule')">
          <div class="function-icon schedule">
            <van-icon name="calendar-o" size="24" />
          </div>
          <span>我的计划</span>
        </div>
        <div class="function-item" @click="showComingSoon">
          <div class="function-icon backup">
            <van-icon name="cloud-o" size="24" />
          </div>
          <span>数据备份</span>
        </div>
      </div>
    </div>

    <!-- 功能菜单 -->
    <div class="menu-section">
      <!-- 家庭管理 -->
      <div class="menu-group">
        <h4 class="group-title">家庭管理</h4>
        <van-cell-group inset>
          <van-cell
            title="家庭成员"
            icon="friends-o"
            is-link
            @click="navigateTo('/family')"
          >
            <template #value>
              <span class="cell-value">{{ userStats.familyMembers }}人</span>
            </template>
          </van-cell>
          <van-cell
            title="家庭相册"
            icon="photo-o"
            is-link
            @click="navigateTo('/photos')"
          >
            <template #value>
              <span class="cell-value">{{ userStats.totalPhotos }}张</span>
            </template>
          </van-cell>
          <van-cell
            title="邀请成员"
            icon="add-square"
            is-link
            @click="inviteMember"
          />
        </van-cell-group>
      </div>

      <!-- 数据统计 -->
      <div class="menu-group">
        <h4 class="group-title">数据统计</h4>
        <van-cell-group inset>
          <van-cell
            title="财务统计"
            icon="chart-trending-o"
            is-link
            @click="navigateTo('/finance/statistics')"
          >
            <template #value>
              <span class="cell-value">本月支出 ¥{{ monthlyExpense }}</span>
            </template>
          </van-cell>
          <van-cell
            title="活动统计"
            icon="bar-chart-o"
            is-link
            @click="showComingSoon"
          >
            <template #value>
              <span class="cell-value">本月{{ monthlyActivities }}次</span>
            </template>
          </van-cell>
          <van-cell
            title="数据导出"
            icon="down"
            is-link
            @click="exportData"
          />
        </van-cell-group>
      </div>

      <!-- 个人设置 -->
      <div class="menu-group">
        <h4 class="group-title">个人设置</h4>
        <van-cell-group inset>
          <van-cell
            title="个人信息"
            icon="user-o"
            is-link
            @click="editProfile"
          />
          <van-cell
            title="隐私设置"
            icon="shield-o"
            is-link
            @click="navigateTo('/settings/privacy')"
          />
          <van-cell
            title="通知设置"
            icon="bell"
            is-link
            @click="navigateTo('/settings/notification')"
          />
          <van-cell
            title="老人模式"
            icon="eye-o"
          >
            <template #right-icon>
              <van-switch
                v-model="isElderMode"
                @change="toggleElderMode"
                size="20px"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 帮助与反馈 -->
      <div class="menu-group">
        <h4 class="group-title">帮助与反馈</h4>
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
            title="关于我们"
            icon="info-o"
            is-link
            @click="showAbout"
          />
          <van-cell
            title="版本信息"
            icon="upgrade"
            is-link
            @click="showVersion"
          >
            <template #value>
              <span class="cell-value">v1.0.0</span>
            </template>
          </van-cell>
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

    <!-- 头像编辑弹窗 -->
    <van-action-sheet
      v-model:show="showAvatarSheet"
      :actions="avatarActions"
      @select="onAvatarSelect"
      cancel-text="取消"
      description="选择头像来源"
    />

    <!-- 个人信息编辑弹窗 -->
    <van-popup v-model:show="showEditProfile" position="bottom" :style="{ height: '60%' }">
      <div class="edit-profile">
        <div class="popup-header">
          <van-button type="primary" size="small" text @click="showEditProfile = false">
            取消
          </van-button>
          <h3>编辑个人信息</h3>
          <van-button type="primary" size="small" @click="saveProfile">
            保存
          </van-button>
        </div>

        <div class="edit-form">
          <van-field
            v-model="editForm.name"
            label="姓名"
            placeholder="请输入姓名"
            clearable
          />
          <van-field
            v-model="editForm.phone"
            label="手机号"
            placeholder="请输入手机号"
            type="tel"
            clearable
          />
          <van-field
            v-model="editForm.email"
            label="邮箱"
            placeholder="请输入邮箱"
            type="email"
            clearable
          />
          <van-field
            v-model="editForm.birthday"
            label="生日"
            placeholder="请选择生日"
            readonly
            @click="showDatePicker = true"
          />
          <van-field
            v-model="editForm.bio"
            label="个人简介"
            placeholder="请输入个人简介"
            type="textarea"
            rows="3"
            maxlength="100"
            show-word-limit
          />
        </div>
      </div>
    </van-popup>

    <!-- 日期选择器 -->
    <!-- <van-date-picker
      v-model:show="showDatePicker"
      v-model="selectedDate"
      title="选择生日"
      @confirm="onDateConfirm"
    /> -->
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
const showAvatarSheet = ref(false)
const showEditProfile = ref(false)
const showDatePicker = ref(false)
const selectedDate = ref(new Date())

// 用户信息
const userInfo = ref({
  name: '张三',
  avatar: '',
  role: '家庭管理员',
  phone: '138****8888',
  email: 'zhangsan@example.com',
  birthday: '1990-01-01',
  bio: '热爱生活，享受家庭时光'
})

// 用户统计
const userStats = ref({
  familyMembers: 4,
  totalRecords: 156,
  joinDays: 365,
  totalPhotos: 89,
})

// 月度数据
const monthlyExpense = ref(2456.80)
const monthlyActivities = ref(23)

// 编辑表单
const editForm = ref({
  name: userInfo.value.name,
  phone: userInfo.value.phone,
  email: userInfo.value.email,
  birthday: userInfo.value.birthday,
  bio: userInfo.value.bio
})

// 计算属性
const isElderMode = computed({
  get: () => settingsStore.isElderMode,
  set: (value) => settingsStore.setElderMode(value)
})

// 头像操作选项
const avatarActions = [
  { name: '拍照', value: 'camera' },
  { name: '从相册选择', value: 'gallery' },
  { name: '查看头像', value: 'view' }
]

// 方法
const navigateTo = (path: string) => {
  router.push(path)
}

const navigateToSettings = () => {
  router.push('/settings')
}

const editAvatar = () => {
  showAvatarSheet.value = true
}

const onAvatarSelect = (action: any) => {
  showAvatarSheet.value = false
  switch (action.value) {
    case 'camera':
      showToast('拍照功能开发中')
      break
    case 'gallery':
      showToast('相册选择功能开发中')
      break
    case 'view':
      showToast('查看头像功能开发中')
      break
  }
}

const editProfile = () => {
  editForm.value = {
    name: userInfo.value.name,
    phone: userInfo.value.phone,
    email: userInfo.value.email,
    birthday: userInfo.value.birthday,
    bio: userInfo.value.bio
  }
  showEditProfile.value = true
}

const saveProfile = () => {
  userInfo.value = {
    ...userInfo.value,
    ...editForm.value
  }
  showEditProfile.value = false
  showToast('保存成功')
}

const onDateConfirm = (date: Date) => {
  editForm.value.birthday = dayjs(date).format('YYYY-MM-DD')
  showDatePicker.value = false
}

const inviteMember = () => {
  showDialog({
    title: '邀请家庭成员',
    message: '分享邀请码给家人，让他们加入您的家庭',
    confirmButtonText: '复制邀请码',
    cancelButtonText: '取消'
  }).then(() => {
    showToast('邀请码已复制到剪贴板')
  })
}

const exportData = () => {
  showDialog({
    title: '数据导出',
    message: '将导出您的所有数据，包括财务记录、照片等',
    confirmButtonText: '开始导出',
    cancelButtonText: '取消'
  }).then(() => {
    showToast('数据导出功能开发中')
  })
}

const toggleElderMode = (value: boolean) => {
  settingsStore.setElderMode(value)
  showToast(value ? '已开启老人模式' : '已关闭老人模式')
}

const showComingSoon = () => {
  showToast('功能开发中，敬请期待')
}

const showHelp = () => {
  showDialog({
    title: '使用帮助',
    message: '如需帮助，请查看用户手册或联系客服',
    confirmButtonText: '联系客服',
    cancelButtonText: '查看手册'
  }).then(() => {
    showToast('客服电话：400-123-4567')
  }).catch(() => {
    showToast('用户手册功能开发中')
  })
}

const showFeedback = () => {
  showDialog({
    title: '意见反馈',
    message: '您的意见对我们很重要，请选择反馈方式',
    confirmButtonText: '在线反馈',
    cancelButtonText: '邮件反馈'
  }).then(() => {
    showToast('在线反馈功能开发中')
  }).catch(() => {
    showToast('请发送邮件至：feedback@familyhub.com')
  })
}

const showAbout = () => {
  showDialog({
    title: 'FamilyHub 家庭管家',
    message: '版本：v1.0.0\n\n一个专为家庭设计的生活管理应用，帮助您更好地管理家庭财务、照片和计划。\n\n© 2024 FamilyHub Team',
    confirmButtonText: '我知道了'
  })
}

const showVersion = () => {
  showDialog({
    title: '版本信息',
    message: '当前版本：v1.0.0\n发布时间：2024-03-15\n\n更新内容：\n• 全新的用户界面设计\n• 优化了性能和稳定性\n• 新增老人模式支持',
    confirmButtonText: '检查更新',
    cancelButtonText: '我知道了'
  }).then(() => {
    showToast('已是最新版本')
  })
}

const logout = () => {
  showConfirmDialog({
    title: '退出登录',
    message: '确定要退出登录吗？',
  }).then(() => {
    // 清除用户数据
    showToast('已退出登录')
    router.replace('/login')
  }).catch(() => {
    // 取消退出
  })
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 80px;
}

.user-section {
  padding: 16px;

  .user-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    text-align: center;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);

    .user-avatar {
      position: relative;
      display: inline-block;
      margin-bottom: 16px;

      .avatar-edit {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 28px;
        height: 28px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        backdrop-filter: blur(10px);
      }
    }

    .user-info {
      .user-name {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .user-role {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 20px;
      }

      .user-stats {
        display: flex;
        justify-content: space-around;

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
  }
}

.quick-functions {
  padding: 0 16px 16px;

  .function-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

    .function-item {
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

      .function-icon {
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

        &.backup {
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
}

.menu-section {
  padding: 0 16px;

  .menu-group {
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

.edit-profile {
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

  .edit-form {
    padding: 20px;

    :deep(.van-field) {
      margin-bottom: 16px;
      border-radius: 8px;
      background: #f8f9fa;

      .van-field__control {
        font-size: 16px;
      }
    }
  }
}

// 老人模式适配
:global(.elder-mode) .profile-container {
  .user-name {
    font-size: 28px !important;
  }

  .stat-number {
    font-size: 24px !important;
  }

  .function-item span {
    font-size: 14px !important;
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
