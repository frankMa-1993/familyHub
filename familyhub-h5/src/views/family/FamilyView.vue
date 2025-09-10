<template>
  <div class="family-container">
    <!-- 顶部导航 -->
    <van-nav-bar 
      title="家庭成员" 
      left-arrow 
      @click-left="$router.back()"
      fixed
      placeholder
    >
      <template #right>
        <van-icon name="plus" size="20" @click="showInviteSheet = true" />
      </template>
    </van-nav-bar>

    <!-- 家庭信息卡片 -->
    <div class="family-header">
      <div class="family-card">
        <div class="family-info">
          <div class="family-avatar">
            <van-image
              :src="familyInfo.avatar"
              width="60"
              height="60"
              round
              fit="cover"
            >
              <template #error>
                <div class="avatar-placeholder">
                  <van-icon name="home-o" size="24" color="#666" />
                </div>
              </template>
            </van-image>
          </div>
          <div class="family-details">
            <h3 class="family-name">{{ familyInfo.name }}</h3>
            <p class="family-desc">{{ familyInfo.description }}</p>
            <div class="family-stats">
              <span class="stat-item">
                <van-icon name="friends-o" size="14" />
                {{ familyMembers.length }}位成员
              </span>
              <span class="stat-item">
                <van-icon name="calendar-o" size="14" />
                创建于{{ familyInfo.createDate }}
              </span>
            </div>
          </div>
        </div>
        <div class="family-actions">
          <van-button 
            type="primary" 
            size="small" 
            round 
            @click="editFamily"
            icon="edit"
          >
            编辑
          </van-button>
        </div>
      </div>
    </div>

    <!-- 成员列表 -->
    <div class="members-section">
      <div class="section-header">
        <h4 class="section-title">家庭成员 ({{ familyMembers.length }})</h4>
        <van-button 
          type="primary" 
          size="mini" 
          plain 
          @click="showInviteSheet = true"
        >
          邀请成员
        </van-button>
      </div>

      <div class="members-list">
        <div 
          v-for="member in familyMembers" 
          :key="member.id"
          class="member-card"
          @click="viewMemberDetail(member)"
        >
          <div class="member-avatar">
            <van-avatar :size="48" :src="member.avatar">
              {{ member.name.charAt(0) }}
            </van-avatar>
            <div v-if="member.isOnline" class="online-indicator"></div>
          </div>
          
          <div class="member-info">
            <div class="member-name">
              {{ member.name }}
              <van-tag 
                v-if="member.role === 'admin'" 
                type="primary" 
                size="mini"
              >
                管理员
              </van-tag>
              <van-tag 
                v-else-if="member.role === 'elder'" 
                type="warning" 
                size="mini"
              >
                长辈
              </van-tag>
            </div>
            <div class="member-desc">{{ member.relationship }}</div>
            <div class="member-stats">
              <span class="stat-item">
                <van-icon name="balance-list-o" size="12" />
                {{ member.recordCount }}条记录
              </span>
              <span class="stat-item">
                <van-icon name="clock-o" size="12" />
                {{ member.lastActive }}
              </span>
            </div>
          </div>
          
          <div class="member-actions">
            <van-icon 
              name="more-o" 
              size="20" 
              @click.stop="showMemberActions(member)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 权限管理 -->
    <div class="permissions-section">
      <div class="section-header">
        <h4 class="section-title">权限管理</h4>
        <van-button 
          type="default" 
          size="mini" 
          plain 
          @click="showPermissionSettings = true"
        >
          设置
        </van-button>
      </div>

      <van-cell-group inset>
        <van-cell 
          title="财务管理权限" 
          icon="balance-list-o"
          is-link
          @click="manageFinancePermission"
        >
          <template #value>
            <span class="permission-count">{{ financePermissionCount }}人</span>
          </template>
        </van-cell>
        <van-cell 
          title="相册管理权限" 
          icon="photo-o"
          is-link
          @click="managePhotoPermission"
        >
          <template #value>
            <span class="permission-count">{{ photoPermissionCount }}人</span>
          </template>
        </van-cell>
        <van-cell 
          title="计划管理权限" 
          icon="calendar-o"
          is-link
          @click="manageSchedulePermission"
        >
          <template #value>
            <span class="permission-count">{{ schedulePermissionCount }}人</span>
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 家庭统计 -->
    <div class="statistics-section">
      <div class="section-header">
        <h4 class="section-title">家庭统计</h4>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon finance">
            <van-icon name="balance-list-o" size="24" />
          </div>
          <div class="stat-info">
            <div class="stat-number">¥{{ familyStats.totalExpense }}</div>
            <div class="stat-label">本月支出</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon photos">
            <van-icon name="photo-o" size="24" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ familyStats.totalPhotos }}</div>
            <div class="stat-label">家庭照片</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon events">
            <van-icon name="calendar-o" size="24" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ familyStats.totalEvents }}</div>
            <div class="stat-label">计划事件</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon records">
            <van-icon name="records" size="24" />
          </div>
          <div class="stat-info">
            <div class="stat-number">{{ familyStats.totalRecords }}</div>
            <div class="stat-label">总记录数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 邀请成员弹窗 -->
    <van-action-sheet
      v-model:show="showInviteSheet"
      :actions="inviteActions"
      @select="onInviteSelect"
      cancel-text="取消"
      description="邀请新成员加入家庭"
    />

    <!-- 成员操作弹窗 -->
    <van-action-sheet
      v-model:show="showMemberActionSheet"
      :actions="memberActions"
      @select="onMemberActionSelect"
      cancel-text="取消"
      :description="`管理 ${selectedMember?.name}`"
    />

    <!-- 权限设置弹窗 -->
    <van-popup 
      v-model:show="showPermissionSettings" 
      position="bottom" 
      :style="{ height: '70%' }"
    >
      <div class="permission-settings">
        <div class="popup-header">
          <van-button type="primary" size="small" text @click="showPermissionSettings = false">
            取消
          </van-button>
          <h3>权限设置</h3>
          <van-button type="primary" size="small" @click="savePermissions">
            保存
          </van-button>
        </div>
        
        <div class="permission-content">
          <div class="permission-group" v-for="permission in permissions" :key="permission.key">
            <h4 class="permission-title">{{ permission.name }}</h4>
            <div class="permission-members">
              <div 
                v-for="member in familyMembers" 
                :key="member.id"
                class="permission-member"
              >
                <div class="member-info">
                  <van-avatar :size="32" :src="member.avatar">
                    {{ member.name.charAt(0) }}
                  </van-avatar>
                  <span class="member-name">{{ member.name }}</span>
                </div>
                <van-switch 
                  v-model="permission.members[member.id]"
                  size="20px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 家庭编辑弹窗 -->
    <van-popup v-model:show="showEditFamily" position="bottom" :style="{ height: '50%' }">
      <div class="edit-family">
        <div class="popup-header">
          <van-button type="primary" size="small" text @click="showEditFamily = false">
            取消
          </van-button>
          <h3>编辑家庭信息</h3>
          <van-button type="primary" size="small" @click="saveFamilyInfo">
            保存
          </van-button>
        </div>
        
        <div class="edit-form">
          <van-field
            v-model="editFamilyForm.name"
            label="家庭名称"
            placeholder="请输入家庭名称"
            clearable
          />
          <van-field
            v-model="editFamilyForm.description"
            label="家庭描述"
            placeholder="请输入家庭描述"
            type="textarea"
            rows="3"
            maxlength="100"
            show-word-limit
          />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog, showDialog } from 'vant'

