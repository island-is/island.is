import omit from 'lodash/omit'
import pick from 'lodash/pick'
import { useQuery } from '@apollo/client'

import {
  Chart,
  GetMultipleStatisticsQuery,
  GetMultipleStatisticsQueryVariables,
  Maybe,
} from '@island.is/web/graphql/schema'
import { GET_MULTIPLE_STATISTICS } from '@island.is/web/screens/queries/Statistics'

import { ChartType, DataItem, DataItemDynamicKeys } from '../types'

type QueryResponse = {
  getStatisticsByKeys: GetMultipleStatisticsQuery['getStatisticsByKeys']
}

interface UseGetChartDataProps {
  dateFrom?: Chart['dateFrom']
  dateTo?: Chart['dateTo']
  numberOfDataPoints?: Chart['numberOfDataPoints']
  components: {
    sourceDataKey: string
    interval?: Maybe<number>
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
        // TODO: move interval out of chart components and
        // into chart settings, one interval to control all components.
        // Meanwhile, let the smallest defined (if any) interval control the rest
        interval: components.reduce((interval, component) => {
          if (typeof component.interval !== 'number') {
            return interval
          }

          if (typeof interval !== 'number') {
            return component.interval
          }

          return component.interval < interval ? component.interval : interval
        }, undefined as undefined | number),
        dateFrom: dateFrom ?? undefined,
        dateTo: dateTo ?? undefined,
        numberOfDataPoints: numberOfDataPoints ?? undefined,
      },
    } as GetMultipleStatisticsQueryVariables,
  })

  const data =
    (chartType === ChartType.pie
      ? queryResult?.data?.getStatisticsByKeys?.statistics?.slice(-1)
      : queryResult?.data?.getStatisticsByKeys?.statistics
    )?.map(
      (s) =>
        ({
          ...s,
          ...s.statisticsForDate.reduce((obj, current) => {
            if (current.value !== undefined) {
              obj[current.key] = current.value
            }
            return obj
          }, {} as DataItemDynamicKeys),
        } as DataItem),
    ) ?? []

  return {
    ...pick(queryResult, ['loading', 'error']),
    data,
  }
}
