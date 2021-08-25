import React from 'react'
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts'
import { Box, Text } from '@island.is/island-ui/core'
import { CustomizedAxisTick, RenderLegend, COLORS } from '../utils'

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
      {parsedDatakeys.yAxis?.label && (
        <Text variant="eyebrow">{parsedDatakeys.yAxis.label}</Text>
      )}
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
            {parsedDatakeys.lines.map((item, index) => (
              <Line
                key={index}
                dataKey={item.line}
                stroke={item.color ? item.color : COLORS[index % COLORS.length]}
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