const router = useRouter()

// 响应式数据
const showInviteSheet = ref(false)
const showMemberActionSheet = ref(false)
const showPermissionSettings = ref(false)
const showEditFamily = ref(false)
const selectedMember = ref<any>(null)

// 家庭信息
const familyInfo = ref({
  name: '张家大院',
  description: '温馨和睦的大家庭',
  avatar: '',
  createDate: '2023年3月'
})

// 家庭成员
const familyMembers = ref([
  {
    id: 1,
    name: '张爸爸',
    avatar: '',
    relationship: '父亲',
    role: 'admin',
    isOnline: true,
    recordCount: 45,
    lastActive: '刚刚',
    permissions: ['finance', 'photos', 'schedule']
  },
  {
    id: 2,
    name: '张妈妈',
    avatar: '',
    relationship: '母亲',
    role: 'elder',
    isOnline: true,
    recordCount: 38,
    lastActive: '5分钟前',
    permissions: ['photos', 'schedule']
  },
  {
    id: 3,
    name: '张小明',
    avatar: '',
    relationship: '儿子',
    role: 'member',
    isOnline: false,
    recordCount: 23,
    lastActive: '2小时前',
    permissions: ['photos']
  },
  {
    id: 4,
    name: '张小红',
    avatar: '',
    relationship: '女儿',
    role: 'member',
    isOnline: true,
    recordCount: 15,
    lastActive: '刚刚',
    permissions: ['photos', 'schedule']
  }
])

