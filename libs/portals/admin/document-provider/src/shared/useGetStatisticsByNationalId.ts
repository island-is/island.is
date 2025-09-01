import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { ApiV1StatisticsNationalIdCategoriesGetRequest } from '@island.is/api/schema'
import { GET_STATISTICS_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { GetStatisticsByNationalIdReturnType } from '../lib/types'

export function useGetStatisticsByNationalId(
  nationalId?: string,
  fromDate?: Date,
  toDate?: Date,
): GetStatisticsByNationalIdReturnType {
  const statisticsInput: ApiV1StatisticsNationalIdCategoriesGetRequest = {
    nationalId: nationalId ?? '',
    from: !toDate ? undefined : fromDate?.toISOString().slice(0, 10),
    to: !fromDate ? undefined : toDate?.toISOString().slice(0, 10),
  }

  const { data, loading, error } = useQuery(GET_STATISTICS_BY_NATIONALID, {
    variables: {
      input: statisticsInput,
    },
    fetchPolicy: 'cache-and-network',
    skip: !nationalId,
  })

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, nationalId, fromDate, toDate, formatMessage])

  const statistics = data?.statisticsByNationalId ?? null

  return {
    statistics,
    loading,
  }
}
