<template>
  <Transition name="detail">
    <div v-if="order" class="overlay">
      <div class="sheet">
        <div class="sheet-handle"></div>

        <div class="sheet-head">
          <h3 class="sheet-title">{{ order.title }}</h3>
          <span class="sheet-price">报酬：¥{{ order.price }}</span>
        </div>

        <div class="sheet-info">
          <p><strong>客户名称：</strong> {{ order.client }}</p>
          <p><strong>详细地址：</strong> {{ order.address }}</p>
          <p><strong>距离：</strong> {{ order.distance }}</p>
          <div class="sheet-desc">
            <p class="sheet-desc__label">管道堵塞情况说明：</p>
            <p class="sheet-desc__content">{{ order.desc }}</p>
          </div>
        </div>

        <div class="sheet-actions">
          <button class="close-btn" @click="$emit('close')">再看看</button>
          <button class="accept-btn" @click="$emit('accept', order)">立即接单</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { PlumberOrder } from '../schema';

defineProps<{ order: PlumberOrder | null }>();

defineEmits<{
  close: [];
  accept: [order: PlumberOrder];
}>();
</script>

<style lang="scss" scoped>
.overlay {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.5); // bg-black bg-opacity-50
  backdrop-filter: blur(2px); // backdrop-blur-xs
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 50;
}

.sheet {
  background: #fff;
  width: 100%;
  border-radius: 24px 24px 0 0; // rounded-t-3xl
  padding: 20px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); // shadow-2xl
}

.sheet-handle {
  width: 40px;
  height: 4px;
  background: #d1d5db; // gray-300
  border-radius: 9999px;
  margin: 0 auto 12px;
}

.sheet-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sheet-title {
  margin: 0;
  font-size: 1rem; // text-base
  font-weight: 700;
  color: #111827;
}

.sheet-price {
  font-size: 12px;
  font-weight: 800;
  color: #f43f5e;
  background: #fff1f2; // rose-50
  padding: 4px 10px;
  border-radius: 9999px;
  white-space: nowrap;
}

.sheet-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 20px;

  p {
    margin: 0;
  }
}

.sheet-desc {
  background: #f9fafb; // gray-50
  padding: 10px;
  border-radius: 12px; // rounded-xl
  border: 1px solid #f3f4f6; // gray-100
}

.sheet-desc__label {
  margin: 0 0 2px !important;
  font-size: 10px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
}

.sheet-desc__content {
  margin: 0;
  color: #374151; // gray-700
  font-size: 11px;
  line-height: 1.6;
}

.sheet-actions {
  display: flex;
  gap: 10px;
}

.close-btn,
.accept-btn {
  flex: 1;
  font-weight: 700;
  padding: 10px 0;
  border-radius: 12px; // rounded-xl
  font-size: 12px;
  cursor: pointer;
  border: none;
}

.close-btn {
  background: #f3f4f6; // gray-100
  color: #374151;

  &:hover {
    background: #e5e7eb;
  }
}

.accept-btn {
  background: #f43f5e;
  color: #fff;
  box-shadow: 0 4px 6px -1px rgb(244 63 94 / 0.3), 0 2px 4px -2px rgb(244 63 94 / 0.3); // shadow-rose-500/30

  &:hover {
    background: #e11d48;
  }
}

// ---------- 过渡动画 ----------
.detail-enter-active,
.detail-leave-active {
  transition: opacity 0.3s ease;

  .sheet {
    transition: transform 0.3s ease;
  }
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;

  .sheet {
    transform: translateY(100%);
  }
}
</style>
