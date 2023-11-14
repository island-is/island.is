import { useMemo } from 'react'
import round from 'lodash/round'

import { Icon, SkeletonLoader } from '@island.is/island-ui/core'
import { ChartNumberBox as IChartNumberBox } from '@island.is/web/graphql/schema'

import { useGetChartData } from '../../hooks'
import { ChartType } from '../../types'
import { formatValueForPresentation } from '../../utils'
import * as styles from './NumberBox.css'

type NumberBoxRendererProps = {
  slice: IChartNumberBox
}

interface NumberBoxData {
  title: string
  sourceDataKey: string
  sourceDataIndex: number
  value: number
  description?: string
  valueType: 'number' | 'percentage'
}

export const NumberBoxRenderer = ({ slice }: NumberBoxRendererProps) => {
  const numberOfDataPoints = slice.displayChangeYearOverYear
    ? 13
    : slice.displayChangeMonthOverMonth
    ? 2
    : 1
  const queryResult = useGetChartData({
    numberOfDataPoints,
    chartType: ChartType.mixed,
    components: [slice],
  })

  const boxData = useMemo(() => {
    const result: NumberBoxData[] = [
      {
        title: slice.title,
        sourceDataKey: slice.sourceDataKey,
        sourceDataIndex: slice.displayChangeYearOverYear
          ? 12
          : slice.displayChangeMonthOverMonth
          ? 1
          : 0,
        description: slice.numberBoxDescription,
        value: 13,
        valueType: slice.valueType as NumberBoxData['valueType'],
      },
    ]

    if (slice.displayChangeMonthOverMonth) {
      result.push({
        title: 'Breyting milli mánaða',
        sourceDataKey: slice.sourceDataKey,
        sourceDataIndex: numberOfDataPoints - 2,
        value: 0.01,
        valueType: 'percentage',
      })
    }

    if (slice.displayChangeYearOverYear) {
      result.push({
        title: 'Breyting milli ára',
        sourceDataKey: slice.sourceDataKey,
        sourceDataIndex: 0,
        value: 0.03,
        valueType: 'percentage',
      })
    }

    return result
  }, [slice, numberOfDataPoints])

  if (queryResult.loading) {
    return <SkeletonLoader width="100%" height={130} borderRadius="xl" />
  }

  if (!queryResult.data || queryResult.data.length === 0) {
    return <p>Could not load chart data</p>
  }

  return (
    <div className={styles.wrapper}>
      {boxData.map((data, index) => {
        const value =
          // eslint-disable-next-line
          // @ts-ignore
          queryResult.data?.[data.sourceDataIndex]?.[data.sourceDataKey]

        const mostRecentValue =
          // eslint-disable-next-line
          // @ts-ignore
          queryResult.data[queryResult.data.length - 1][data.sourceDataKey]

        const divider = index === 0 ? 1 : mostRecentValue

        const result = index === 0 ? value : round(1 - value / divider, 2)

        return (
          <div
            className={styles.numberBox}
            style={{
              flex: '1',
            }}
          >
            <h3 className={styles.title}>{data.title}</h3>
            <p className={styles.value}>
              {index > 0 && result !== 0 && (
                <Icon
                  type="outline"
                  icon={result > 0 ? 'arrowUp' : 'arrowDown'}
                />
              )}
              <span>
                {data.valueType === 'number'
                  ? formatValueForPresentation(result)
                  : `${result * 100}%`}
              </span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
