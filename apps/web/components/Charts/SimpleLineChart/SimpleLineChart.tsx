import React from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { Box } from '@island.is/island-ui/core'

import {
  COLORS,
  CustomizedAxisTick,
  RenderLegend,
  YAxisLabel,
} from '../sharedChartComponents'

interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
  graphTitle?: string
}
interface SimpleLineChartGraphProps {
  graphData: GraphDataProps
}

export const SimpleLineChart = ({ graphData }: SimpleLineChartGraphProps) => {
  const { title, data, datakeys, graphTitle } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)

  return (
    <Box width="full" height="full">
      <YAxisLabel label={parsedDatakeys.yAxis.label} />
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
            strokeDasharray="0"
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
          <Legend
            iconType="circle"
            content={<RenderLegend title={title ?? graphTitle} />}
          />
          {parsedDatakeys.lines.map(
            (item: { line: string; color: string }, index: number) => (
              <Line
                key={index}
                dataKey={item.line}
                stroke={item.color ? item.color : COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={{ r: 6, strokeWidth: 3 }}
              />
            ),
          )}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}

export default SimpleLineChart
