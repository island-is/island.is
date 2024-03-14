import { StatisticsQueryInput } from '../dto/getChartData.input'
import { StatisticsQueryResponse } from '../models/chartDataSource.model'

export type ChartDataInput = StatisticsQueryInput
export type ChartDataOutput = Promise<StatisticsQueryResponse>

export interface ChartDataSourceExternalJsonProviderService {
  getChartData: (input: ChartDataInput) => ChartDataOutput
}
