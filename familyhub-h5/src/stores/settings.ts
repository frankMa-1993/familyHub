import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  // 老人模式状态
  const isElderMode = ref(false)
  
  // 主题设置
  const theme = ref<'light' | 'dark'>('light')
  
  // 语言设置
  const language = ref<'zh-CN' | 'en-US'>('zh-CN')
  
  // 切换老人模式
  const toggleElderMode = () => {
    isElderMode.value = !isElderMode.value
    // 保存到本地存储
    localStorage.setItem('elderMode', String(isElderMode.value))
  }
  
  // 设置主题
  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }
  
  // 设置语言
  const setLanguage = (newLanguage: 'zh-CN' | 'en-US') => {
    language.value = newLanguage
    localStorage.setItem('language', newLanguage)
  }
  
  // 初始化设置（从本地存储读取）
  const initSettings = () => {
    const savedElderMode = localStorage.getItem('elderMode')
    if (savedElderMode !== null) {
      isElderMode.value = savedElderMode === 'true'
    }
    
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      theme.value = savedTheme
    }
    
    const savedLanguage = localStorage.getItem('language') as 'zh-CN' | 'en-US'
    if (savedLanguage) {
      language.value = savedLanguage
    }
  }
  
  return {
    isElderMode,
    theme,
    language,
    toggleElderMode,
    setTheme,
    setLanguage,
    initSettings
  }
})