import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { gql, useQuery } from '@apollo/client'
import {
  ApiV1StatisticsNationalIdProvidersGetRequest,
  ProviderStatistics,
  StatisticsInput,
} from '@island.is/api/schema'
import { GET_STATISTIC_PROVIDERS_BY_NATIONALID } from '../queries'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { GetProvidersByNationalIdReturnType } from '../lib/types'

export function useGetProvidersByNationalId(
  organisationId?: string,
  fromDate?: Date,
  toDate?: Date,
): GetProvidersByNationalIdReturnType {
  const statisticsInput: ApiV1StatisticsNationalIdProvidersGetRequest = {
    nationalId: organisationId ?? '',
    from: !toDate ? undefined : fromDate?.toISOString().slice(0, 10),
    to: !fromDate ? undefined : toDate?.toISOString().slice(0, 10),
  }

  const { data, loading, error } = useQuery(
    GET_STATISTIC_PROVIDERS_BY_NATIONALID,
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
  }, [error, loading, organisationId, fromDate, toDate, formatMessage])

  const statistics = data?.statisticProvidersByNationalId ?? null

  return {
    ...statistics,
    loading,
  }
}
