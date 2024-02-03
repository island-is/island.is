import { useMemo } from 'react'
import {
  AreaChart,
  BarChart,
  ComposedChart,
  LineChart,
  PieChart,
} from 'recharts'

import { Chart, ChartComponent } from '@island.is/api/schema'

import {
  COMPONENT_TYPES_WITH_FILL,
  PREDEFINED_FILL_PATTERNS,
  PREDEFINED_PIE_FILL_PATTERNS,
  PRIMARY_COLORS,
} from '../constants'
import {
  ChartComponentType,
  ChartComponentWithRenderProps,
  ChartType,
} from '../types'
import { decideChartBase } from '../utils'
import { decideComponentStyles } from '../utils/color'

const componentHasFill = (component: ChartComponent) =>
  COMPONENT_TYPES_WITH_FILL.includes(component.type as ChartComponentType)

export const useGetChartComponentsWithRenderProps = ({
  id,
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

// export const useGetChartComponentsWithRenderProps = ({
//   id,
//   components,
// }: Chart): ChartComponentWithRenderProps[] =>
//   useMemo(() => {
//     const stackLookup: Record<string, number[]> = {}
//     const chartType = decideChartBase(components)

//     for (let i = 0; i < components.length; i += 1) {
//       const component = components[i]

//       if (component.type === 'bar' && component.stackId) {
//         if (!stackLookup[component.stackId]) {
//           stackLookup[component.stackId] = []
//         }
//         stackLookup[component.stackId].push(i)
//       }
//     }

//     let currentIndexOfComponentWithFill = 0
//     let currentIndexOfComponentWithLine = 0

//     return components.map((c, i) => {
//       let shouldRenderBorderRadius = false
//       let fillIndex = 0
//       let lineIndex = 0

//       if (c.type === 'bar') {
//         const indicesForStack = c.stackId ? stackLookup[c.stackId] : []
//         const isLastInStack = i === indicesForStack[indicesForStack.length - 1]
//         if (!c.stackId || isLastInStack) {
//           shouldRenderBorderRadius = true
//         }
//       }

//       const hasFill = componentHasFill(c)
//       let fill

//       if (hasFill) {
//         fillIndex = currentIndexOfComponentWithFill

//         const patternId = `#pattern-${chartType}-${fillIndex}`
//         fill =
//           fillIndex <
//           (chartType === ChartType.pie
//             ? PREDEFINED_PIE_FILL_PATTERNS
//             : PREDEFINED_FILL_PATTERNS
//           ).length
//             ? `url(${patternId})`
//             : PRIMARY_COLORS[i]

//         currentIndexOfComponentWithFill += 1
//       } else if (c.type === 'line') {
//         lineIndex = currentIndexOfComponentWithLine
//         currentIndexOfComponentWithLine += 1
//       }

//       const color = PRIMARY_COLORS[i]

//       return {
//         ...c,
//         indexWithinType: c.type === 'line' ? lineIndex : fillIndex,
//         hasFill,
//         shouldRenderBorderRadius,
//         renderIndex: i,
//         fill,
//         color,
//       }
//     })
//   }, [components])

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
