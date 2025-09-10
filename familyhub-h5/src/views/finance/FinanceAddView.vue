<template>
  <div class="finance-add-container">
    <van-nav-bar title="记账" left-text="返回" left-arrow @click-left="$router.back()" />
    <div class="content">
      <h2>记账功能开发中...</h2>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.finance-add-container {
  min-height: 100vh;
  background-color: var(--van-background-color-light);
}
.content {
  padding: 40px 20px;
  text-align: center;
}
</style>