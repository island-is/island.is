import React, { useCallback, useMemo, useState } from 'react'
import { ResponsiveContainer } from 'recharts'

import {
  AccordionCard,
  Box,
  Icon,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { Chart as IChart } from '@island.is/web/graphql/schema'
import { useI18n } from '@island.is/web/i18n'

import {
  CHART_HEIGHT,
  DEFAULT_XAXIS_KEY,
  DEFAULT_XAXIS_VALUE_TYPE,
} from '../constants'
import {
  useGetChartBaseComponent,
  useGetChartComponentsWithRenderProps,
  useGetChartData,
} from '../hooks'
import { messages } from '../messages'
import {
  ChartComponentType,
  ChartType,
  CustomStyleConfig,
  DataItem,
} from '../types'
import {
  calculateChartSkeletonLoaderHeight,
  createTickFormatter,
  decideChartBase,
  getCartesianGridComponents,
} from '../utils'
import { AccessibilityTableRenderer } from './AccessibilityTableRenderer'
import { renderChartComponents } from './ChartComponentRenderer'
import { renderLegend } from './LegendRenderer'
import { renderMultipleFillPatterns } from './PatternRenderer'
import { renderTooltip } from './TooltipRenderer'

type ChartProps = {
  slice: IChart
}

const getData = (slice: IChart, queryResult: DataItem[]) => {
  const base = slice.sourceData ? JSON.parse(slice.sourceData) : queryResult

  const values = slice.components.map((component) =>
    JSON.parse(component.values || '{}'),
  )

  if (values[0]?.typeOfSource !== 'manual') {
    return base
  }

  const sourceDataType = values[0]?.typeOfManualDataKey
  const componentType = slice.components[0]?.type

  if (componentType === ChartComponentType.pie) {
    const pieData = {
      statisticsForHeader: values
        .flatMap((item: { categoryItems: [] }) => item.categoryItems)
        .map((item: { key: string; value: string }) => ({
          key: item.key,
          value: parseFloat(item.value) || 0,
        })),
    }
    return [pieData]
  }

  const allItems = values.flatMap((item) =>
    sourceDataType === 'date' ? item.dateItems : item.categoryItems,
  )

  const groupedData = allItems.reduce(
    (acc: Record<string, Record<string, any>>, item) => {
      const key =
        sourceDataType === 'date'
          ? new Date(item.dateOfChange).getTime()
          : item.category

      if (!acc[key]) {
        acc[key] = { header: key }
      }

      acc[key][item.key] = item.value
      return acc
    },
    {},
  )

  return Object.values(groupedData).reverse()
}

export const Chart = ({ slice }: ChartProps) => {
  const customStyleConfig = useMemo(() => {
    if (!slice.customStyleConfig) {
      return {}
    }

    return JSON.parse(slice.customStyleConfig)
  }, [slice.customStyleConfig]) as CustomStyleConfig

  const chartType = decideChartBase(slice.components)
  const queryResult = useGetChartData({
    ...slice,
    chartType,
  })

  const { activeLocale } = useI18n()
  const tickFormatter = useCallback(
    (value: unknown) =>
      createTickFormatter(
        activeLocale,
        slice.xAxisValueType || DEFAULT_XAXIS_VALUE_TYPE,
        slice.xAxisFormat || undefined,
        slice.reduceAndRoundValue || undefined,
      )(value),
    [
      activeLocale,
      slice.xAxisValueType,
      slice.xAxisFormat,
      slice.reduceAndRoundValue,
    ],
  )

  const componentsWithAddedProps = useGetChartComponentsWithRenderProps(slice)
  const BaseChartComponent = useGetChartBaseComponent(slice)
  const chartUsesGrid = chartType !== ChartType.pie
  const [expanded, setExpanded] = useState(slice.startExpanded)
  const cartesianGridComponents = useMemo(
    () =>
      getCartesianGridComponents({
        activeLocale,
        chartUsesGrid,
        slice,
        tickFormatter,
        customStyleConfig,
      }),
    [activeLocale, chartUsesGrid, slice, tickFormatter, customStyleConfig],
  )

  if (BaseChartComponent === null || chartType === null) {
    return messages[activeLocale].renderError
  }

  if (queryResult.loading) {
    return (
      <SkeletonLoader
        width="100%"
        height={calculateChartSkeletonLoaderHeight(
          slice.displayAsCard,
          expanded,
        )}
        borderRadius="xl"
      />
    )
  }

  const xAxisKey = slice.xAxisKey || DEFAULT_XAXIS_KEY
  const xAxisValueType = slice.xAxisValueType || DEFAULT_XAXIS_VALUE_TYPE

  const data = getData(slice, queryResult.data ?? []).map(
    (d: Record<string, unknown>) => ({
      ...d,
      [xAxisKey]:
        xAxisValueType === 'date' || xAxisValueType === 'number'
          ? Number(d[xAxisKey])
          : d[xAxisKey],
    }),
  )

  if (!data || data.length === 0) {
    return messages[activeLocale].noDataForChart
  }

  const Wrapper = slice.displayAsCard ? AccordionCard : React.Fragment

  const skipId = `skip-chart_${slice.id}`

  return (
    <Box width="full" height="full">
      <a href={`#${skipId}`} className="visually-hidden">
        {messages[activeLocale].skipGraph} {slice.title}
      </a>
      <Wrapper
        id={slice.id}
        label={
          <>
            <span style={{ marginRight: '6px', paddingTop: '6px' }}>
              <Icon icon="cellular" type="outline" color="blue400" />
            </span>
            <Text variant="h3" as="span">
              {slice.title}
            </Text>
          </>
        }
        labelUse="h2"
        labelVariant="h3"
        expanded={expanded}
        visibleContent={slice['chartDescription']}
        onToggle={() => setExpanded(!expanded)}
      >
        <Box width="full" height="full" marginTop={2}>
          <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
            <BaseChartComponent
              data={data}
              layout={slice.flipAxis ? 'vertical' : 'horizontal'}
              margin={customStyleConfig.chart?.margin ?? undefined}
            >
              {cartesianGridComponents}
              {renderLegend({
                componentsWithAddedProps,
                data,
                customStyleConfig,
              })}
              {renderTooltip({
                slice,
                componentsWithAddedProps,
                tickFormatter,
              })}
              {renderMultipleFillPatterns({
                components: componentsWithAddedProps,
              })}
              {renderChartComponents({
                componentsWithAddedProps,
                chartType,
                data,
                activeLocale,
                customStyleConfig,
              })}
            </BaseChartComponent>
          </ResponsiveContainer>
        </Box>
      </Wrapper>
      <AccessibilityTableRenderer
        id={skipId}
        activeLocale={activeLocale}
        chart={slice}
        componentsWithAddedProps={componentsWithAddedProps}
        data={data}
      />
    </Box>
  )
}
