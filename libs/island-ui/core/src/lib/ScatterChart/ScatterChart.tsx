import React from 'react'
import type { TooltipContentProps } from 'recharts'
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart as RechartsScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Colors, theme } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { Text } from '../Text/Text'
import * as styles from './ScatterChart.css'

export type ScatterChartTooltip = {
  title: string
  rows: Array<{ label: string; value: string }>
  note?: { text: string; color?: Colors }
}

export type ScatterChartPoint = {
  x: number
  y: number
  marked?: boolean
  tooltip?: ScatterChartTooltip
}

export type ScatterChartSeries = {
  name: string
  color: Colors
  shape?: 'circle' | 'diamond'
  points: ScatterChartPoint[]
}

export type ScatterChartAxis = {
  label: string
  domain: [number, number]
  ticks: number[]
  tickFormatter?: (value: number) => string
  width?: number
}

export interface ScatterChartProps {
  series: ScatterChartSeries[]
  line?: {
    name: string
    color: Colors
    points: Array<{ x: number; y: number }>
  }
  markedLegendLabel?: string
  xAxis: ScatterChartAxis
  yAxis: ScatterChartAxis
  height?: number
  title?: string
  description?: string
}

const NoSymbol = () => <g />

const PointDot = ({
  cx,
  cy,
  fill,
  payload,
  variant,
}: {
  cx?: number
  cy?: number
  fill?: string
  payload?: ScatterChartPoint
  variant?: 'circle' | 'diamond'
}) => {
  if (cx == null || cy == null) return null
  const marked = payload?.marked === true
  const r = marked ? 7 : 5

  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill="transparent" />
      {variant === 'diamond' ? (
        <path
          d={`M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${
            cx - r
          } ${cy} Z`}
          fill={fill}
          fillOpacity={marked ? 1 : 0.8}
          stroke={marked ? theme.color.dark400 : 'none'}
          strokeWidth={marked ? 2 : 0}
          pointerEvents="none"
        />
      ) : (
        <circle
          cx={cx}
          cy={cy}
          r={marked ? 6 : 4}
          fill={fill}
          fillOpacity={marked ? 1 : 0.8}
          stroke={marked ? theme.color.dark400 : 'none'}
          strokeWidth={marked ? 2 : 0}
          pointerEvents="none"
        />
      )}
    </g>
  )
}

const hasTooltip = (
  datum: unknown,
): datum is ScatterChartPoint & { tooltip: ScatterChartTooltip } =>
  typeof datum === 'object' &&
  datum !== null &&
  'tooltip' in datum &&
  Boolean((datum as ScatterChartPoint).tooltip)

const ChartTooltip = ({
  active,
  payload,
}: Partial<TooltipContentProps<number, string>>) => {
  const datum = active ? payload?.[0]?.payload : undefined
  if (!hasTooltip(datum)) return null
  const { title, rows, note } = datum.tooltip

  return (
    <Box
      background="white"
      borderRadius="standard"
      padding={2}
      style={{
        border: `1px solid ${theme.color.blue200}`,
        boxShadow: '0 2px 8px rgba(0, 0, 60, 0.12)',
      }}
    >
      <Text variant="small" fontWeight="semiBold">
        {title}
      </Text>
      {rows.map(({ label, value }, index) => (
        <Box key={index} display="flex" columnGap={1}>
          <Text variant="small" color="dark350">
            {label}:
          </Text>
          <Text variant="small">{value}</Text>
        </Box>
      ))}
      {note && (
        <Box marginTop={1}>
          <Text variant="small" fontWeight="semiBold" color={note.color}>
            {note.text}
          </Text>
        </Box>
      )}
    </Box>
  )
}

