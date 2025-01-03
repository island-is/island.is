import { useMemo } from 'react'
import {
  AreaChart,
  BarChart,
  ComposedChart,
  LineChart,
  PieChart,
} from 'recharts'

import { Chart } from '@island.is/web/graphql/schema'

import { ChartComponentWithRenderProps, ChartType } from '../types'
import { decideChartBase } from '../utils'
import { decideComponentStyles } from '../utils/color'

export const useGetChartComponentsWithRenderProps = ({
  components,
}: Chart): ChartComponentWithRenderProps[] =>
  useMemo(
    () =>
      decideComponentStyles(components).map((style, i) => ({
        ...style,
        ...components[i],
        indexWithinType: style.renderIndexForType,
      })),
    [components],
  )

export const useGetChartBaseComponent = (chart: Chart) => {
  const chartType = decideChartBase(chart.components)

  if (chartType === ChartType.bar) {
    return BarChart
  } else if (chartType === ChartType.line) {
    return LineChart
  } else if (chartType === ChartType.pie) {
    return PieChart
  } else if (chartType === ChartType.area) {
    return AreaChart
  } else if (chartType === ChartType.mixed) {
    return ComposedChart
  }

  return null
}
