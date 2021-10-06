import React from 'react'
import * as styles from './charts.treat'
import cn from 'classnames'
import { LegendProps, TooltipProps } from 'recharts'
import { Box, Text } from '@island.is/island-ui/core'

export const CustomTooltip = ({
  payload,
  active,
  label,
}: TooltipProps<string, number>) => {
  if (active && payload && payload.length) {
    return (
      <div className={cn(styles.tooltip)}>
        <p>{label}</p>
        {payload.map((item, index) => (
          <li className={cn(styles.list)} key={`item-${index}`}>
            <div
              className={cn(styles.dot)}
              style={{
                border: '3px solid ' + item.color,
              }}
            />
            {item.name} : {item.value}
          </li>
        ))}
      </div>
    )
  }

  return null
}

export const CustomizedAxisTick = (props) => {
  const { x, y, className, payload } = props
  const xAxis = className.includes('xAxis')
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={xAxis ? 16 : -17}
        y={xAxis ? 20 : -10}
        dy={16}
        textAnchor="end"
        fill="#00003C"
      >
        {payload.value} {xAxis}
      </text>
    </g>
  )
}

export const CustomizedRightAxisTick = (props) => {
  const { x, y, payload } = props
  return (
    <g transform={`translate(${x + 10},${y - 10})`}>
      <text dy={16} textAnchor="start" fill="#00003C">
        {payload.value}
      </text>
    </g>
  )
}
interface CustomLegendProps extends LegendProps {
  title?: string
}
export const RenderLegend = (props: CustomLegendProps) => {
  const { payload, title } = props

  return (
    <div className={cn(styles.wrapper)}>
      <p className={cn(styles.title)}>{title}</p>
      <ul className={cn(styles.listWrapper)}>
        {payload.map((entry, index) => (
          <li className={cn(styles.list)} key={`item-${index}`}>
            <div
              className={cn(styles.dot)}
              style={{
                border: '3px solid ' + entry.color,
              }}
            />
            {entry.value}
          </li>
        ))}
      </ul>
    </div>
  )
}

const RADIAN = Math.PI / 180
export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  innerRadius,
  percent,
}) => {
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
