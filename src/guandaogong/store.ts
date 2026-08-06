import { defineMvuDataStore } from '@util/mvu';
import { DEFAULT_EXTRA_POOL, DEFAULT_HALL_ORDERS, Schema } from './schema';

/**
 * 绑定当前消息楼层的 mvu 变量, 双向同步 `stat_data.管道工`
 *
 * 首次初始化 (stat_data 中尚无 `管道工` 键) 时注入内置默认订单,
 * 行为与原 status.html 的 localStorage 默认数据源一致。
 */
export const usePlumberStore = defineMvuDataStore(
  Schema,
  { type: 'message', message_id: getCurrentMessageId() },
  data => {
    if (!_.has(getVariables({ type: 'message' }), 'stat_data.管道工')) {
      data.value.管道工.大厅订单 = DEFAULT_HALL_ORDERS;
      data.value.管道工.备选订单池 = DEFAULT_EXTRA_POOL;
      updateVariablesWith(variables => _.set(variables, 'stat_data', data.value), {
        type: 'message',
        message_id: getCurrentMessageId(),
      });
    }
  },
);
