import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId,
  DocumentProviderDashboardTotalStatisticsSortBy,
} from '@island.is/api/schema'
import { GET_PROVIDER_STATISTICS_BREAKDOWN_WITH_CATEGORY_BY_NATIONALID } from '../queries'
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

export const useGetProviderStatisticsBreakdownWCategoriesByNationalId = (
  fromDate?: Date,
  toDate?: Date,
  sortBy?: DocumentProviderDashboardTotalStatisticsSortBy,
  desc = false,
  page = 1,
  pageSize = 10,
): GetProviderStatisticsBreakdownWithCategoriesReturnType => {
  const statisticsInput: DocumentProviderDashboardGetStatisticsBreakdownWithCategoriesByNationalId =
    {
      from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
      sortBy: sortBy ?? DocumentProviderDashboardTotalStatisticsSortBy.Date,
      desc,
      page,
      pageSize,
    }

  const { data, loading, error } = useQuery(
    GET_PROVIDER_STATISTICS_BREAKDOWN_WITH_CATEGORY_BY_NATIONALID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, fromDate, toDate, formatMessage])

  const breakdown = data?.statisticsBreakdownWithCategoriesByNationalId ?? {
    totalCount: 0,
    items: [],
  }

  // Prepare chart data if breakdown is available
  let chartData: Array<SentFilesChartDataItem> | undefined

  if (breakdown && Array.isArray(breakdown.items)) {
    // Aggregate total published per category
    const categoryTotals: Record<string, number> = {}
    breakdown.items.forEach(
      (item: ProviderStatisticsBreakdownWithCategories) => {
        item.categoryStatistics.forEach((cat: CategoryItemChartData) => {
          categoryTotals[cat.name] =
            (categoryTotals[cat.name] || 0) + cat.published
        })
      },
    )

    // Get top 4 categories by published count
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([name]) => name)

    // Structure data for bar chart: one object per month, with 4 category fields
    chartData = breakdown.items.map(
      (item: ProviderStatisticsBreakdownWithCategories) => {
        const monthLabel =
          item.year != null && item.month != null
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
