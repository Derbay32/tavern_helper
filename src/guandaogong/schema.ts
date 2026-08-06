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
  /** 标签颜色 (tailwind 类), 如 "bg-rose-100 text-rose-600" */
  tagColor: z.string(),
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

/** 默认大厅订单 (原 status.html 内置默认数据源) */
export const DEFAULT_HALL_ORDERS: PlumberOrder[] = [
  {
    id: 1,
    client: 'Jessica (全职太太)',
    title: '主卧浴室下水道堵塞疏通',
    address: '阳光海岸小区 1202室',
    distance: '0.5公里',
    price: 200,
    desc: '家里主卧的管道堵得厉害，想请师傅上门仔细通一下，水漫金山了急需处理。',
    tag: '急单',
    tagColor: 'bg-rose-100 text-rose-600',
  },
  {
    id: 2,
    client: '美玲 (家里人)',
    title: '厨房洗菜盆下水管道堵塞',
    address: '枫林晚报小区 B区 302',
    distance: '1.2公里',
    price: 150,
    desc: '家里人说厨房下水管道堵了，需要拿工具上门疏通一下。',
    tag: '家庭预约',
    tagColor: 'bg-purple-100 text-purple-600',
  },
  {
    id: 3,
    client: 'David (预约客户)',
    title: '地下室主管道积水疏通',
    address: '橡树林路 45号别墅',
    distance: '2.0公里',
    price: 300,
    desc: '地下室管道堵塞积水，需要专业人员带疏通机上门处理。',
    tag: '大单',
    tagColor: 'bg-blue-100 text-blue-600',
  },
];

/** 默认备选订单池 (原 status.html 内置默认数据源) */
export const DEFAULT_EXTRA_POOL: PlumberOrder[] = [
  {
    id: 4,
    client: 'Lisa (邻居)',
    title: '阳台洗衣机地漏返水',
    address: '碧水庄园 5栋 201室',
    distance: '0.9公里',
    price: 180,
    desc: '洗衣机排水时地漏往外溢水，请上门帮忙排查疏通。',
    tag: '常规单',
    tagColor: 'bg-green-100 text-green-600',
  },
  {
    id: 5,
    client: 'Sophia (全职妈妈)',
    title: '厨房主管道油污堵塞',
    address: '香山美树 2单元 601室',
    distance: '1.5公里',
    price: 220,
    desc: '油污长期积累导致下水极慢，需要高温高压或弹簧疏通。',
    tag: '急单',
    tagColor: 'bg-rose-100 text-rose-600',
  },
  {
    id: 6,
    client: '阿杰 (表哥)',
    title: '卫生间马桶下水严重不畅',
    address: '时代华庭 1栋 1104室',
    distance: '2.3公里',
    price: 160,
    desc: '家里马桶冲水困难，顺便叫你过来看看主管道。',
    tag: '亲友单',
    tagColor: 'bg-purple-100 text-purple-600',
  },
];