const ChartLegend = ({
  series,
  line,
  markedLegendLabel,
}: Pick<ScatterChartProps, 'series' | 'line' | 'markedLegendLabel'>) => {
  const items: { label: string; swatch: React.ReactNode }[] = series.map(
    (item) => ({
      label: item.name,
      swatch: (
        <svg width={12} height={12} aria-hidden>
          {item.shape === 'diamond' ? (
            <path
              d="M 6 1 L 11 6 L 6 11 L 1 6 Z"
              fill={theme.color[item.color]}
              fillOpacity={0.8}
            />
          ) : (
            <circle
              cx={6}
              cy={6}
              r={5}
              fill={theme.color[item.color]}
              fillOpacity={0.8}
            />
          )}
        </svg>
      ),
    }),
  )

  if (line) {
    items.push({
      label: line.name,
      swatch: (
        <svg width={16} height={12} aria-hidden>
          <line
            x1={0}
            y1={6}
            x2={16}
            y2={6}
            stroke={theme.color[line.color]}
            strokeWidth={2.5}
          />
        </svg>
      ),
    })
  }

  if (markedLegendLabel) {
    items.push({
      label: markedLegendLabel,
      swatch: (
        <svg width={14} height={14} aria-hidden>
          <circle
            cx={7}
            cy={7}
            r={5}
            fill="none"
            stroke={theme.color.dark400}
            strokeWidth={2}
          />
        </svg>
      ),
    })
  }

  return (
    <Box display="flex" justifyContent="center" columnGap={3} flexWrap="wrap">
      {items.map((item, index) => (
        <Box key={index} display="flex" alignItems="center" columnGap={1}>
          {item.swatch}
          <Text variant="small">{item.label}</Text>
        </Box>
      ))}
    </Box>
  )
}

export const ScatterChart = ({
  series,
  line,
  markedLegendLabel,
  xAxis,
  yAxis,
  height = 420,
  title,
  description,
}: ScatterChartProps) => {
  const visibleSeries = series.filter((item) => item.points.length > 0)
  const visibleLine = line && line.points.length > 0 ? line : undefined
  const axisTick = { fill: theme.color.black, fontSize: 14 }

  return (
    <ResponsiveContainer
      width="100%"
      height={height}
      className={styles.chartFocus}
    >
      <RechartsScatterChart
        title={title}
        desc={description}
        margin={{ top: 24, right: 0, left: 0, bottom: 24 }}
      >
        <CartesianGrid vertical={false} stroke={theme.color.blue200} />
        <XAxis
          type="number"
          dataKey="x"
          domain={xAxis.domain}
          ticks={xAxis.ticks}
          tickFormatter={xAxis.tickFormatter}
          stroke={theme.color.blue200}
          tickLine={false}
          tick={axisTick}
          label={{
            value: xAxis.label,
            position: 'insideBottomRight',
            dx: 5,
            dy: 10,
            fontWeight: 'bold',
            fill: theme.color.black,
            fontSize: 14,
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          domain={yAxis.domain}
          ticks={yAxis.ticks}
          tickFormatter={yAxis.tickFormatter}
          stroke={theme.color.blue200}
          tickLine={false}
          tick={axisTick}
          width={yAxis.width}
          label={{
            value: yAxis.label,
            position: 'insideTop',
            offset: -22,
            fontWeight: 'bold',
            fill: theme.color.black,
            fontSize: 14,
            dx: 32,
          }}
        />
        <Tooltip
          cursor={false}
          isAnimationActive={false}
          shared={false}
          content={<ChartTooltip />}
        />
        <Legend
          wrapperStyle={{ paddingTop: 16 }}
          content={
            <ChartLegend
              series={visibleSeries}
              line={visibleLine}
              markedLegendLabel={markedLegendLabel}
            />
          }
        />
        {visibleSeries.map((item, index) => (
          <Scatter
            key={index}
            name={item.name}
            data={item.points}
            fill={theme.color[item.color]}
            legendType="none"
            shape={<PointDot variant={item.shape} />}
          />
        ))}
        {visibleLine && (
          <Scatter
            data={visibleLine.points}
            name={visibleLine.name}
            line={{ stroke: theme.color[visibleLine.color], strokeWidth: 2.5 }}
            lineType="joint"
            shape={<NoSymbol />}
            legendType="none"
            isAnimationActive={false}
          />
        )}
      </RechartsScatterChart>
    </ResponsiveContainer>
  )
}
