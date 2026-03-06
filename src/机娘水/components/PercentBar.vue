<template>
  <div class="percent-bar">
    <div class="percent-bar__header">
      <span class="percent-bar__label">{{ label }}</span>
      <span class="percent-bar__value">{{ display_value }}</span>
    </div>
    <div class="percent-bar__track">
      <div class="percent-bar__fill" :style="{ width: fill_width }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  label: string;
  value?: number;
}>();

const display_value = computed(() => (props.value === undefined ? '--' : `${props.value}%`));
const fill_width = computed(() => (props.value === undefined ? '0%' : `${props.value}%`));
</script>

<style lang="scss" scoped>
.percent-bar {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.percent-bar__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 0.84rem;
  letter-spacing: 0.08em;
}

.percent-bar__label {
  color: #9ad2ff;
  text-transform: uppercase;
}

.percent-bar__value {
  color: #e8f5ff;
  font-weight: 700;
}

.percent-bar__track {
  width: 100%;
  border: 1px solid #2667a3;
  background: linear-gradient(90deg, rgba(8, 19, 38, 0.92), rgba(16, 39, 72, 0.92));
  height: 12px;
  padding: 1px;
}

.percent-bar__fill {
  height: 100%;
  max-width: 100%;
  background: linear-gradient(90deg, #31d5ff 0%, #78f0ff 48%, #bffcff 100%);
  box-shadow:
    0 0 8px rgba(64, 222, 255, 0.75),
    inset 0 0 7px rgba(227, 255, 255, 0.35);
  transition: width 0.25s ease;
}
</style>
