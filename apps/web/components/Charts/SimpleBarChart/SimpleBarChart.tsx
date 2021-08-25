import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  CustomizedAxisTick,
  RenderLegend,
  COLORS,
  CustomTooltip,
} from '../utils'
import { Box, Text } from '@island.is/island-ui/core'

interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
}
interface GraphProps {
  graphData: GraphDataProps
}
export const SimpleBarChart = ({ graphData }: GraphProps) => {
  const { data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)
  return (
    <Box width="full" height="full">
      {parsedDatakeys.yAxis?.label && (
        <Text variant="eyebrow">{parsedDatakeys.yAxis.label}</Text>
      )}
      <Box style={{ width: '100%', height: '90%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={20}
            height={150}
            data={parsedData}
            margin={{
              top: 30,
              right: 0,
              left: 20,
              bottom: 5,
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
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" align="right" content={RenderLegend} />
            {parsedDatakeys.bars.map((item, index) => (
              <Bar
                key={index}
                dataKey={item.datakey}
                fill={item.color ? item.color : COLORS[index % COLORS.length]}
                stackId={item.stackId}
                barSize={16}
                radius={
                  index + 1 === parsedDatakeys.bars.length ? [20, 20, 0, 0] : 0
                }
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  )
}

export default SimpleBarChart
