import { useEffect } from 'react'
import { toast } from '@island.is/island-ui/core'
import { gql, useQuery } from '@apollo/client'
import { ProviderStatistics, StatisticsInput } from '@island.is/api/schema'
import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'

export const getStatisticsTotal = gql`
  query GetStatisticsTotal($input: StatisticsInput!) {
    getStatisticsTotal(input: $input) {
      published
      notifications
      opened
    }
  }
`

type GetProviderStatisticsReturnType = {
  statistics: ProviderStatistics
  loading: boolean
}

export function useGetProviderStatistics(
  organisationId?: string,
  fromDate?: Date,
  toDate?: Date,
): GetProviderStatisticsReturnType {
  const statisticsInput: StatisticsInput = {
    organisationId,
    fromDate: !toDate ? undefined : fromDate?.toISOString().slice(0, 10),
    toDate: !fromDate ? undefined : toDate?.toISOString().slice(0, 10),
  }

  const { data, loading, error } = useQuery(getStatisticsTotal, {
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
  }, [error, loading, organisationId, fromDate, toDate, formatMessage])

  return {
    statistics: data?.getStatisticsTotal,
    loading,
  }
}
