import type { StatisticSourceData } from '@island.is/shared/types'

export interface GetStatisticsQuery {
  sourceDataKeys: string[]
  dateFrom?: Date
  dateTo?: Date
  numberOfDataPoints?: number
  interval?: number
}

export interface GetSingleStatisticQuery {
  sourceDataKey: string
  dateFrom?: Date
  dateTo?: Date
  numberOfDataPoints?: number
  interval?: number
  sourceData: StatisticSourceData
}
