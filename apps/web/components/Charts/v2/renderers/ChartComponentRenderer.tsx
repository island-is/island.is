import { useMemo } from 'react'
import { Area, Bar, Cell, Label, Line, Pie, useChartWidth } from 'recharts'

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
import { AVG_CHAR_WIDTH_EM, wrapAxisLabel } from '../utils/wrapAxisLabel'

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
  cx?: number
  cy?: number
  midAngle?: number
  outerRadius?: number
  percent?: number
  payload?: {
    name?: string
    value?: string | number
  }
  activeLocale: Locale
  customStyleConfig: CustomStyleConfig
}

const RADIAN = Math.PI / 180
// Recharts draws the label line from the pie's edge out this far
const LABEL_LINE_LENGTH = 20
const LABEL_GAP = 4
const LABEL_EDGE_MARGIN = 4
const LABEL_LINE_HEIGHT_EM = 1.2
const LABEL_MAX_LINES = 3
const LABEL_MIN_CHARS_PER_LINE = 6

// Anchored away from the pie at the end of its label line and wrapped to the
// space left before the chart edge, so long names aren't clipped
const PieLabel = ({
  cx = 0,
  cy = 0,
  midAngle = 0,
  outerRadius = 0,
  payload,
  percent = 0,
  activeLocale,
  customStyleConfig,
}: CustomLabelProps) => {
  const chartWidth = useChartWidth() ?? 0
  const fontSize =
    customStyleConfig?.pie?.fontSize ?? DEFAULT_PIE_LABEL_FONT_SIZE

  const cos = Math.cos(-midAngle * RADIAN)
  const sin = Math.sin(-midAngle * RADIAN)
  const radius = outerRadius + LABEL_LINE_LENGTH + LABEL_GAP
  const x = cx + radius * cos
  const y = cy + radius * sin
  const isRightSide = cos >= 0

  const availableWidth = (isRightSide ? chartWidth - x : x) - LABEL_EDGE_MARGIN
  const maxCharsPerLine = Math.max(
    LABEL_MIN_CHARS_PER_LINE,
    Math.floor(availableWidth / (fontSize * AVG_CHAR_WIDTH_EM)),
  )
  const name = payload?.name ?? ''
  // hyphenateText builds a new pattern table per call, so skip it on re-renders
  const lines = useMemo(
    () => wrapAxisLabel(name, maxCharsPerLine, LABEL_MAX_LINES, activeLocale),
    [name, maxCharsPerLine, activeLocale],
  )
  const isTruncated = lines[lines.length - 1]?.endsWith('…') ?? false

  // Centre the value on the line's end; labels above the pie stack upwards
  // so their wrapped lines don't run into it
  const firstLineOffset =
    0.35 - (sin < 0 ? lines.length * LABEL_LINE_HEIGHT_EM : 0)

  const value = payload?.value

  return (
    <g>
      <text
        x={x}
        y={y}
        fill="#00003C"
        textAnchor={isRightSide ? 'start' : 'end'}
        fontSize={`${fontSize}px`}
      >
        {isTruncated && <title>{name}</title>}
        <tspan x={x} dy={`${firstLineOffset}em`} fontWeight={500}>{`${
          percent
            ? formatPercentageForPresentation(percent)
            : value
            ? formatValueForPresentation(activeLocale, value)
            : ''
        }`}</tspan>
        {lines.map((line, i) => (
          <tspan key={line + i} x={x} dy={`${LABEL_LINE_HEIGHT_EM}em`}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  )
}

// Tooltips resolve the segment name from the data entries (nameKey),
// not from Cell props — without this they fall back to the entry index.
export const getPieData = (
  components: ChartComponentWithRenderProps[],
  data: ChartData,
) =>
  (data?.[0]?.statisticsForHeader ?? []).map((entry) => ({
    ...entry,
    name:
      components.find((c) => c.sourceDataKey === entry.key)?.label ?? entry.key,
  }))

export const getPieTotal = (pieData: ReturnType<typeof getPieData>) =>
  pieData.reduce((total, { value }) => total + (value ? value : 0), 0)

export const renderPieChartComponents = (
  components: ChartComponentWithRenderProps[],
  data: ChartData,
  activeLocale: Locale,
  customStyleConfig: CustomStyleConfig,
  isMobile: boolean,
) => {
  const pieData = getPieData(components, data)
  const total = getPieTotal(pieData)
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
  // Mobile lists the segments in the legend instead, so the pie can use the
  // space the outside labels need on wider screens
  const outerRadius =
    userDefinedOuterRadius ??
    (isMobile ? PIE_CHART_MAX_RADIUS : PIE_CHART_MAX_RADIUS - innerRadius)

  return (
    <Pie
      data={pieData}
      dataKey="value"
      isAnimationActive={false}
      cx="50%"
      cy="50%"
      innerRadius={`${innerRadius}%`}
      outerRadius={`${outerRadius}%`}
      label={
        isMobile
          ? false
          : (props) => (
              <PieLabel
                {...props}
                activeLocale={activeLocale}
                customStyleConfig={customStyleConfig}
              />
            )
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
  isMobile: boolean
}

export const renderChartComponents = ({
  componentsWithAddedProps,
  chartType,
  data,
  activeLocale,
  customStyleConfig,
  isMobile,
}: ChartComponentsRendererProps) => {
  if (chartType === ChartType.pie) {
    return renderPieChartComponents(
      componentsWithAddedProps,
      data,
      activeLocale,
      customStyleConfig,
      isMobile,
    )
  }

  return componentsWithAddedProps.map((component) =>
    renderChartComponent({
      component,
    }),
  )
}
