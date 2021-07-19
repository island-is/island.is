import React from 'react'
import {
  LineChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Label,
} from 'recharts'
import * as styles from './SimpleLineChart.treat'
import cn from 'classnames'
import { Box, Text } from '@island.is/island-ui/core'

let graphTitle = null

const CustomizedAxisTick = (props) => {
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

const renderLegend = (props) => {
  const { payload } = props

  return (
    <div className={cn(styles.wrapper)}>
      <p className={cn(styles.title)}>{graphTitle}</p> 
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
interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
}
interface SimpleLineChartGraphProps {
  graphData: GraphDataProps
}

export const SimpleLineChart = ({ graphData }: SimpleLineChartGraphProps) => {
  const { title, data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)
  graphTitle = title

  return (
    <Box width="full" height="full">
      {parsedDatakeys.yAxis?.label && <Text variant='eyebrow'>{parsedDatakeys.yAxis.label}</Text>}
        <Box style={{ width: '100%', height: '90%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={parsedData}
              margin={{
                top: 40,
                right: 16,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="1"
                vertical={false}
                stroke="#CCDFFF"
              />
              <XAxis
                dataKey={parsedDatakeys.xAxis}
                stroke="#CCDFFF"
                tick={<CustomizedAxisTick />}
                padding={{ left: 30 }}
                tickLine={false}
              />
              <YAxis stroke="#CCDFFF" tick={<CustomizedAxisTick />} />
              <Tooltip />
              <Legend iconType="circle" content={renderLegend} />
              {parsedDatakeys.lines.map((item, index) => (
                <Line
                  key={index}
                  dataKey={item.line}
                  stroke={item.color}
                  strokeWidth={3}
                  dot={{ r: 6, strokeWidth: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
  )
}

export default SimpleLineChart
