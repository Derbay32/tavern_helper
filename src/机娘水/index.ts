import { createApp } from 'vue';
import { waitUntil } from 'async-wait-until';
import App from './App.vue';

$(() => {
  let app: ReturnType<typeof createApp> | undefined;

  errorCatched(async () => {
    await waitGlobalInitialized('Mvu');
    await waitUntil(() => _.has(getVariables({ type: 'message' }), 'stat_data'));

    app = createApp(App).use(createPinia());
    app.mount('#app');
  })();

  $(window).on('pagehide', () => app?.unmount());
});
