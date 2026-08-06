<template>
  <div class="ongoing-card">
    <div class="ongoing-card__top">
      <span class="ongoing-badge">进行中</span>
      <span class="ongoing-price">预计获得 +¥{{ order.price }}</span>
    </div>
    <h3 class="ongoing-title">{{ order.title }}</h3>
    <p class="ongoing-meta">📍 客户：{{ order.client }} | 地址：{{ order.address }}</p>
    <p class="ongoing-desc">{{ order.desc }}</p>

    <div class="ongoing-actions">
      <button class="nav-btn" @click="$emit('nav', order)">
        前往（{{ order.client }}{{ order.address }}）
      </button>
      <div class="ongoing-actions__row">
        <button class="complete-btn" @click="$emit('complete', order)">完成服务</button>
        <button class="cancel-btn" @click="$emit('cancel', order)">取消接单</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlumberOrder } from '../schema';

defineProps<{ order: PlumberOrder }>();

defineEmits<{
  nav: [order: PlumberOrder];
  complete: [order: PlumberOrder];
  cancel: [order: PlumberOrder];
}>();
</script>

<style lang="scss" scoped>
.ongoing-card {
  background: #fff;
  padding: 14px;
  border-radius: 16px; // rounded-2xl
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); // shadow-sm
  border: 1px solid #fecdd3; // rose-200
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ongoing-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.ongoing-badge {
  background: #ffe4e6; // rose-100
  color: #e11d48; // rose-600
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.ongoing-price {
  font-size: 12px;
  font-weight: 800;
  color: #f43f5e;
}

.ongoing-title {
  margin: 0;
  font-weight: 700;
  color: #111827;
  font-size: 14px;
}

.ongoing-meta {
  margin: 0;
  font-size: 11px;
  color: #6b7280;
}

.ongoing-desc {
  margin: 0;
  font-size: 11px;
  color: #4b5563;
  background: #f9fafb; // gray-50
  padding: 8px;
  border-radius: 8px;
}

.ongoing-actions {
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nav-btn {
  width: 100%;
  background: #f43f5e;
  color: #fff;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-size: 11px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #e11d48;
  }
}

.ongoing-actions__row {
  display: flex;
  gap: 8px;
}

.complete-btn,
.cancel-btn {
  flex: 1;
  font-weight: 700;
  padding: 8px 0;
  border-radius: 12px;
  font-size: 11px;
  cursor: pointer;
  border: none;
}

.complete-btn {
  background: #22c55e; // green-500
  color: #fff;

  &:hover {
    background: #16a34a;
  }
}

.cancel-btn {
  background: #fee2e2; // red-100
  color: #dc2626; // red-600

  &:hover {
    background: #fecaca; // red-200
  }
}
</style>
