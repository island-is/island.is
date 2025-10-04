export type ProviderStatisticCategory = {
  name: string
  published: number
  color: string
  value: number
}

export type GetProviderStatisticCategoriesReturnType = {
  categories: Array<ProviderStatisticCategory>
  loading: boolean
}

export type ProviderStatistic = {
  published: number
  notifications: number
  opened: number
  failures: number
}

export type ProviderStatisticsBreakdownPaginationResponse = {
  totalCount: number
  items: Array<ProviderStatisticsBreakdown>
}

export type ProviderStatisticsBreakdown = {
  year: number
  month: number
  statistics: ProviderStatistic
}

export type GetProviderStatisticsBreakdownReturnType = {
  breakdown: ProviderStatisticsBreakdownPaginationResponse | null
  chartData?: Array<DocumentProviderDashboardChartData>
  loading: boolean
}
export type GetProviderStatisticsBreakdownWithCategoriesReturnType = {
  breakdown: ProviderStatisticsBreakdownWithCategoriesPaginationResponse
  chartData?: Array<SentFilesChartDataItem>
  loading: boolean
}

export type ProviderStatisticsBreakdownWithCategoriesPaginationResponse = {
  totalCount: number
  items: Array<ProviderStatisticsBreakdownWithCategories>
}

export type ProviderStatisticsBreakdownWithCategories = {
  year: number
  month: number
  categoryStatistics: Array<CategoryItemChartData>
}

export type SentFilesChartDataItem = {
  name: string
  cat1: SentFilesChartDataItemInfo
  cat2: SentFilesChartDataItemInfo
  cat3: SentFilesChartDataItemInfo
  cat4: SentFilesChartDataItemInfo
}

export type SentFilesChartDataItemInfo = {
  name: string
  published: number
}

export type DocumentProviderDashboardChartData = {
  name: string
  published: number
  failures: number
  opened: number
  winning: number
}

export type CategoryItemChartData = {
  name: string
  published: number
}

export type ChartBarData = {
  dataKey: string
  name: string
  color?: string
}

export type StatisticsOverview = {
  providerCount: number
  statistics: ProviderStatistic
  name?: string
}

export type GetStatisticsByNationalIdReturnType = {
  statistics: StatisticsOverview | null
  loading: boolean
}

export type ProviderInfo = {
  providerId: string
  name: string
  statistics: ProviderStatistic
}

export type GetProvidersByNationalIdReturnType = {
  items: Array<ProviderInfo>
  totalCount: number
  loading: boolean
}

export interface StatisticsBoxData {
  name: string
  value: number
}

export interface SentFilesAndErrorsChartData {
  name: string
  failures: number
  opened: number
}
