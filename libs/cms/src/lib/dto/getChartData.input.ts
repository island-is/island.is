import { ChartDataSourceExternalJsonProvider } from '@island.is/shared/types'

export interface ChartDataInput {
  dateFrom?: Date
  dateTo?: Date
  numberOfDataPoints?: number
  interval?: number
  externalJsonProvider: ChartDataSourceExternalJsonProvider
}
