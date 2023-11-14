import React, { useState } from 'react'
import { CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  AccordionCard,
  Box,
  Icon,
  SkeletonLoader,
  Text,
} from '@island.is/island-ui/core'
import { Chart as IChart } from '@island.is/web/graphql/schema'

import {
  useGetChartBaseComponent,
  useGetChartComponentsWithRenderProps,
  useGetChartData,
} from '../hooks'
import { ChartType } from '../types'
import { decideChartBase, formatDate } from '../utils'
import { AccessibilityTableRenderer } from './AccessibilityTableRenderer'
import { renderChartComponents } from './ChartComponentRenderer'
import { renderLegend } from './LegendRenderer'
import { renderMultipleFillPatterns } from './PatternRenderer'
import { renderTooltip } from './TooltipRenderer'

const CHART_HEIGHT = 500

type ChartProps = {
  slice: IChart
}

export const ChartRenderer = ({ slice }: ChartProps) => {
  const chartType = decideChartBase(slice.components)
  const queryResult = useGetChartData({
    ...slice,
    chartType,
  })
  const componentsWithAddedProps = useGetChartComponentsWithRenderProps(slice)
  const BaseChartComponent = useGetChartBaseComponent(slice)
  const chartUsesGrid = chartType !== ChartType.pie
  const [expanded, setExpanded] = useState(true)

  if (BaseChartComponent === null || chartType === null) {
    return <p>Could not render chart</p>
  }

  if (queryResult.loading) {
    return <SkeletonLoader width="100%" height={CHART_HEIGHT} />
  }

  if (!queryResult.data || queryResult.data.length === 0) {
    // TODO:
    return <p>No data for chart</p>
  }

  const Wrapper = slice.displayAsCard ? AccordionCard : React.Fragment

  const skipId = `skip-chart_${slice.id}`

  return (
    <Box width="full" height="full">
      <a href={`#${skipId}`} className="visually-hidden">
        Sleppa grafi, {slice.alternativeDescription}
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
              {chartUsesGrid && CARTASIAN_GRID_HELPERS.map((helper) => helper)}
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

const CARTASIAN_GRID_HELPERS = [
  <CartesianGrid
    stroke="rgb(0, 97, 255, 0.2)"
    strokeDasharray="4 4"
    vertical={false}
  />,

  <XAxis
    axisLine={{ stroke: '#CCDFFF' }}
    aria-hidden="true"
    dataKey="date"
    tickFormatter={formatDate}
    style={{
      fontSize: '1rem',
      fontFamily: 'IBM Plex Sans',
      color: 'red',
    }}
  />,
  <YAxis
    axisLine={{ stroke: '#CCDFFF' }}
    aria-hidden="true"
    type="number"
    style={{
      fontSize: '1rem',
      fontFamily: 'IBM Plex Sans',
    }}
    tickFormatter={(v) => {
      if (typeof v === 'number') {
        if (v < 1000) {
          return v
        }
        return `${Math.round(v / 1000)} þ`
      }
      return v
    }}
  />,
]
