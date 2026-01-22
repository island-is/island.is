import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { DocumentProviderDashboardGetStatisticsByNationalId } from '@island.is/api/schema'
import { GET_STATISTICS_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { GetStatisticsByNationalIdReturnType } from '../lib/types'
import format from 'date-fns/format'

export const useGetStatisticsByNationalId = (
  fromDate?: Date,
  toDate?: Date,
): GetStatisticsByNationalIdReturnType => {
  const statisticsInput: DocumentProviderDashboardGetStatisticsByNationalId = {
    from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
  }

  const { data, loading, error } = useQuery(GET_STATISTICS_BY_NATIONALID, {
    variables: {
      input: statisticsInput,
    },
    fetchPolicy: 'cache-and-network',
  })

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, fromDate, toDate, formatMessage])

  const statistics = data?.statisticsByNationalId ?? null

  return {
    statistics,
    loading,
  }
}
