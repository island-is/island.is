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
    return <SkeletonLoader width="100%" height={130} borderRadius="lg" />
  }

  // Empty data (e.g. a withheld value) still renders the titled box with "–"
  const chartData = queryResult.data ?? []
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
        const comparisonValue =
          chartData[data.sourceDataIndex]?.[data.sourceDataKey]
        const mostRecentValue =
          chartData[chartData.length - 1]?.[data.sourceDataKey]

        // A null value is withheld or missing and must not be shown as 0.
        // A zero baseline has no meaningful change, so it can't show Infinity%
        const hasValue =
          typeof mostRecentValue === 'number' &&
          (index === 0 ||
            (typeof comparisonValue === 'number' && comparisonValue !== 0))

        const change =
          index > 0 &&
          hasValue &&
          typeof mostRecentValue === 'number' &&
          typeof comparisonValue === 'number'
            ? mostRecentValue / comparisonValue
            : 1

        const ariaValue = !hasValue
          ? messages[activeLocale].valueNotAvailable
          : data.valueType === 'number'
          ? formatValueForPresentation(
              activeLocale,
              mostRecentValue,
              reduceAndRoundValue,
            )
          : formatNumberBoxPercentageForPresentation(
              index === 0 ? mostRecentValue : change - 1,
            )

        const displayedValue = !hasValue
          ? '–'
          : data.valueType === 'number'
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
            <div className={styles.titleWrapper}>
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
              {index > 0 && hasValue && change !== 0 && (
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
