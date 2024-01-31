import { Area, Bar, Cell, Label, Line, Pie } from 'recharts'

import type { Locale } from '@island.is/shared/types'

import { PREDEFINED_LINE_DASH_PATTERNS } from '../constants'
import {
  ChartComponentType,
  ChartComponentWithRenderProps,
  ChartData,
  ChartType,
} from '../types'
import {
  formatPercentageForPresentation,
  formatValueForPresentation,
} from '../utils'

interface ChartComponentRendererProps {
  component: ChartComponentWithRenderProps
}

export const renderChartComponent = ({
  component,
}: ChartComponentRendererProps) => {
  const commonProps = {
    dataKey: component.sourceDataKey,
    name: component.label,
    isAnimationActive: false,
  }

  if (component.type === ChartComponentType.bar) {
    return (
      <Bar
        {...commonProps}
        fill={component.fill}
        radius={component.shouldRenderBorderRadius ? [6, 6, 0, 0] : undefined}
        barSize={25}
        stackId={component.stackId?.toString()}
        stroke={component.color}
        color={component.color}
      />
    )
  } else if (component.type === ChartComponentType.line) {
    return (
      <Line
        {...commonProps}
        stroke={component.color}
        strokeWidth={3}
        strokeDasharray={
          component.renderIndex === 0
            ? undefined // First line is solid
            : PREDEFINED_LINE_DASH_PATTERNS[component.renderIndex - 1] // The rest gets a pattern
        }
      />
    )
  } else if (component.type === ChartComponentType.area) {
    return <Area {...commonProps} fill={component.fill} fillOpacity={1} />
  }

  return null
}

type CustomLabelProps = {
  cx: number
  cy: number
  midAngle: number
  outerRadius: number
  innerRadius: number
  percent: number
  payload?: {
    name?: string
    value?: string | number
  }
  activeLocale: Locale
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  innerRadius,
  payload,
  percent,
  activeLocale,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.8
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  const value = payload?.value

  return (
    <g>
      <text x={x} y={y} fill="#00003C" textAnchor="middle" fontSize="14px">
        <tspan x={x} dy="0" fontWeight={500}>{`${
          percent
            ? formatPercentageForPresentation(percent)
            : value
            ? formatValueForPresentation(activeLocale, value)
            : ''
        }`}</tspan>
        <tspan x={x} dy="1.2em">
          {payload?.name?.toLowerCase()}
        </tspan>
      </text>
    </g>
  )
}

export const renderPieChartComponents = (
  components: ChartComponentWithRenderProps[],
  data: ChartData,
  activeLocale: Locale,
) => {
  const pieData = data?.[0]?.statisticsForDate ?? []
  const total = pieData.reduce(
    (total, { value }) => total + (value ? value : 0),
    0,
  )

  return (
    <Pie
      data={pieData}
      dataKey="value"
      isAnimationActive={false}
      cx="50%"
      cy="50%"
      innerRadius="30%"
      outerRadius="60%"
      label={(props) =>
        renderCustomizedLabel({
          ...props,
          activeLocale,
          total,
        })
      }
      startAngle={90}
      endAngle={360 + 90}
    >
      <Label fontSize={24} fontWeight="bold" value={total} position="center" />
      {components.map((c, i) => (
        <Cell
          key={i}
          fill={c.fill}
          name={c.label}
          stroke="white"
          strokeWidth={3}
        />
      ))}
    </Pie>
  )
}

interface ChartComponentsRendererProps {
  componentsWithAddedProps: ChartComponentWithRenderProps[]
  chartType: ChartType
  data: ChartData
  activeLocale: Locale
}

export const renderChartComponents = ({
  componentsWithAddedProps,
  chartType,
  data,
  activeLocale,
}: ChartComponentsRendererProps) => {
  if (chartType === ChartType.pie) {
    return renderPieChartComponents(
      componentsWithAddedProps,
      data,
      activeLocale,
    )
  }

  return componentsWithAddedProps.map((component) =>
    renderChartComponent({
      component,
    }),
  )
}
