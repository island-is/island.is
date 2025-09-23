import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  GetStatisticsBreakdownWithCategoriesByProviderId,
  CategoryStatisticsSortBy,
} from '@island.is/api/schema'
import { GET_PROVIDER_STATISTICS_BREAKDOWN_WITH_CATEGORY_BY_PROVIDERID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  CategoryItemChartData,
  GetProviderStatisticsBreakdownWithCategoriesReturnType,
  ProviderStatisticsBreakdownWithCategories,
  SentFilesChartDataItem,
  SentFilesChartDataItemInfo,
} from '../lib/types'
import format from 'date-fns/format'

export const useGetProviderStatisticsBreakdownWCategoriesByProviderId = (
  providerId?: string,
  nationalId?: string,
  fromDate?: Date,
  toDate?: Date,
  sortBy?: CategoryStatisticsSortBy,
  desc = false,
  page = 1,
  pageSize = 10,
): GetProviderStatisticsBreakdownWithCategoriesReturnType => {
  const statisticsInput: GetStatisticsBreakdownWithCategoriesByProviderId =
    {
      providerId: providerId ?? '',
      nationalId: nationalId ?? '',
      from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
      sortBy: sortBy ?? CategoryStatisticsSortBy.Date,
      desc,
      page,
      pageSize,
    }

  const { data, loading, error } = useQuery(
    GET_PROVIDER_STATISTICS_BREAKDOWN_WITH_CATEGORY_BY_PROVIDERID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
      skip: !providerId || !nationalId,
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, nationalId, fromDate, toDate, formatMessage])

  const breakdown = data?.statisticsBreakdownWithCategoriesByProviderId ?? {
    totalCount: 0,
    items: [],
  }

  // Prepare chart data if breakdown is available
  let chartData: Array<SentFilesChartDataItem> | undefined

  if (breakdown && Array.isArray(breakdown.items)) {
    // 1. Aggregate total published per category
    const categoryTotals: Record<string, number> = {}
    breakdown.items.forEach(
      (item: ProviderStatisticsBreakdownWithCategories) => {
        item.categoryStatistics.forEach((cat: CategoryItemChartData) => {
          categoryTotals[cat.name] =
            (categoryTotals[cat.name] || 0) + cat.published
        })
      },
    )

    // 2. Get top 4 categories by published count
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name)

    // 3. Structure data for bar chart: one object per month, with 4 category fields
    chartData = breakdown.items.map(
      (item: ProviderStatisticsBreakdownWithCategories) => {
        const monthLabel =
           item.year && item.month && item.month >= 1 && item.month <= 12
            ? new Date(item.year, item.month - 1).toLocaleString('is', {
                month: 'short',
              })
            : 'Unknown'

        // Find category data for each top category, default to 0 if not present
        const cats: SentFilesChartDataItemInfo[] = topCategories.map(
          (catName) => {
            const cat = item.categoryStatistics.find(
              (c: CategoryItemChartData) => c.name === catName,
            )
            return {
              name: catName,
              published: cat ? cat.published : 0,
            }
          },
        )

        // Fill up to 4 categories (if less than 4 exist)
        while (cats.length < 4) {
          cats.push({ name: '', published: 0 })
        }

        return {
          name: monthLabel,
          cat1: cats[0],
          cat2: cats[1],
          cat3: cats[2],
          cat4: cats[3],
        }
      },
    )
  }
  return {
    breakdown,
    chartData,
    loading,
  }
}
