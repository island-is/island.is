type Statistics = {
  published?: number | null
  notifications?: number | null
  opened?: number | null
  failures?: number | null
}

type StatisticsResult = {
  published: number
  notifications: number
  opened: number
  failures: number
}

type BreakdownItem<TStats = Statistics> = {
  year?: number | null
  month?: number | null
  statistics?: TStats | null
}

// ---- helpers ----

export const mapStatistics = (
  statistics: Statistics | null | undefined,
): StatisticsResult | undefined => {
  if (!statistics) return undefined
  return {
    published: statistics.published ?? 0,
    notifications: statistics.notifications ?? 0,
    opened: statistics.opened ?? 0,
    failures: statistics.failures ?? 0,
  }
}

export const mapBreakdownItems = <T extends BreakdownItem>(
  items: ReadonlyArray<T> | null | undefined = [],
): Array<{
  year: number
  month: number
  statistics: ReturnType<typeof mapStatistics>
}> => {
  const list = items ?? []
  return list.map(({ year, month, statistics }) => ({
    year: year ?? 0,
    month: month ?? 0,
    statistics: mapStatistics(statistics),
  }))
}

type CategoryStatistics = {
  name?: string | null
  published?: number | null
}

type CategoryBreakdownInput = {
  year?: number | null
  month?: number | null
  categoryStatistics?: ReadonlyArray<CategoryStatistics> | null
}

type CategoryStatsOutput = {
  year: number
  month: number
  categoryStatistics: Array<{ name: string; published: number }>
}

export const mapCategoryStatisticsItems = (
  items: ReadonlyArray<CategoryBreakdownInput> | null | undefined = [],
): CategoryStatsOutput[] => {
  const list = items ?? []
  return list.map(({ year, month, categoryStatistics }) => ({
    year: year ?? 0,
    month: month ?? 0,
    categoryStatistics: (categoryStatistics ?? []).map((c) => ({
      name: c?.name ?? '',
      published: c?.published ?? 0,
    })),
  }))
}
