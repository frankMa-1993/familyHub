// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  phone: string
  avatar?: string
  nickname: string
  familyId: string
  role: 'admin' | 'member'
  createdAt: string
  updatedAt: string
}

// 家庭相关类型
export interface Family {
  id: string
  name: string
  description?: string
  avatar?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// 家庭成员类型
export interface FamilyMember {
  id: string
  userId: string
  familyId: string
  role: 'admin' | 'member'
  nickname: string
  avatar?: string
  permissions: string[]
  joinedAt: string
}

// 财务记录类型
export interface FinanceRecord {
  id: string
  familyId: string
  userId: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

// 财务分类类型
export interface FinanceCategory {
  id: string
  name: string
  icon: string
  color: string
  type: 'income' | 'expense'
  isDefault: boolean
}

// 照片资料类型
export interface Photo {
  id: string
  familyId: string
  userId: string
  url: string
  thumbnail?: string
  title?: string
  description?: string
  tags?: string[]
  location?: string
  takenAt?: string
  createdAt: string
  updatedAt: string
}

// 家庭计划类型
export interface Schedule {
  id: string
  familyId: string
  userId: string
  title: string
  description?: string
  type: 'event' | 'reminder' | 'todo'
  startTime: string
  endTime?: string
  isAllDay: boolean
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  remindBefore?: number // 提前提醒分钟数
  participants?: string[] // 参与成员ID列表
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  success: boolean
}

// 分页响应类型
export interface PaginatedResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// 登录表单类型
export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

// 注册表单类型
export interface RegisterForm {
  username: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  nickname: string
}

// 路由元信息类型
export interface RouteMeta {
  title?: string
  requiresAuth?: boolean
  showTabbar?: boolean
  keepAlive?: boolean
}