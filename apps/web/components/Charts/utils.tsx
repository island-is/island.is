import React from 'react'
import * as styles from './charts.treat'
import cn from 'classnames'

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

export const renderLegend = (props) => {
  const { payload } = props

  return (
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
  )
}

export default renderLegend
