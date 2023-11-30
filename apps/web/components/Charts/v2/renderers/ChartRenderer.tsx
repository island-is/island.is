import React, { useMemo, useState } from 'react'
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

import { CHART_HEIGHT } from '../constants'
import {
  useGetChartBaseComponent,
  useGetChartComponentsWithRenderProps,
  useGetChartData,
} from '../hooks'
import { messages } from '../messages'
import { ChartType } from '../types'
import {
  calculateChartSkeletonLoaderHeight,
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

export const Chart = ({ slice }: ChartProps) => {
  const chartType = decideChartBase(slice.components)
  const queryResult = useGetChartData({
    ...slice,
    chartType,
  })
  const componentsWithAddedProps = useGetChartComponentsWithRenderProps(slice)
  const BaseChartComponent = useGetChartBaseComponent(slice)
  const chartUsesGrid = chartType !== ChartType.pie
  const [expanded, setExpanded] = useState(slice.startExpanded)
  const { activeLocale } = useI18n()
  const cartesianGridComponents = useMemo(
    () => getCartesianGridComponents(activeLocale, chartUsesGrid),
    [activeLocale, chartUsesGrid],
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
      />
    )
  }

  if (!queryResult.data || queryResult.data.length === 0) {
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
              data={queryResult.data}
              width={400}
              height={400}
            >
              {cartesianGridComponents}
              {renderLegend({
                componentsWithAddedProps,
                data: queryResult.data,
              })}
              {renderTooltip({
                componentsWithAddedProps,
                chartType,
              })}
              {renderMultipleFillPatterns({
                components: componentsWithAddedProps,
                chartType,
              })}
              {renderChartComponents({
                componentsWithAddedProps,
                chartType,
                data: queryResult.data,
                activeLocale,
              })}
            </BaseChartComponent>
          </ResponsiveContainer>
        </Box>
      </Wrapper>
      <AccessibilityTableRenderer
        id={skipId}
        chart={slice}
        componentsWithAddedProps={componentsWithAddedProps}
        data={queryResult.data}
      />
    </Box>
  )
}
