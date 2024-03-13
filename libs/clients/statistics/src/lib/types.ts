export interface GetStatisticsQuery {
  sourceDataKeys: string[]
  dateFrom?: Date
  dateTo?: Date
  numberOfDataPoints?: number
  interval?: number
}

export interface SourceValue {
  header: string
  value: number | null
}

export interface GetSingleStatisticQuery {
  sourceDataKey: string
  dateFrom?: Date
  dateTo?: Date
  numberOfDataPoints?: number
  interval?: number
  sourceData: StatisticSourceData
}

export type StatisticSourceData = {
  data: Record<string, SourceValue[]>
}
