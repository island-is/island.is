import { CategoryStatistics } from '../models/document-provider-dashboard/categoryStatistics.model'
import { ProviderStatisticsBreakdown } from '../models/document-provider-dashboard/providerStatisticsBreakdown.model'
import { ProviderStatisticsCategoryBreakdownPaginationResponse } from '../models/document-provider-dashboard/ProviderStatisticsCategoryBreakdownPaginationResponse.model'

export function mapStatistics(statistics?: {
  published?: number
  notifications?: number
  opened?: number
  failures?: number
}) {
  if (!statistics) {
    return undefined
  }
  return {
    published: statistics?.published ?? 0,
    notifications: statistics?.notifications ?? 0,
    opened: statistics?.opened ?? 0,
    failures: statistics?.failures ?? 0,
  }
}

export function mapBreakdownItems(items?: Array<any>) {
  return (items ?? []).map((item) => ({
    year: item.year ?? 0,
    month: item.month ?? 0,
    statistics: mapStatistics(item.statistics),
  }))
}

export function mapCategoryStatisticsItems(items?: Array<any>) {
  return (items ?? []).map((item) => ({
    year: item.year ?? 0,
    month: item.month ?? 0,
    categoryStatistics: item.categoryStatistics
      ? (item.categoryStatistics as Array<CategoryStatistics>).map(
          (category) => ({
            name: category.name ?? '',
            published: category.published ?? 0,
          }),
        )
      : [],
  }))
}
