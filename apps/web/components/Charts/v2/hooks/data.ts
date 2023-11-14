import { useQuery } from '@apollo/client'
import pick from 'lodash/pick'

import {
  Chart,
  GetMultipleStatisticsQuery,
  GetMultipleStatisticsQueryVariables,
} from '@island.is/web/graphql/schema'
import { GET_MULTIPLE_STATISTICS } from '@island.is/web/screens/queries/Statistics'

import { ChartType } from '../types'

type QueryResponse = {
  getStatisticsByKeys: GetMultipleStatisticsQuery['getStatisticsByKeys']
}

interface UseGetChartDataProps {
  dateFrom?: Chart['dateFrom']
  dateTo?: Chart['dateTo']
  numberOfDataPoints?: Chart['numberOfDataPoints']
  components: {
    sourceDataKey: string
  }[]
  chartType: ChartType | null
}

export const useGetChartData = ({
  dateFrom,
  dateTo,
  numberOfDataPoints,
  components,
  chartType,
}: UseGetChartDataProps) => {
  const queryResult = useQuery<QueryResponse>(GET_MULTIPLE_STATISTICS, {
    variables: {
      input: {
        sourceDataKeys: components.map((c) => c.sourceDataKey),
        dateFrom: dateFrom ?? undefined,
        dateTo: dateTo ?? undefined,
        numberOfDataPoints: numberOfDataPoints ?? undefined,
        interval: undefined, // TODO
      },
    } as GetMultipleStatisticsQueryVariables,
  })

  const data =
    (chartType === ChartType.pie
      ? queryResult?.data?.getStatisticsByKeys?.statistics?.slice(-1)
      : queryResult?.data?.getStatisticsByKeys?.statistics
    )?.map((s) => ({
      ...s,
      ...s.statisticsForDate.reduce((obj, current) => {
        obj[current.key] = current.value
        return obj
      }, {} as Record<string, unknown>),
    })) ?? []

  return {
    ...pick(queryResult, ['loading', 'error']),
    data,
  }
}
