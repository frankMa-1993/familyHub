import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/HomeView.vue'),
    meta: {
      title: '家庭管家',
      requiresAuth: true,
      showTabbar: true,
    },
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/views/finance/FinanceView.vue'),
    meta: {
      title: '财务管理',
      requiresAuth: true,
      showTabbar: true,
    },
  },
  {
    path: '/finance/add',
    name: 'FinanceAdd',
    component: () => import('@/views/finance/FinanceAddView.vue'),
    meta: {
      title: '记账',
      requiresAuth: true,
    },
  },
  {
    path: '/finance/statistics',
    name: 'FinanceStatistics',
    component: () => import('@/views/finance/FinanceStatisticsView.vue'),
    meta: {
      title: '财务统计',
      requiresAuth: true,
    },
  },
  {
    path: '/photos',
    name: 'Photos',
    component: () => import('@/views/photos/PhotosView.vue'),
    meta: {
      title: '照片资料',
      requiresAuth: true,
      showTabbar: true,
    },
  },
  {
    path: '/photos/upload',
    name: 'PhotosUpload',
    component: () => import('@/views/photos/PhotosUploadView.vue'),
    meta: {
      title: '上传照片',
      requiresAuth: true,
    },
  },
  {
    path: '/schedule',
    name: 'Schedule',
    component: () => import('@/views/schedule/ScheduleView.vue'),
    meta: {
      title: '家庭计划',
      requiresAuth: true,
      showTabbar: true,
    },
  },
  {
    path: '/schedule/add',
    name: 'ScheduleAdd',
    component: () => import('@/views/schedule/ScheduleAddView.vue'),
    meta: {
      title: '添加计划',
      requiresAuth: true,
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/profile/ProfileView.vue'),
    meta: {
      title: '个人中心',
      requiresAuth: true,
      showTabbar: true,
    },
  },
  {
    path: '/family',
    name: 'Family',
    component: () => import('@/views/family/FamilyView.vue'),
    meta: {
      title: '家庭成员',
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: {
      title: '设置',
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - FamilyHub`
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    // 这里应该检查用户是否已登录
    // 暂时跳过登录检查，后续会在store中实现
    const isLoggedIn = localStorage.getItem('token')
    if (!isLoggedIn && to.name !== 'Login') {
      next({ name: 'Login' })
      return
    }
  }

  next()
})

export default router
