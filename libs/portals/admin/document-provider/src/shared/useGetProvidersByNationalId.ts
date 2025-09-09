import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import { ApiV1StatisticsNationalIdProvidersGetRequest } from '@island.is/api/schema'
import { GET_STATISTIC_PROVIDERS_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { GetProvidersByNationalIdReturnType } from '../lib/types'
import format from 'date-fns/format'

export const useGetProvidersByNationalId = (
  organisationId?: string,
  fromDate?: Date,
  toDate?: Date,
): GetProvidersByNationalIdReturnType => {
  const statisticsInput: ApiV1StatisticsNationalIdProvidersGetRequest = {
    nationalId: organisationId ?? '',
    from: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    to: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
  }

  const { data, loading, error } = useQuery(
    GET_STATISTIC_PROVIDERS_BY_NATIONALID,
    {
      variables: {
        input: statisticsInput,
      },
      fetchPolicy: 'cache-and-network',
      skip: !organisationId,
    },
  )

  const { formatMessage } = useLocale()
  useEffect(() => {
    if (!loading && error) {
      toast.error(formatMessage(m.statisticsBoxNetworkError))
    }
  }, [error, loading, organisationId, fromDate, toDate, formatMessage])

  const statistics = data?.statisticProvidersByNationalId ?? null

  return {
    ...(statistics ?? { items: [], totalCount: 0 }),
    loading,
  }
}
