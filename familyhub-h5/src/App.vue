<template>
  <div id="app" :class="{ 'elder-mode': isElderMode }">
    <router-view />
    
    <!-- 底部导航栏 -->
    <van-tabbar 
      v-if="showTabbar" 
      v-model="activeTab" 
      @change="onTabChange"
      fixed
      placeholder
    >
      <van-tabbar-item icon="home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="balance-list-o" to="/finance">财务</van-tabbar-item>
      <van-tabbar-item icon="photo-o" to="/photos">照片</van-tabbar-item>
      <van-tabbar-item icon="calendar-o" to="/schedule">计划</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const settingsStore = useSettingsStore()

const activeTab = ref(0)

// 计算属性：是否显示底部导航栏
const showTabbar = computed(() => {
  return route.meta?.showTabbar === true
})

// 计算属性：是否启用老人模式
const isElderMode = computed(() => {
  return settingsStore.isElderMode
})

// 监听路由变化，更新活跃的标签页
watch(() => route.path, (newPath) => {
  const tabRoutes = ['/home', '/finance', '/photos', '/schedule', '/profile']
  const index = tabRoutes.findIndex(path => newPath.startsWith(path))
  if (index !== -1) {
    activeTab.value = index
  }
}, { immediate: true })

// 标签页切换事件
const onTabChange = (index: number) => {
  activeTab.value = index
}
</script>

<style lang="scss">
#app {
  min-height: 100vh;
  background-color: var(--van-background-color-light);
}

// 自定义底部导航栏样式
.van-tabbar {
  background-color: var(--van-background-color);
  border-top: 1px solid var(--van-border-color);
  
  .van-tabbar-item {
    color: var(--van-text-color-2);
    
    &--active {
      color: var(--van-primary-color);
    }
  }
}

// 老人模式下的底部导航栏
.elder-mode .van-tabbar {
  height: 70px;
  
  .van-tabbar-item {
    font-size: 14px;
    
    .van-icon {
      font-size: 24px;
    }
  }
}
</style>