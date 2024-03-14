import { ChartDataSourceExternalJsonProvider } from '@island.is/shared/types'

export interface StatisticsQueryInput {
  dateFrom?: Date
  dateTo?: Date
  numberOfDataPoints?: number
  interval?: number
  externalJsonProvider: ChartDataSourceExternalJsonProvider
}
