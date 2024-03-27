import { ChartDataInput } from '../dto/getChartData.input'
import { StatisticsQueryResponse } from '../models/chartDataSource.model'

export type { ChartDataInput } from '../dto/getChartData.input'
export type ChartDataOutput = StatisticsQueryResponse

export interface ChartDataSourceExternalJsonProviderService {
  getChartData: (input: ChartDataInput) => Promise<ChartDataOutput>
}
