import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入Vant4组件库
import Vant from 'vant'
import 'vant/lib/index.css'

// 引入移动端触摸模拟器（用于桌面端调试）
import '@vant/touch-emulator'

// 引入全局样式
import './styles/global.scss'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

app.mount('#app')