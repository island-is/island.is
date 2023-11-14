import { useMemo } from 'react'

import { Chart, ChartComponent } from '@island.is/api/schema'

import {
  ChartComponentType,
  ChartComponentWithRenderProps,
  ChartType,
} from '../types'
import {
  COMPONENT_TYPES_WITH_FILL,
  DEFAULT_COLORS,
  PREDEFINED_FILL_PATTERNS,
  PREDEFINED_PIE_FILL_PATTERNS,
} from '../constants'
import { decideChartBase } from '../utils'
import {
  AreaChart,
  BarChart,
  ComposedChart,
  LineChart,
  PieChart,
} from 'recharts'

const componentHasFill = (component: ChartComponent) =>
  COMPONENT_TYPES_WITH_FILL.includes(component.type as ChartComponentType)

export const useGetChartComponentsWithRenderProps = ({
  id,
  components,
}: Chart): ChartComponentWithRenderProps[] =>
  useMemo(() => {
    const stackLookup: Record<string, number[]> = {}
    const chartType = decideChartBase(components)

    for (let i = 0; i < components.length; i += 1) {
      const component = components[i]

      if (component.type === 'bar' && component.stackId) {
        if (!stackLookup[component.stackId]) {
          stackLookup[component.stackId] = []
        }
        stackLookup[component.stackId].push(i)
      }
    }

    let currentIndexOfComponentWithFill = 0
    let currentIndexOfComponentWithLine = 0

    return components.map((c, i) => {
      let shouldRenderBorderRadius = false
      let fillIndex = 0
      let lineIndex = 0

      if (c.type === 'bar') {
        const indicesForStack = c.stackId ? stackLookup[c.stackId] : []
        const isLastInStack = i === indicesForStack[indicesForStack.length - 1]
        if (!c.stackId || isLastInStack) {
          shouldRenderBorderRadius = true
        }
      }

      const hasFill = componentHasFill(c)
      let fill

      if (hasFill) {
        fillIndex = currentIndexOfComponentWithFill

        const patternId = `#pattern-${chartType}-${fillIndex}`
        fill =
          fillIndex <
          (chartType === ChartType.pie
            ? PREDEFINED_PIE_FILL_PATTERNS
            : PREDEFINED_FILL_PATTERNS
          ).length
            ? `url(${patternId})`
            : DEFAULT_COLORS[i]

        currentIndexOfComponentWithFill += 1
      } else if (c.type === 'line') {
        lineIndex = currentIndexOfComponentWithLine
        currentIndexOfComponentWithLine += 1
      }

      const color = DEFAULT_COLORS[i]

      return {
        ...c,
        indexWithinType: c.type === 'line' ? lineIndex : fillIndex,
        hasFill,
        shouldRenderBorderRadius,
        renderIndex: i,
        fill,
        color,
      }
    })
  }, [components])

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
