/**
 * 管道疏通上门服务接单端 - MVU 变量 schema
 *
 * 变量空间统一挂在 `stat_data.管道工` 下, 由 AI 通过 `_.set('管道工.xxx', ...)` 更新,
 * 前端通过 defineMvuDataStore 双向同步。
 */
const OrderSchema = z.object({
  /** 订单唯一标识 */
  id: z.number(),
  /** 客户名称, 如 "Jessica (全职太太)" */
  client: z.string(),
  /** 订单标题, 如 "主卧浴室下水道堵塞疏通" */
  title: z.string(),
  /** 详细地址 */
  address: z.string(),
  /** 距离, 带单位字符串, 如 "0.5公里" */
  distance: z.string(),
  /** 报酬 (元) */
  price: z.number(),
  /** 管道堵塞情况说明 */
  desc: z.string(),
  /** 标签, 如 急单/大单/家庭预约/常规单/亲友单 */
  tag: z.string(),
});

const PlumberDataSchema = z.object({
  /** 大厅待抢订单 */
  大厅订单: z.array(OrderSchema).prefault([]),
  /** 备选订单池 (接单后自动补位大厅) */
  备选订单池: z.array(OrderSchema).prefault([]),
  /** 已接进行中的订单 */
  进行中订单: z.array(OrderSchema).prefault([]),
  /** 已完成订单收入明细 */
  收入明细: z.array(OrderSchema).prefault([]),
  /** 累计总收入 (元) */
  累计收入: z.number().prefault(0),
});

export const Schema = z.object({
  管道工: PlumberDataSchema.prefault({}),
});

export const PlumberSchema = Schema;

export type PlumberData = z.output<typeof Schema>;
export type PlumberOrder = z.output<typeof OrderSchema>;