// 家庭统计
const familyStats = ref({
  totalExpense: 8456.80,
  totalPhotos: 234,
  totalEvents: 18,
  totalRecords: 121
})

// 权限设置
const permissions = ref([
  {
    key: 'finance',
    name: '财务管理',
    members: {
      1: true,
      2: false,
      3: false,
      4: false
    }
  },
  {
    key: 'photos',
    name: '相册管理',
    members: {
      1: true,
      2: true,
      3: true,
      4: true
    }
  },
  {
    key: 'schedule',
    name: '计划管理',
    members: {
      1: true,
      2: true,
      3: false,
      4: true
    }
  }
])

// 编辑表单
const editFamilyForm = ref({
  name: familyInfo.value.name,
  description: familyInfo.value.description
})

// 计算属性
const financePermissionCount = computed(() => {
  return Object.values(permissions.value[0].members).filter(Boolean).length
})

const photoPermissionCount = computed(() => {
  return Object.values(permissions.value[1].members).filter(Boolean).length
})

const schedulePermissionCount = computed(() => {
  return Object.values(permissions.value[2].members).filter(Boolean).length
})

// 邀请操作选项
const inviteActions = [
  { name: '生成邀请码', value: 'code' },
  { name: '分享邀请链接', value: 'link' },
  { name: '扫码邀请', value: 'qr' }
]

// 成员操作选项
const memberActions = computed(() => {
  const actions = [
    { name: '查看详情', value: 'detail' },
    { name: '编辑信息', value: 'edit' },
    { name: '权限设置', value: 'permission' }
  ]
  
  if (selectedMember.value?.role !== 'admin') {
    actions.push({ name: '移除成员', value: 'remove', color: '#ee0a24' })
  }
  
  return actions
})

// 方法
const editFamily = () => {
  editFamilyForm.value = {
    name: familyInfo.value.name,
    description: familyInfo.value.description
  }
  showEditFamily.value = true
}

const saveFamilyInfo = () => {
  familyInfo.value = {
    ...familyInfo.value,
    ...editFamilyForm.value
  }
  showEditFamily.value = false
  showToast('保存成功')
}

const viewMemberDetail = (member: any) => {
  showDialog({
    title: member.name,
    message: `关系：${member.relationship}\n角色：${member.role === 'admin' ? '管理员' : member.role === 'elder' ? '长辈' : '成员'}\n记录数：${member.recordCount}\n最后活跃：${member.lastActive}`,
    confirmButtonText: '我知道了'
  })
}

const showMemberActions = (member: any) => {
  selectedMember.value = member
  showMemberActionSheet.value = true
}

const onInviteSelect = (action: any) => {
  showInviteSheet.value = false
  switch (action.value) {
    case 'code':
      showDialog({
        title: '邀请码',
        message: '邀请码：FH2024\n\n请将此邀请码分享给家人',
        confirmButtonText: '复制邀请码'
      }).then(() => {
        showToast('邀请码已复制')
      })
      break
    case 'link':
      showToast('邀请链接已复制到剪贴板')
      break
    case 'qr':
      showToast('二维码邀请功能开发中')
      break
  }
}

