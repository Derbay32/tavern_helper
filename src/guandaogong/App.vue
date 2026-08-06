<template>
  <!-- 独立隔离层: 模拟手机 APP 视口 -->
  <div class="page">
    <!-- 手机 APP 外壳 -->
    <div class="phone">
      <!-- 1. 顶部导航栏 -->
      <header class="app-header">
        <div>
          <h1 class="header-title">{{ header_title }}</h1>
          <p class="header-subtitle">{{ header_subtitle }}</p>
        </div>
        <div class="header-status">
          <span class="status-dot">
            <span class="status-dot__ping"></span>
            <span class="status-dot__core"></span>
          </span>
          <span class="status-badge">接单中</span>
        </div>
      </header>

      <!-- 2. 内容主体多标签页容器 -->
      <main class="app-main">
        <!-- 标签页 1: 订单大厅 (抢单) -->
        <section v-show="active_tab === 'hall'" class="tab-section">
          <div class="section-head">
            <h2 class="section-title">附近的疏通订单</h2>
          </div>
          <div v-if="hall_orders.length > 0" class="order-list">
            <div
              v-for="order in hall_orders"
              :key="order.id"
              class="hall-card"
              @click="selected_order = order"
            >
              <div class="hall-card__top">
                <span :class="['order-tag', order.tagColor]">{{ order.tag }}</span>
                <span class="order-distance">{{ order.distance }}</span>
              </div>
              <h3 class="hall-card__title">{{ order.title }}</h3>
              <p class="hall-card__address">📍 {{ order.address }}</p>
              <div class="hall-card__bottom">
                <span class="order-price">报酬：¥{{ order.price }}</span>
                <button class="detail-btn">查看详情</button>
              </div>
            </div>
          </div>
          <div v-else class="empty-tip">暂时没有新订单，请稍候</div>
        </section>

        <!-- 标签页 2: 进行中的订单 (已接订单) -->
        <section v-show="active_tab === 'ongoing'" class="tab-section">
          <div class="section-head">
            <h2 class="section-title">我已接下的疏通订单</h2>
            <span class="section-badge">进行中</span>
          </div>
          <div v-if="ongoing_orders.length > 0" class="order-list">
            <OngoingOrderCard
              v-for="order in ongoing_orders"
              :key="order.id"
              :order="order"
              @nav="open_nav"
              @complete="complete_order"
              @cancel="cancel_order"
            />
          </div>
          <div v-else class="empty-tip">暂无进行中的订单，请去大厅接单</div>
        </section>

        <!-- 标签页 3: 收入明细 -->
        <section v-show="active_tab === 'earnings'" class="tab-section">
          <div class="earnings-hero">
            <p class="earnings-hero__label">累计总收入 (元)</p>
            <h2 class="earnings-hero__amount">¥{{ total_earnings.toFixed(2) }}</h2>
          </div>
          <div class="section-head">
            <h2 class="section-title">已完成订单收入明细</h2>
          </div>
          <div v-if="earnings_history.length > 0" class="earnings-list">
            <div v-for="order in earnings_history" :key="order.id" class="earnings-item">
              <div>
                <p class="earnings-item__title">{{ order.title }}</p>
                <p class="earnings-item__meta">客户：{{ order.client }} | 地址：{{ order.address }}</p>
              </div>
              <span class="earnings-item__amount">+¥{{ order.price }}</span>
            </div>
          </div>
          <div v-else class="empty-tip">还没有完成的订单记录</div>
        </section>

        <!-- 标签页 4: 个人中心 -->
        <section v-show="active_tab === 'profile'" class="tab-section">
          <div class="profile-card">
            <div class="profile-avatar">师傅</div>
            <h3 class="profile-name">金牌疏通师傅</h3>
            <p class="profile-meta">手机尾号：8888 • 评分 5.0</p>
          </div>
          <div class="profile-info">
            <div class="profile-row">
              <span>接单状态</span>
              <span class="profile-row__value profile-row__value--green">随时接单</span>
            </div>
            <div class="profile-row">
              <span>服务范围</span>
              <span>城东全境</span>
            </div>
            <div class="profile-row profile-row--last">
              <span>工具状态</span>
              <span class="profile-row__value profile-row__value--blue">高压疏通机/弹簧机（正常）</span>
            </div>
          </div>
        </section>
      </main>

      <!-- 3. 底部导航栏 -->
      <footer class="app-footer">
        <div
          v-for="nav in nav_items"
          :key="nav.id"
          :class="['nav-item', active_tab === nav.id ? 'nav-item--active' : '']"
          @click="active_tab = nav.id"
        >
          <div class="nav-item__icon">{{ nav.icon }}</div>
          <span>{{ nav.label }}</span>
        </div>
      </footer>

      <!-- 4. 详情与接单弹窗 -->
      <DetailModal
        :order="selected_order"
        @close="selected_order = null"
        @accept="accept_order"
      />

      <!-- 5. 导航信息弹窗 (用于复制地址) -->
      <NavModal :visible="nav_visible" :text="nav_text" @close="nav_visible = false" @copy="copy_nav" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import DetailModal from './components/DetailModal.vue';
