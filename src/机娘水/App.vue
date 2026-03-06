<template>
  <section class="hud-frame">
    <header class="hud-panel hud-panel--location">
      <div class="location-grid">
        <div class="location-box">
          <div class="panel-tag">LOCATION</div>
          <p class="location-text">{{ display_location }}</p>
        </div>
        <div class="location-box">
          <div class="panel-tag">TIME</div>
          <p class="location-text">{{ display_time }}</p>
        </div>
      </div>
    </header>

    <section class="hud-panel hud-panel--tasks">
      <div class="panel-head">
        <span class="panel-tag">MISSION QUEUE</span>
      </div>

      <ul v-if="mission_queue.length > 0" class="task-list">
        <li
          v-for="(task, index) in mission_queue"
          :key="`${task}-${index}`"
          :class="['task-item', index === 0 ? 'task-item--active' : 'task-item--pending']"
        >
          <span class="task-index">#{{ index + 1 }}</span>
          <span class="task-content">{{ task }}</span>
        </li>
      </ul>

      <div v-else class="task-placeholder">未知任务</div>
    </section>

    <section class="hud-panel hud-panel--hero">
      <div class="panel-head">
        <span class="panel-tag">PROTAGONIST</span>
      </div>
      <PercentBar label="饮水值" :value="store.data.主角.饮水值" />
    </section>

    <section class="hud-panel hud-panel--characters">
      <article class="character-card">
        <div class="character-name">石楠</div>
        <PercentBar label="能量值" :value="store.data.石楠.能量值" />
        <PercentBar label="储存量" :value="store.data.石楠.储存量" />
      </article>

      <article class="character-card">
        <div class="character-name">鸢尾</div>
        <PercentBar label="能量值" :value="store.data.鸢尾.能量值" />
        <PercentBar label="储存量" :value="store.data.鸢尾.储存量" />
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PercentBar from './components/PercentBar.vue';
import { useStatusStore } from './store';

const store = useStatusStore();

const display_location = computed(() => store.data.当前地点?.trim() || '未知地点');
const display_time = computed(() => store.data.当前时间?.trim() || '--:--');

const mission_queue = computed(() =>
  store.data.当前任务目标
    .filter(task => task.trim().length > 0)
    .slice(0, 3),
);
</script>

<style lang="scss" scoped>
.hud-frame {
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  display: grid;
  gap: 10px;
  color: #dff5ff;
  font-family:
    'Rajdhani',
    'Orbitron',
    'Noto Sans SC',
    sans-serif;
  background:
    radial-gradient(circle at 12% 20%, rgba(72, 221, 255, 0.1), transparent 36%),
    radial-gradient(circle at 88% 75%, rgba(63, 114, 255, 0.15), transparent 42%),
    linear-gradient(165deg, #040c1d 0%, #09142a 55%, #081634 100%);
  border: 1px solid #216ba7;
  box-shadow:
    0 0 0 1px rgba(112, 222, 255, 0.2) inset,
    0 0 26px rgba(15, 134, 190, 0.25);
  padding: 14px;
  position: relative;
  overflow: hidden;
  animation: frame-enter 0.42s ease;
}

.hud-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(rgba(127, 210, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(127, 210, 255, 0.05) 1px, transparent 1px);
  background-size:
    100% 22px,
    22px 100%;
  opacity: 0.35;
}

.hud-panel {
  border: 1px solid rgba(56, 139, 196, 0.75);
  background: linear-gradient(180deg, rgba(7, 21, 41, 0.88), rgba(6, 16, 32, 0.72));
  padding: 12px;
  position: relative;
  backdrop-filter: blur(1px);
}

.hud-panel::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  border: 1px solid rgba(88, 199, 255, 0.15);
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.panel-tag {
  color: #8ce3ff;
  letter-spacing: 0.14em;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.location-grid {
  display: grid;
  gap: 10px;
}

.location-box {
  border: 1px solid rgba(58, 121, 176, 0.85);
  background: linear-gradient(180deg, rgba(8, 26, 51, 0.85), rgba(4, 15, 31, 0.9));
  padding: 10px;
  display: grid;
  gap: 8px;
}

.location-text {
  margin: 0;
  font-size: 1rem;
  color: #f2fbff;
  letter-spacing: 0.05em;
}

.task-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 7px;
}

.task-item {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid transparent;
}

.task-item--active {
  border-color: rgba(108, 229, 255, 0.72);
  background: linear-gradient(90deg, rgba(51, 142, 196, 0.34), rgba(30, 89, 141, 0.2));
  box-shadow: 0 0 14px rgba(62, 186, 255, 0.24);
}

.task-item--pending {
  border-color: rgba(93, 117, 145, 0.66);
  background: rgba(16, 29, 47, 0.6);
  color: #84a0b8;
}

.task-index {
  display: inline-flex;
  justify-content: center;
  color: #9ce7ff;
  font-weight: 700;
  font-size: 0.78rem;
}

.task-item--pending .task-index {
  color: #7f96aa;
}

.task-content {
  overflow-wrap: anywhere;
}

.task-placeholder {
  padding: 8px 10px;
  border: 1px solid rgba(93, 117, 145, 0.66);
  color: #7f96aa;
  background: rgba(16, 29, 47, 0.55);
}

.hud-panel--characters {
  display: grid;
  gap: 10px;
}

.character-card {
  border: 1px solid rgba(58, 121, 176, 0.85);
  background: linear-gradient(180deg, rgba(8, 26, 51, 0.85), rgba(4, 15, 31, 0.9));
  padding: 10px;
  display: grid;
  gap: 10px;
}

.character-name {
  color: #d3f3ff;
  font-size: 0.94rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

@media (min-width: 680px) {
  .location-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hud-panel--characters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 560px) {
  .hud-frame {
    padding: 10px;
  }

  .hud-panel {
    padding: 10px;
  }

  .location-text {
    font-size: 0.93rem;
  }
}

@keyframes frame-enter {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
