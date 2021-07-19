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
import { CustomizedAxisTick, RenderLegend } from '../utils'

const dataKeysName = {
  sott: 'Umsóknir',
  veitt: 'Veittir styrkir',
  amount: 'Heildarupphæð styrkja',
}

interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
}
interface GraphProps {
  graphData: GraphDataProps
}
export const SimpleBarChart = ({ graphData }: GraphProps) => {
  const { title, data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={250}
        height={150}
        data={parsedData}
        margin={{
          top: 30,
          right: 0,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="1" vertical={false} color="#CCDFFF" />
        <XAxis
          dataKey={parsedDatakeys.xAxis}
          stroke="#CCDFFF"
          tick={<CustomizedAxisTick />}
          padding={{ left: 30 }}
          tickLine={false}
        />
        <YAxis stroke="#CCDFFF" tick={<CustomizedAxisTick />} />
        <Tooltip />
        <Legend iconType="circle" align="right" content={RenderLegend} />
        {parsedDatakeys.bars.map((item, index) => (
          <Bar
            key={index}
            dataKey={item.datakey}
            fill={item.color}
            stackId={item.stackId}
            barSize={16}
            radius={
              index + 1 === parsedDatakeys.bars.length ? [20, 20, 0, 0] : 0
            }
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SimpleBarChart
