import React from 'react'
import * as styles from './charts.css'
import cn from 'classnames'
import { LegendProps, TooltipProps } from 'recharts'
import { Box, Text } from '@island.is/island-ui/core'
import { isDefined } from '@island.is/shared/utils'

interface AxisTickProps {
  x?: number
  y?: number
  className?: string
  payload?: { value: string }
  valueFormat?: (arg: number) => string
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  valueLabels?: Record<string, string>
  valueFormat?: (arg: number) => string
}

export const CustomTooltip = ({
  payload,
  active,
  label,
  valueLabels,
  valueFormat,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Box className={cn(styles.tooltip)}>
        <Text variant="small">{label}</Text>
        {payload
          .map((item, index) => {
            if (!item.value) return null

            return (
              <Box as="li" className={cn(styles.list)} key={`item-${index}`}>
                <div
                  className={cn(styles.dot)}
                  style={{
                    border: '3px solid ' + item.color,
                  }}
                />
                <Text variant="small">
                  {valueLabels && item.dataKey
                    ? valueLabels[item.dataKey]
                    : item.name}
                  : {valueFormat ? valueFormat(item.value) : item.value}
                </Text>
              </Box>
            )
          })
          .filter(isDefined)}
      </Box>
    )
  }

  return null
}

export const CustomizedAxisTick = ({
  x,
  y,
  className,
  payload,
}: AxisTickProps) => {
  const xAxis = className?.includes('xAxis')
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={xAxis ? 16 : -17}
        y={xAxis ? 20 : -10}
        dy={16}
        textAnchor="end"
        fill="#00003C"
        fontSize={'14px'}
      >
        {payload?.value} {xAxis}
      </text>
    </g>
  )
}

export const CustomizedRightAxisTick = ({ x, y, payload }: AxisTickProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    <g transform={`translate(${x + 10},${y - 10})`}>
      <text dy={16} textAnchor="start" fill="#00003C">
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          payload.value
        }
      </text>
    </g>
  )
}
interface CustomLegendProps extends LegendProps {
  title?: string
  labels?: Record<string, string>
}
export const RenderLegend = ({ payload, title, labels }: CustomLegendProps) => {
  if (!payload || !payload.values) {
    return null
  }

  return (
    <Box
      as="ul"
      marginTop={3}
      display="flex"
      width="full"
      justifyContent={'flexEnd'}
    >
      {[...payload.values()].map((item) => (
        <Box display="flex" as="li" key={item.value}>
          <Box
            alignSelf={'center'}
            className={styles.dot}
            style={{
              backgroundColor: item.color,
              borderColor: item.color,
            }}
          />
          <Text variant="small">{labels?.[item.value] ?? item.value}</Text>
        </Box>
      ))}
    </Box>
  )
}

// Define the type for the destructured props
type CustomLabelProps = {
  cx: number
  cy: number
  midAngle: number
  outerRadius: number
  innerRadius: number
  percent: number
}

const RADIAN = Math.PI / 180
export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  innerRadius,
  percent,
}: CustomLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#00003C"
      textAnchor={x > outerRadius ? 'middle' : 'end'}
      dominantBaseline="central"
      fontSize="12px"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

interface yAxisLabelProps {
  label?: string
  labelRight?: string
  rightPadding?: number
}
export const YAxisLabel = ({
  label,
  labelRight,
  rightPadding = 0,
}: yAxisLabelProps) => {
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="spaceBetween"
      style={{ paddingRight: rightPadding }}
    >
      {label && <Text variant="eyebrow">{label}</Text>}
      {labelRight && <Text variant="eyebrow">{labelRight}</Text>}
    </Box>
  )
}

export const COLORS = [
  '#FFF066',
  '#FF99B9',
  '#C3ABD9',
  '#D799C7',
  '#99F4EA',
  '#B5B6EC',
  '#FF0050',
  '#00B39E',
  '#0061FF',
  '#E6CF00',
  '#6A2EA0',
  '#00E4CA',
  '#FFFCE0',
  '#9A0074',
  '#99C0FF',
]

export default RenderLegend
