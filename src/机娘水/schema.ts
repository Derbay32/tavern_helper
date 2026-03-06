const PercentageSchema = z.coerce.number();

const HeroStatusSchema = z
  .object({
    饮水值: PercentageSchema.optional(),
  })
  .prefault({});

const CharacterStatusSchema = z
  .object({
    能量值: PercentageSchema.optional(),
    储存量: PercentageSchema.optional(),
  })
  .prefault({});

export const StatusBarSchema = z
  .object({
    当前地点: z.string().optional(),
    当前时间: z.string().optional(),
    当前任务目标: z.array(z.string()).prefault([]),
    主角: HeroStatusSchema,
    石楠: CharacterStatusSchema,
    鸢尾: CharacterStatusSchema,
  })
  .prefault({});

export type StatusBarData = z.output<typeof StatusBarSchema>;

export function parseStatusBarData(raw: unknown): StatusBarData {
  const fallback = StatusBarSchema.parse({});

  const location = z.string().safeParse(_.get(raw, '当前地点'));
  const time = z.string().safeParse(_.get(raw, '当前时间'));
  const objectives = z.array(z.string()).safeParse(_.get(raw, '当前任务目标'));
  const hero = HeroStatusSchema.safeParse(_.get(raw, '主角', {}));
  const shinan = CharacterStatusSchema.safeParse(_.get(raw, '石楠', {}));
  const yuanwei = CharacterStatusSchema.safeParse(_.get(raw, '鸢尾', {}));

  return {
    当前地点: location.success ? location.data : fallback.当前地点,
    当前时间: time.success ? time.data : fallback.当前时间,
    当前任务目标: objectives.success ? objectives.data : fallback.当前任务目标,
    主角: hero.success ? hero.data : fallback.主角,
    石楠: shinan.success ? shinan.data : fallback.石楠,
    鸢尾: yuanwei.success ? yuanwei.data : fallback.鸢尾,
  };
}