const onMemberActionSelect = (action: any) => {
  showMemberActionSheet.value = false
  const member = selectedMember.value
  
  switch (action.value) {
    case 'detail':
      viewMemberDetail(member)
      break
    case 'edit':
      showToast('编辑成员信息功能开发中')
      break
    case 'permission':
      showPermissionSettings.value = true
      break
    case 'remove':
      showConfirmDialog({
        title: '移除成员',
        message: `确定要移除 ${member.name} 吗？`,
      }).then(() => {
        const index = familyMembers.value.findIndex(m => m.id === member.id)
        if (index > -1) {
          familyMembers.value.splice(index, 1)
          showToast('成员已移除')
        }
      })
      break
  }
}

const manageFinancePermission = () => {
  showPermissionSettings.value = true
}

const managePhotoPermission = () => {
  showPermissionSettings.value = true
}

const manageSchedulePermission = () => {
  showPermissionSettings.value = true
}

const savePermissions = () => {
  showPermissionSettings.value = false
  showToast('权限设置已保存')
}

onMounted(() => {
  // 初始化数据
})
</script>

<style lang="scss" scoped>
.family-container {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 80px;
}

.family-header {
  padding: 16px;
  
  .family-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 20px;
    color: white;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    
    .family-info {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .family-avatar {
        margin-right: 16px;
        
        .avatar-placeholder {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
      
      .family-details {
        flex: 1;
        
        .family-name {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .family-desc {
          font-size: 14px;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        
        .family-stats {
          display: flex;
          gap: 16px;
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;
            opacity: 0.9;
          }
        }
      }
    }
    
    .family-actions {
      text-align: right;
    }
  }
}

.members-section, .permissions-section, .statistics-section {
  padding: 0 16px 20px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
    }
  }
}

.members-list {
  .member-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.2s;
    
    &:active {
      transform: scale(0.98);
    }
    
    .member-avatar {
      position: relative;
      margin-right: 12px;
      
      .online-indicator {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 12px;
        height: 12px;
        background: #07c160;
        border: 2px solid white;
        border-radius: 50%;
      }
    }
    
    .member-info {
      flex: 1;
      
      .member-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
        color: #333;
        margin-bottom: 4px;
      }
      
      .member-desc {
        font-size: 14px;
        color: #666;
        margin-bottom: 6px;
      }
      
      .member-stats {
        display: flex;
        gap: 12px;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #999;
        }
      }
    }
    
    .member-actions {
      padding: 8px;
      color: #666;
    }
  }
}

.permissions-section {
  :deep(.van-cell-group) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .van-cell {
      padding: 16px;
      
      .permission-count {
        font-size: 14px;
        color: #666;
      }
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 16px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      
      &.finance {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }
      
      &.photos {
        background: linear-gradient(135deg, #f093fb, #f5576c);
        color: white;
      }
      
      &.events {
        background: linear-gradient(135deg, #4facfe, #00f2fe);
        color: white;
      }
      
      &.records {
        background: linear-gradient(135deg, #43e97b, #38f9d7);
        color: white;
      }
    }
    
    .stat-info {
      .stat-number {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 4px;
      }
      
      .stat-label {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.permission-settings, .edit-family {
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

.permission-content {
  padding: 20px;
  
  .permission-group {
    margin-bottom: 24px;
    
    .permission-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
    }
    
    .permission-members {
      .permission-member {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;
        
        &:last-child {
          border-bottom: none;
        }
        
        .member-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .member-name {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }
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

// 老人模式适配
:global(.elder-mode) .family-container {
  .family-name {
    font-size: 24px !important;
  }
  
  .member-name {
    font-size: 18px !important;
  }
  
  .section-title {
    font-size: 18px !important;
  }
  
  .stat-number {
    font-size: 20px !important;
  }
}
</style>