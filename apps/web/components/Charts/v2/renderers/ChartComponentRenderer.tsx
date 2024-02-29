import { Area, Bar, Cell, Label, Line, Pie } from 'recharts'

import type { Locale } from '@island.is/shared/types'

import {
  DEFAULT_PIE_INNER_RADIUS,
  DEFAULT_PIE_LABEL_FONT_SIZE,
  PIE_CHART_MAX_RADIUS,
} from '../constants'
import {
  ChartComponentType,
  ChartComponentWithRenderProps,
  ChartData,
  ChartType,
  CustomStyleConfig,
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
        fill={component.patternId ?? component.color}
        radius={component.shouldRenderBorderRadius ? [6, 6, 0, 0] : undefined}
        barSize={25}
        stackId={component.stackId?.toString()}
        color={component.color}
      />
    )
  } else if (component.type === ChartComponentType.line) {
    return (
      <Line
        {...commonProps}
        stroke={component.color}
        strokeWidth={3}
        strokeDasharray={component.pattern}
      />
    )
  } else if (component.type === ChartComponentType.area) {
    return (
      <Area
        {...commonProps}
        fill={component.patternId ?? component.color}
        fillOpacity={1}
        stroke="rgba(0,0,0,0)"
        color={component.color}
      />
    )
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
  customStyleConfig: CustomStyleConfig
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
  customStyleConfig,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.8
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  const value = payload?.value

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="#00003C"
        textAnchor="middle"
        fontSize={`${
          customStyleConfig?.pie?.fontSize ?? DEFAULT_PIE_LABEL_FONT_SIZE
        }px`}
      >
        <tspan x={x} dy="0" fontWeight={500}>{`${
          percent
            ? formatPercentageForPresentation(percent)
            : value
            ? formatValueForPresentation(activeLocale, value)
            : ''
        }`}</tspan>
        <tspan x={x} dy="1.2em">
          {payload?.name}
        </tspan>
      </text>
    </g>
  )
}

export const renderPieChartComponents = (
  components: ChartComponentWithRenderProps[],
  data: ChartData,
  activeLocale: Locale,
  customStyleConfig: CustomStyleConfig,
) => {
  const pieData = data?.[0]?.statisticsForHeader ?? []
  const total = pieData.reduce(
    (total, { value }) => total + (value ? value : 0),
    0,
  )
  const formattedTotal = formatValueForPresentation(activeLocale, total)

  const userDefinedInnerRadius = customStyleConfig?.pie?.innerRadius
  const userDefinedOuterRadius = customStyleConfig?.pie?.outerRadius

  if (
    typeof userDefinedOuterRadius === 'number' &&
    typeof userDefinedInnerRadius === 'number' &&
    userDefinedOuterRadius < userDefinedInnerRadius
  ) {
    console.log(
      'Outer radius is larger than inner radius, this will result in a pie chart with no visible segments',
    )
  }

  const innerRadius = userDefinedInnerRadius ?? DEFAULT_PIE_INNER_RADIUS
  const outerRadius =
    userDefinedOuterRadius ?? PIE_CHART_MAX_RADIUS - innerRadius

  return (
    <Pie
      data={pieData}
      dataKey="value"
      isAnimationActive={false}
      cx="50%"
      cy="50%"
      innerRadius={`${innerRadius}%`}
      outerRadius={`${outerRadius}%`}
      label={(props) =>
        renderCustomizedLabel({
          ...props,
          activeLocale,
          total,
          customStyleConfig,
        })
      }
      startAngle={90}
      endAngle={360 + 90}
    >
      <Label
        fontSize={24}
        fontWeight="bold"
        value={formattedTotal}
        position="center"
      />
      {components.map((c, i) => (
        <Cell
          key={i}
          fill={c.patternId ?? c.color}
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
  customStyleConfig: CustomStyleConfig
}

export const renderChartComponents = ({
  componentsWithAddedProps,
  chartType,
  data,
  activeLocale,
  customStyleConfig,
}: ChartComponentsRendererProps) => {
  if (chartType === ChartType.pie) {
    return renderPieChartComponents(
      componentsWithAddedProps,
      data,
      activeLocale,
      customStyleConfig,
    )
  }

  return componentsWithAddedProps.map((component) =>
    renderChartComponent({
      component,
    }),
  )
}
