import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { DocumentProviderDashboardGetStatisticsProvidersNationalId } from '@island.is/api/schema'
import { GET_STATISTIC_PROVIDERS_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { GetProvidersByNationalIdReturnType } from '../lib/types'
import format from 'date-fns/format'

export const useGetProvidersByNationalId = (
  fromDate?: Date,
  toDate?: Date,
  skip?: boolean,
): GetProvidersByNationalIdReturnType => {
  const statisticsInput: DocumentProviderDashboardGetStatisticsProvidersNationalId =
    {
      from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
      page: 1,
      pageSize: 25,
    }

  const { data, loading, error } = useQuery(
    GET_STATISTIC_PROVIDERS_BY_NATIONALID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
      skip: skip,
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, fromDate, toDate, formatMessage])

  const statistics = data?.statisticProvidersByNationalId ?? null

  return {
    ...(statistics ?? { items: [], totalCount: 0 }),
    loading,
  }
}
