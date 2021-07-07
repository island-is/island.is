import React from 'react'
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts'

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
    <ul
      style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '37px' }}
    >
      {payload.map((entry, index) => (
        <li
          style={{
            color: '#00003C',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          key={`item-${index}`}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              border: '3px solid ' + entry.color,
              borderRadius: '12px',
              marginRight: '8px',
              marginLeft: '32px',
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  )
}

interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
}
interface GraphProps {
  graphData: GraphDataProps
}

export const MixedChart = ({ graphData }: GraphProps) => {
  const { title, data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)[0]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
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
        <YAxis yAxisId="left" stroke="#CCDFFF" tick={<CustomizedAxisTick />} />
        <YAxis yAxisId="right" hide />
        <Tooltip />
        <Legend iconType="circle" align="right" content={renderLegend} />
        {parsedDatakeys.bars.map((item, index) => (
          <Bar
            key={item.bar}
            dataKey={item.bar}
            fill={item.color}
            stackId="a"
            barSize={16}
            yAxisId="left"
            radius={
              index + 1 === parsedDatakeys.bars.length ? [20, 20, 0, 0] : 0
            }
          />
        ))}
        {parsedDatakeys.yAxis?.left && (
          <Line
            dataKey={parsedDatakeys.yAxis.left}
            stroke="#99F4EA"
            yAxisId="right"
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 3 }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default MixedChart
