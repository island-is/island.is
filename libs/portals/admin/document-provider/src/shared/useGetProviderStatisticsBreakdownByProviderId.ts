import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest,
  CategoryStatisticsSortBy,
  ProviderStatisticsBreakdown,
} from '@island.is/api/schema'
import { GET_PROVIDER_STATISTICS_BREAKDOWN_BY_PROVIDERID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  DocumentProviderDashboardChartData,
  GetProviderStatisticsBreakdownReturnType,
} from '../lib/types'
import { DELIVERY_PRICE } from '../lib/constants'

export const useGetProviderStatisticsBreakdownByProviderId = (
  providerId?: string,
  nationalId?: string,
  fromDate?: Date,
  toDate?: Date,
  sortBy?: string,
  desc = false,
  page = 1,
  pageSize = 10,
): GetProviderStatisticsBreakdownReturnType => {
  const statisticsInput: ApiV1StatisticsNationalIdProvidersProviderIdBreakdownGetRequest =
    {
      providerId: providerId ?? '',
      nationalId: nationalId ?? '',
      from: !toDate ? undefined : fromDate?.toISOString().slice(0, 10),
      to: !fromDate ? undefined : toDate?.toISOString().slice(0, 10),
      sortBy: (sortBy as CategoryStatisticsSortBy) ?? 'Date',
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
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, nationalId, fromDate, toDate, formatMessage])

  const breakdown = data?.statisticsBreakdownByProviderId ?? { totalCount: 0, items: [] }

  // Prepare chart data if breakdown is available
  const chartData: Array<DocumentProviderDashboardChartData>  | undefined =
    breakdown.items.length
      ? breakdown.items.map(
          (
            item: ProviderStatisticsBreakdown,
          ): DocumentProviderDashboardChartData => ({
            name:
              item.year && item.month
            ? new Date(item.year, item.month - 1).toLocaleString('is', {
                month: 'short',
              })
            : 'Unknown',
        published: item.statistics?.published ?? 0,
        winning: (item.statistics?.published ?? 0) * DELIVERY_PRICE,
        opened: item.statistics?.opened ?? 0,
        failures: item.statistics?.failures ?? 0,
      }),
    ): undefined
  

  return {
    breakdown,
    chartData,
    loading,
  }
}
