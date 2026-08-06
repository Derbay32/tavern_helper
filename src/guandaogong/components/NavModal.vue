<template>
  <Transition name="fade">
    <div v-if="visible" class="overlay">
      <div class="card">
        <h3 class="card-title">导航信息</h3>
        <p class="card-hint">点击复制将获取格式化内容：</p>
        <div class="card-text">
          <p><strong>格式：</strong><span>{{ text }}</span></p>
        </div>
        <div class="card-actions">
          <button class="copy-btn" @click="$emit('copy')">一键复制</button>
          <button class="close-btn" @click="$emit('close')">关闭</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ visible: boolean; text: string }>();

defineEmits<{
  close: [];
  copy: [];
}>();
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
}

.card {
  background: #fff;
  width: 100%;
  border-radius: 16px; // rounded-2xl
  padding: 20px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); // shadow-2xl
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
}

.card-hint {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.card-text {
  background: #f9fafb;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 12px;
  color: #374151;

  p {
    margin: 0;
  }
}

.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 8px;
}

.copy-btn,
.close-btn {
  flex: 1;
  font-weight: 700;
  padding: 8px 0;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  border: none;
}

.copy-btn {
  background: #2563eb; // blue-600
  color: #fff;

  &:hover {
    background: #1d4ed8; // blue-700
  }
}

.close-btn {
  background: #e5e7eb; // gray-200
  color: #374151;

  &:hover {
    background: #d1d5db;
  }
}

// ---------- 过渡动画 ----------
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;

  .card {
    transition: transform 0.25s ease;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;

  .card {
    transform: scale(0.95);
  }
}
</style>
