<template>
  <div class="login-container">
    <!-- 顶部装饰区域 -->
    <div class="header-section">
      <div class="logo-area">
        <div class="logo-icon">
          <van-icon name="home-o" size="48" color="white" />
        </div>
        <h1 class="app-title">FamilyHub</h1>
        <p class="app-subtitle">家庭管家，让生活更美好</p>
      </div>
    </div>

    <!-- 登录表单区域 -->
    <div class="form-section">
      <div class="form-container">
        <h2 class="form-title">欢迎回来</h2>
        <p class="form-subtitle">请登录您的账户</p>

        <van-form @submit="handleLogin" ref="formRef">
          <!-- 手机号输入 -->
          <van-field v-model="loginForm.phone" name="phone" label="手机号" placeholder="请输入手机号" :rules="phoneRules"
            left-icon="phone-o" maxlength="11" type="tel" clearable />

          <!-- 密码输入 -->
          <van-field v-model="loginForm.password" name="password" label="密码" placeholder="请输入密码" :rules="passwordRules"
            left-icon="lock" :type="showPassword ? 'text' : 'password'"
            :right-icon="showPassword ? 'eye-o' : 'closed-eye'" @click-right-icon="showPassword = !showPassword"
            clearable />

          <!-- 记住密码和忘记密码 -->
          <div class="form-options">
            <van-checkbox v-model="rememberPassword">记住密码</van-checkbox>
            <van-button type="primary" size="mini" plain @click="handleForgotPassword">
              忘记密码？
            </van-button>
          </div>

          <!-- 登录按钮 -->
          <div class="form-actions">
            <van-button type="primary" size="large" block round :loading="loginLoading" native-type="submit"
              class="login-btn">
              {{ loginLoading ? '登录中...' : '登录' }}
            </van-button>
          </div>
        </van-form>

        <!-- 其他登录方式 -->
        <div class="other-login">
          <div class="divider">
            <span>其他登录方式</span>
          </div>
          <div class="social-login">
            <div class="social-item" @click="handleWechatLogin">
              <van-icon name="wechat" size="24" color="#07C160" />
              <span>微信</span>
            </div>
            <div class="social-item" @click="handleQQLogin">
              <van-icon name="qq" size="24" color="#1296DB" />
              <span>QQ</span>
            </div>
          </div>
        </div>

        <!-- 注册链接 -->
        <div class="register-link">
          <span>还没有账户？</span>
          <van-button type="primary" size="mini" plain @click="navigateToRegister">
            立即注册
          </van-button>
        </div>
      </div>
    </div>

    <!-- 底部协议 -->
    <div class="footer-section">
      <div class="agreement">
        <van-checkbox v-model="agreeTerms" icon-size="14">
          我已阅读并同意
        </van-checkbox>
        <van-button type="primary" size="mini" plain @click="showTerms">
          《用户协议》
        </van-button>
        <span>和</span>
        <van-button type="primary" size="mini" plain @click="showPrivacy">
          《隐私政策》
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, cellGroupProps } from 'vant'
import type { FormInstance } from 'vant'

const router = useRouter()
const formRef = ref<FormInstance>()

// 表单数据
const loginForm = reactive({
  phone: '13188888888',
  password: '123456'
})

// 表单状态
const showPassword = ref(false)
const rememberPassword = ref(false)
const agreeTerms = ref(false)
const loginLoading = ref(false)

// 表单验证规则
const phoneRules = [
  { required: true, message: '请输入手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
]

const passwordRules = [
  { required: true, message: '请输入密码' },
  { min: 6, message: '密码至少6位' }
]

// 登录处理
const handleLogin = async () => {
  if (!agreeTerms.value) {
    showToast('请先同意用户协议和隐私政策')
    return
  }

  try {
    loginLoading.value = true
    // 模拟登入API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 模拟登入成功，保存token和用户信息
    const mockToken = 'mock_token_' + Date.now()
    const mockUserInfo = {
      id: 1,
      name: '张三',
      phone: loginForm.phone,
      avatar: ''
    }

    // 保存到localStorage
    localStorage.setItem('token', mockToken)
    localStorage.setItem('userInfo', JSON.stringify(mockUserInfo))

    // 登入成功提示
    // showToast.success('登入成功')

    // 跳转到首页
    router.push('/home')

  } catch (error) {
    console.error('登入失败:', error)
    // showToast.fail('登入失败，请重试')
  } finally {
    loginLoading.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  showDialog({
    title: '忘记密码',
    message: '请联系客服或通过注册手机号找回密码',
    confirmButtonText: '联系客服',
    cancelButtonText: '取消'
  }).then(() => {
    // 联系客服逻辑
    showToast('客服电话：400-123-4567')
  })
}

// 微信登录
const handleWechatLogin = () => {
  showToast('微信登录功能开发中')
}

// QQ登录
const handleQQLogin = () => {
  showToast('QQ登录功能开发中')
}

// 跳转注册
const navigateToRegister = () => {
  router.push('/register')
}

// 显示用户协议
const showTerms = () => {
  showDialog({
    title: '用户协议',
    message: '这里是用户协议的内容...',
    confirmButtonText: '我知道了'
  })
}

// 显示隐私政策
const showPrivacy = () => {
  showDialog({
    title: '隐私政策',
    message: '这里是隐私政策的内容...',
    confirmButtonText: '我知道了'
  })
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
}

.header-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px 20px;

  .logo-area {
    text-align: center;
    color: white;

    .logo-icon {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      backdrop-filter: blur(10px);
    }

    .app-title {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .app-subtitle {
      font-size: 16px;
      opacity: 0.9;
      font-weight: 300;
    }
  }
}

.form-section {
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 32px 20px 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);

  .form-container {
    max-width: 400px;
    margin: 0 auto;
  }

  .form-title {
    font-size: 24px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    text-align: center;
  }

  .form-subtitle {
    font-size: 14px;
    color: #666;
    text-align: center;
    margin-bottom: 32px;
  }
}

:deep(.van-field) {
  margin-bottom: 16px;
  border-radius: 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;

  &.van-field--error {
    border-color: #f44336;
  }

  .van-field__control {
    font-size: 16px;
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;

  :deep(.van-checkbox) {
    .van-checkbox__label {
      font-size: 14px;
      color: #666;
    }
  }
}

.form-actions {
  margin: 32px 0;

  .login-btn {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border: none;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
}

.other-login {
  margin: 32px 0;

  .divider {
    position: relative;
    text-align: center;
    margin-bottom: 20px;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e9ecef;
    }

    span {
      background: white;
      padding: 0 16px;
      font-size: 14px;
      color: #999;
    }
  }

  .social-login {
    display: flex;
    justify-content: center;
    gap: 40px;

    .social-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 12px;
      border-radius: 12px;
      transition: background-color 0.2s;

      &:active {
        background: #f8f9fa;
      }

      span {
        font-size: 12px;
        color: #666;
      }
    }
  }
}

.register-link {
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: #666;

  span {
    margin-right: 8px;
  }
}

.footer-section {
  padding: 20px;

  .agreement {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 4px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);

    :deep(.van-checkbox) {
      .van-checkbox__label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    :deep(.van-button--mini) {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
    }
  }
}

// 老人模式适配
:global(.elder-mode) .login-container {
  .form-title {
    font-size: 28px;
  }

  .form-subtitle {
    font-size: 16px;
  }

  :deep(.van-field) {
    .van-field__control {
      font-size: 18px;
    }
  }

  .login-btn {
    height: 56px !important;
    font-size: 18px !important;
  }
}
</style>