import NavModal from './components/NavModal.vue';
import OngoingOrderCard from './components/OngoingOrderCard.vue';
import { usePlumberStore } from './store';
import type { PlumberOrder } from './schema';

type TabKey = 'hall' | 'ongoing' | 'earnings' | 'profile';

const store = usePlumberStore();

// ---------- 标签页状态 ----------
const active_tab = ref<TabKey>('hall');

const nav_items: { id: TabKey; icon: string; label: string }[] = [
  { id: 'hall', icon: '📋', label: '大厅' },
  { id: 'ongoing', icon: '🛠️', label: '进行中' },
  { id: 'earnings', icon: '💰', label: '收入明细' },
  { id: 'profile', icon: '👤', label: '个人中心' },
];

const header_info: Record<TabKey, [string, string]> = {
  hall: ['管道疏通接单大厅', '当前区域：城东服务区'],
  ongoing: ['进行中的订单', '请尽快按地址上门疏通'],
  earnings: ['收入明细', '已完成订单的报酬汇总'],
  profile: ['师傅中心', '个人资料与工具管理'],
};

const header_title = computed(() => header_info[active_tab.value][0]);
const header_subtitle = computed(() => header_info[active_tab.value][1]);

// ---------- 订单数据 (来自 mvu 变量) ----------
const hall_orders = computed(() => store.data.管道工.大厅订单);
const ongoing_orders = computed(() => store.data.管道工.进行中订单);
const earnings_history = computed(() => store.data.管道工.收入明细);
const total_earnings = computed(() => store.data.管道工.累计收入);

// ---------- 弹窗状态 ----------
const selected_order = ref<PlumberOrder | null>(null);
const nav_visible = ref(false);
const nav_text = ref('');

// ---------- 订单操作 ----------
function accept_order(order: PlumberOrder) {
  const d = store.data.管道工;
  d.大厅订单 = d.大厅订单.filter(o => o.id !== order.id);

  if (d.备选订单池.length > 0) {
    d.大厅订单 = [...d.大厅订单, d.备选订单池[0]];
    d.备选订单池 = d.备选订单池.slice(1);
  }

  d.进行中订单 = [...d.进行中订单, order];
  selected_order.value = null;

  toastr.success('接单成功！订单已进入【进行中】。');
  active_tab.value = 'ongoing';
}

function complete_order(order: PlumberOrder) {
  const d = store.data.管道工;
  d.进行中订单 = d.进行中订单.filter(o => o.id !== order.id);
  d.累计收入 += order.price;
  d.收入明细 = [order, ...d.收入明细];

  toastr.success(`服务完成！客户已确认结束服务，成功获得报酬 +¥${order.price}！`);
  active_tab.value = 'earnings';
}

function cancel_order(order: PlumberOrder) {
  const d = store.data.管道工;
  d.进行中订单 = d.进行中订单.filter(o => o.id !== order.id);
  toastr.warning('已取消订单！');
}

// ---------- 导航复制 ----------
function open_nav(order: PlumberOrder) {
  nav_text.value = `前往（${order.client}${order.address}）`;
  nav_visible.value = true;
}

