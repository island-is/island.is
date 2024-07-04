import { useMemo } from 'react'
import cn from 'classnames'

import {
  Icon,
  Inline,
  SkeletonLoader,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { ChartNumberBox as IChartNumberBox } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'

import { useGetChartData } from '../../hooks'
import { messages } from '../../messages'
import { ChartType } from '../../types'
import {
  formatPercentageForPresentation,
  formatValueForPresentation,
} from '../../utils'
import * as styles from './ChartNumberBox.css'

const formatNumberBoxPercentageForPresentation = (percentage: number) =>
  formatPercentageForPresentation(percentage, percentage < 0.1 ? 1 : 0)

type ChartNumberBoxRendererProps = {
  slice: IChartNumberBox & { chartNumberBoxId: string }
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
  const { format } = useDateUtils()

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

  const reduceAndRoundValue = slice.reduceAndRoundValue ?? true

  return (
    <div
      role="group"
      aria-labelledby={`${slice.chartNumberBoxId}.title`}
      className={cn({
        [styles.wrapper]: true,
        [styles.wrapperTwoChildren]: boxData.length === 2,
        [styles.wrapperThreeChildren]: boxData.length === 3,
      })}
    >
      {boxData.map((data, index) => {
        // We assume that the data behind the key that is provided is a valid number
        const comparisonValue = queryResult.data?.[data.sourceDataIndex]?.[
          data.sourceDataKey
        ] as number
        const mostRecentValue = queryResult.data[queryResult.data.length - 1][
          data.sourceDataKey
        ] as number

        const change = index === 0 ? 1 : mostRecentValue / comparisonValue

        const ariaValue =
          data.valueType === 'number'
            ? formatValueForPresentation(
                activeLocale,
                mostRecentValue,
                reduceAndRoundValue,
              )
            : formatNumberBoxPercentageForPresentation(
                index === 0 ? mostRecentValue : change - 1,
              )

        const displayedValue =
          data.valueType === 'number'
            ? formatValueForPresentation(
                activeLocale,
                mostRecentValue,
                reduceAndRoundValue,
              )
            : formatNumberBoxPercentageForPresentation(
                index === 0 ? mostRecentValue : Math.abs(change - 1),
              )

        const timestamp =
          slice.displayTimestamp &&
          index === 0 &&
          queryResult?.data?.[data.sourceDataIndex]?.header &&
          !isNaN(Number(queryResult.data[data.sourceDataIndex].header))
            ? format(
                new Date(Number(queryResult.data[data.sourceDataIndex].header)),
                'do MMM yyyy HH:mm',
              )
            : ''

        return (
          <div
            key={index}
            className={cn({
              [styles.numberBox]: true,
              [styles.numberBoxFillWidth]: boxData.length === 3 && index === 0,
            })}
            id={index === 0 ? `${slice.chartNumberBoxId}.title` : undefined}
            aria-label={`${data.title}: ${ariaValue}`}
            tabIndex={0}
          >
            <div className={styles.titleWrapper} id={`${slice.id}.title`}>
              <Inline space={1} alignY="center" justifyContent="spaceBetween">
                <h3 className={styles.title}>{data.title}</h3>
                {timestamp && <Text variant="small">({timestamp})</Text>}
              </Inline>
              {index === 0 && (
                <Tooltip
                  text={slice.numberBoxDescription}
                  placement={boxData.length === 1 ? 'left' : undefined}
                />
              )}
            </div>
            <p className={styles.value}>
              {index > 0 && change !== 0 && (
                <Icon
                  type="outline"
                  icon={change > 1 ? 'arrowUp' : 'arrowDown'}
                />
              )}
              <span>{displayedValue}</span>
            </p>
          </div>
        )
      })}
    </div>
  )
}
