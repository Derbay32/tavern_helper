import { defineMvuDataStore } from '@util/mvu';
import { Schema } from './schema';

/**
 * 绑定当前消息楼层的 mvu 变量, 双向同步 `stat_data.管道工`
 *
 * 数据完全由 MVU 变量框架提供 (initvar 世界书条目初始化),
 * 前端不注入任何内置默认值。
 */
export const usePlumberStore = defineMvuDataStore(Schema, {
  type: 'message',
  message_id: getCurrentMessageId(),
});
