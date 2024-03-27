export type SystemMetadata<DataType> = DataType & {
  typename: string
}

export enum ChartDataSourceType {
  InternalJson = 'InternalJson',
  ExternalCsv = 'ExternalCsv',
  ExternalJson = 'ExternalJson',
}

export enum ChartDataSourceExternalJsonProvider {
  UltravioletRadiationLatest = 'UltravioletRadiationLatest',
  UltravioletRadiationSeries = 'UltravioletRadiationSeries',
}

export interface ChartStatisticKeyValue {
  key: string
  value: number | null
}
export interface ChartStatisticsForHeader {
  header: string
  headerType: string
  statisticsForHeader: ChartStatisticKeyValue[]
}
export interface ChartStatisticsQueryResponse {
  statistics: ChartStatisticsForHeader[]
}

export interface ChartDataSourceConfiguration {
  dataSourceType: ChartDataSourceType
  internalJson: ChartStatisticsQueryResponse
  externalCsvProviderUrl: string
  externalJsonProvider: ChartDataSourceExternalJsonProvider
}