function copy_nav() {
  navigator.clipboard
    .writeText(nav_text.value)
    .then(() => {
      toastr.success(`已成功复制：${nav_text.value}，可直接粘贴！`);
      nav_visible.value = false;
    })
    .catch(() => {
      toastr.error('复制失败，请手动长按复制。');
    });
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
// ---------- 页面外壳 ----------
.page {
  background: #0f172a; // slate-900
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.phone {
  width: 100%;
  max-width: 380px;
  height: 800px;
  background: #ffffff;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); // shadow-2xl
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  border: 8px solid #1f2937; // gray-800
  box-sizing: border-box;
}

// ---------- 顶部导航栏 ----------
.app-header {
  background: #f43f5e; // rose-500
  color: #fff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); // shadow-md
  flex-shrink: 0;
}

.header-title {
  margin: 0;
  font-size: 1.125rem; // text-lg
  font-weight: 700;
  letter-spacing: -0.025em; // tracking-tight
}

.header-subtitle {
  margin: 0;
  font-size: 11px;
  color: #ffe4e6; // rose-100
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  position: relative;
  display: inline-flex;
  width: 10px;
  height: 10px;
}

.status-dot__ping {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: #facc15; // yellow-400
  opacity: 0.75;
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.status-dot__core {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: #eab308; // yellow-500
}

.status-badge {
  font-size: 11px;
  font-weight: 600;
  background: #e11d48; // rose-600
  padding: 2px 10px;
  border-radius: 9999px;
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

// ---------- 内容主体 ----------
.app-main {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f9fafb; // gray-50
  position: relative;
}

.tab-section {
  display: flex;
  flex-direction: column;
  gap: 12px; // space-y-3
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.section-title {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: #9ca3af; // gray-400
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.section-badge {
  font-size: 12px;
  font-weight: 600;
  color: #f43f5e; // rose-500
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-tip {
  background: #fff;
  padding: 40px 16px;
  border-radius: 16px; // rounded-2xl
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); // shadow-sm
  border: 1px solid #e5e7eb; // gray-200
  text-align: center;
  color: #9ca3af; // gray-400
  font-size: 12px;
}

// ---------- 大厅订单卡 ----------
.hall-card {
  background: #fff;
  padding: 14px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #fb7185; // rose-400
  }

  &:active {
    transform: scale(0.98);
  }
}

.hall-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}

.order-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 6px;
}

.order-distance {
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
}

.hall-card__title {
  margin: 0;
  font-weight: 700;
  color: #111827; // gray-900
  font-size: 14px;
}

.hall-card__address {
  margin: 2px 0 0;
  font-size: 11px;
  color: #6b7280; // gray-500
}

.hall-card__bottom {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f3f4f6; // gray-100
}

.order-price {
  color: #f43f5e;
  font-weight: 800;
  font-size: 12px;
}

.detail-btn {
  background: #f43f5e;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #e11d48;
  }
}

// ---------- 收入明细 ----------
.earnings-hero {
  background: #f43f5e;
  color: #fff;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  margin-bottom: 4px;
}

.earnings-hero__label {
  margin: 0;
  font-size: 12px;
  color: #ffe4e6;
}

.earnings-hero__amount {
  margin: 4px 0 0;
  font-size: 1.5rem; // text-2xl
  font-weight: 800;
}

.earnings-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.earnings-item {
  background: #fff;
  padding: 12px;
  border-radius: 12px; // rounded-xl
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.earnings-item__title {
  margin: 0;
  font-weight: 700;
  color: #111827;
}

.earnings-item__meta {
  margin: 2px 0 0;
  font-size: 10px;
  color: #9ca3af;
}

.earnings-item__amount {
  font-weight: 800;
  color: #16a34a; // green-600
  font-size: 14px;
  white-space: nowrap;
}

// ---------- 个人中心 ----------
.profile-card {
  background: #fff;
  padding: 24px 16px;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  text-align: center;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  background: #fff1f2; // rose-50
  color: #f43f5e;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 8px;
}

.profile-name {
  margin: 0;
  font-weight: 700;
  color: #111827;
  font-size: 14px;
}

.profile-meta {
  margin: 2px 0 0;
  font-size: 12px;
  color: #9ca3af;
}

.profile-info {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 12px;
  color: #4b5563; // gray-600
}

.profile-row {
  display: flex;
  justify-content: space-between;
  padding-bottom: 4px;
  border-bottom: 1px solid #f3f4f6;

  &--last {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.profile-row__value {
  font-weight: 600;

  &--green {
    color: #22c55e; // green-500
  }

  &--blue {
    color: #3b82f6; // blue-500
  }
}

// ---------- 底部导航栏 ----------
.app-footer {
  background: #fff;
  border-top: 1px solid #e5e7eb;
  padding: 10px 24px;
  display: flex;
  justify-content: space-around;
  text-align: center;
  font-size: 10px;
  color: #6b7280; // gray-500
  font-weight: 500;
  flex-shrink: 0;
}

.nav-item {
  cursor: pointer;
  transition: color 0.15s ease;

  &:hover {
    color: #f43f5e;
  }

  &--active {
    color: #f43f5e;
  }
}

.nav-item__icon {
  font-size: 1rem;
}
</style>
