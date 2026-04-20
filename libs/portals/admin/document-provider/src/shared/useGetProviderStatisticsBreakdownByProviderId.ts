import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  DocumentProviderDashboardGetStatisticsBreakdownByProviderId,
  DocumentProviderDashboardCategoryStatisticsSortBy,
  DocumentProviderDashboardProviderStatisticsBreakdown,
} from '@island.is/api/schema'
import { GET_PROVIDER_STATISTICS_BREAKDOWN_BY_PROVIDERID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  DocumentProviderDashboardChartData,
  GetProviderStatisticsBreakdownReturnType,
} from '../lib/types'
import { DOCUMENT_DELIVERY_PRICE_ISK } from '../lib/constants'
import format from 'date-fns/format'

export const useGetProviderStatisticsBreakdownByProviderId = (
  providerId?: string,
  fromDate?: Date,
  toDate?: Date,
  sortBy?: string,
  desc = false,
  page = 1,
  pageSize = 10,
): GetProviderStatisticsBreakdownReturnType => {
  const statisticsInput: DocumentProviderDashboardGetStatisticsBreakdownByProviderId =
    {
      providerId: providerId ?? '',
      from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
      sortBy:
        (sortBy as DocumentProviderDashboardCategoryStatisticsSortBy) ??
        DocumentProviderDashboardCategoryStatisticsSortBy.Date,
      desc,
      page,
      pageSize,
    }

  const { data, loading, error } = useQuery(
    GET_PROVIDER_STATISTICS_BREAKDOWN_BY_PROVIDERID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
      skip: !providerId,
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, fromDate, toDate, formatMessage])

  const breakdown = data?.statisticsBreakdownByProviderId ?? {
    totalCount: 0,
    items: [],
  }

  // Prepare chart data if breakdown is available
  const chartData: Array<DocumentProviderDashboardChartData> | undefined =
    breakdown.items.length
      ? breakdown.items.map(
          (
            item: DocumentProviderDashboardProviderStatisticsBreakdown,
          ): DocumentProviderDashboardChartData => ({
            name:
              item.year && item.month
                ? new Date(item.year, item.month - 1).toLocaleString('is', {
                    month: 'short',
                  })
                : 'Unknown',
            published: item.statistics?.published ?? 0,
            winning:
              (item.statistics?.published ?? 0) * DOCUMENT_DELIVERY_PRICE_ISK,
            opened: item.statistics?.opened ?? 0,
            failures: item.statistics?.failures ?? 0,
          }),
        )
      : undefined

  return {
    breakdown,
    chartData,
    loading,
  }
}
