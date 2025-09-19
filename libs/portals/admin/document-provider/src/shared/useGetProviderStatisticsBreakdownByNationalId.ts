import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  ApiV1StatisticsNationalIdBreakdownGetRequest,
  CategoryStatisticsSortBy,
} from '@island.is/api/schema'
import { GET_PROVIDER_STATISTICS_BREAKDOWN_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import {
  DocumentProviderDashboardChartData,
  GetProviderStatisticsBreakdownReturnType,
  ProviderStatisticsBreakdown,
} from '../lib/types'
import { DELIVERY_PRICE } from '../lib/constants'
import format from 'date-fns/format'

export const useGetProviderStatisticsBreakdownByNationalId = (
  nationalId?: string,
  fromDate?: Date,
  toDate?: Date,
  sortBy?: string,
  desc = false,
  page = 1,
  pageSize = 10,
): GetProviderStatisticsBreakdownReturnType => {
  const statisticsInput: ApiV1StatisticsNationalIdBreakdownGetRequest = {
    nationalId: nationalId ?? '',
    from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
    sortBy: (sortBy as CategoryStatisticsSortBy) ?? 'Date',
    desc,
    page,
    pageSize,
  }

  const { data, loading, error } = useQuery(
    GET_PROVIDER_STATISTICS_BREAKDOWN_BY_NATIONALID,
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

  const breakdown = data?.statisticsBreakdownByNationalId ?? null

  // Prepare chart data if breakdown is available
  let chartData: Array<DocumentProviderDashboardChartData> | undefined
  if (breakdown) {
    chartData = breakdown.items.map(
      (
        item: ProviderStatisticsBreakdown,
      ): DocumentProviderDashboardChartData => ({
        name:
          item.year && item.month
            ? new Date(item.year, item.month - 1).toLocaleString('is', {
                month: 'short',
              })
            : 'Unknown',
        published: item.statistics.published,
        winning: item.statistics.published * DELIVERY_PRICE,
        opened: item.statistics.opened,
        failures: item.statistics.failures,
      }),
    )

    return {
      breakdown,
      chartData,
      loading,
    }
  }

  return {
    breakdown,
    chartData: [],
    loading,
  }
}
