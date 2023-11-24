import { useMemo } from 'react'
import round from 'lodash/round'

import { Icon, SkeletonLoader } from '@island.is/island-ui/core'
import { ChartNumberBox as IChartNumberBox } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import { useGetChartData } from '../../hooks'
import { messages } from '../../messages'
import { ChartType } from '../../types'
import { formatValueForPresentation } from '../../utils'
import * as styles from './ChartNumberBox.css'

type ChartNumberBoxRendererProps = {
  slice: IChartNumberBox
}

interface ChartNumberBoxData {
  title: string
  sourceDataKey: string
  sourceDataIndex: number
  description?: string
  valueType: 'number' | 'percentage'
}

export const ChartNumberBox = ({ slice }: ChartNumberBoxRendererProps) => {
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
  const { activeLocale } = useI18n()

  const boxData = useMemo(() => {
    const result: ChartNumberBoxData[] = [
      {
        title: slice.title,
        sourceDataKey: slice.sourceDataKey,
        sourceDataIndex: slice.displayChangeYearOverYear
          ? 12
          : slice.displayChangeMonthOverMonth
          ? 1
          : 0,
        description: slice.numberBoxDescription,
        valueType: slice.valueType as ChartNumberBoxData['valueType'],
      },
    ]

    if (slice.displayChangeMonthOverMonth) {
      result.push({
        title: messages[activeLocale].changeMOM,
        sourceDataKey: slice.sourceDataKey,
        sourceDataIndex: numberOfDataPoints - 2,
        valueType: 'percentage',
      })
    }

    if (slice.displayChangeYearOverYear) {
      result.push({
        title: messages[activeLocale].changeYOY,
        sourceDataKey: slice.sourceDataKey,
        sourceDataIndex: 0,
        valueType: 'percentage',
      })
    }

    return result
  }, [slice, numberOfDataPoints, activeLocale])

  if (queryResult.loading) {
    return <SkeletonLoader width="100%" height={130} borderRadius="xl" />
  }

  if (!queryResult.data || queryResult.data.length === 0) {
    return <p>{messages[activeLocale].noDataForChart}</p>
  }

  return (
    <div className={styles.wrapper}>
      {boxData.map((data, index) => {
        // We assume that the data that key that is provided is a valid number
        const value = queryResult.data?.[data.sourceDataIndex]?.[
          data.sourceDataKey
        ] as number
        const mostRecentValue = queryResult.data[queryResult.data.length - 1][
          data.sourceDataKey
        ] as number

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
                  ? formatValueForPresentation(activeLocale, result)
                  : `${Math.abs(result) * 100}%`}
              </span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
