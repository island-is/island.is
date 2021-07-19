import React from 'react'
import * as styles from './charts.treat'
import cn from 'classnames'
import { LegendProps } from 'recharts'

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
interface CustomLegendProps extends LegendProps {
  title?: string
}
export const RenderLegend = (props: CustomLegendProps) => {
  const { payload, title } = props
  console.log(title)

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

export const COLORS = [
  "#FFF066",
  "#FF99B9",
  "#C3ABD9",
  "#D799C7",
  "#99F4EA",
  "#B5B6EC",
  "#FF0050",
  "#00B39E",
  "#0061FF",
  "#E6CF00",
  "#6A2EA0",
  "#00E4CA",
  "#FFFCE0",
  "#9A0074",
  "#99C0FF",
]

export default RenderLegend
