import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { ApiV1StatisticsNationalIdProvidersProviderIdGetRequest } from '@island.is/api/schema'
import { GET_STATISTICS_OVERVIEW_BY_PROVIDERID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { GetStatisticsByNationalIdReturnType } from '../lib/types'

export function useGetStatisticsOverviewByProviderId(
  nationalId?: string,
  providerId?: string,
  fromDate?: Date,
  toDate?: Date,
): GetStatisticsByNationalIdReturnType {
  const statisticsInput: ApiV1StatisticsNationalIdProvidersProviderIdGetRequest =
    {
      nationalId: nationalId!,
      providerId: providerId!,
      from: fromDate ? fromDate.toISOString().slice(0, 10) : undefined,
      to: toDate ? toDate.toISOString().slice(0, 10) : undefined,
    }

  const shouldSkip = !nationalId || !providerId
  const { data, loading, error } = useQuery(
    GET_STATISTICS_OVERVIEW_BY_PROVIDERID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
      skip: shouldSkip,
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, nationalId, fromDate, toDate, formatMessage])

  const statistics = data?.statisticsOverviewByProviderId ?? null

  return {
    statistics,
    loading,
  }
}
