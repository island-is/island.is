import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { DocumentProviderDashboardGetStatisticsBreakdownByProviderId } from '@island.is/api/schema'
import { GET_STATISTICS_OVERVIEW_BY_PROVIDERID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { GetStatisticsByNationalIdReturnType } from '../lib/types'
import format from 'date-fns/format'

export const useGetStatisticsOverviewByProviderId = (
  providerId?: string,
  fromDate?: Date,
  toDate?: Date,
): GetStatisticsByNationalIdReturnType => {
  const shouldSkip = !providerId

  const statisticsInput:
    | DocumentProviderDashboardGetStatisticsBreakdownByProviderId
    | undefined = !shouldSkip
    ? {
        providerId,
        from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
        to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
      }
    : undefined

  const { data, loading, error } = useQuery(
    GET_STATISTICS_OVERVIEW_BY_PROVIDERID,
    {
      variables: statisticsInput ? { input: statisticsInput } : undefined,
      fetchPolicy: 'cache-and-network',
      skip: shouldSkip,
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, fromDate, toDate, formatMessage])

  const statistics = data?.statisticsOverviewByProviderId ?? null

  return {
    statistics,
    loading,
  }
}
