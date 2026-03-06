import { useIntervalFn } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { parseStatusBarData, type StatusBarData } from './schema';

function readStatusBarData(): StatusBarData {
  const statData = _.get(getVariables({ type: 'message' }), 'stat_data', {});
  return parseStatusBarData(statData);
}

export const useStatusStore = defineStore('status_bar.machine_water', () => {
  const data = ref<StatusBarData>(readStatusBarData());

  useIntervalFn(() => {
    const nextData = readStatusBarData();
    if (!_.isEqual(data.value, nextData)) {
      data.value = nextData;
    }
  }, 1200);

  return { data };
});
