import { createApp } from 'vue';
import App from './App.vue';

$(() => {
  let app: ReturnType<typeof createApp> | undefined;

  errorCatched(async () => {
    // 等待 MVU 变量框架接口可用 (stat_data 由 defineMvuDataStore 轮询自动同步,
    // 无需阻塞挂载, 新聊天初始化延迟也不会导致超时报错)
    await waitGlobalInitialized('Mvu');

    app = createApp(App).use(createPinia());
    app.mount('#app');
  })();

  $(window).on('pagehide', () => app?.unmount());
});
