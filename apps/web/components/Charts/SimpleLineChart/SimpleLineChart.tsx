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
      style={{
        justifyContent: 'space-between',
        display: 'flex',
        paddingTop: '37px',
      }}
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
              marginRight: '2px',
              marginLeft: '8px',
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
interface SimpleLineChartGraphProps {
  graphData: GraphDataProps
}

export const SimpleLineChart = ({ graphData }: SimpleLineChartGraphProps) => {
  const { title, data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const parsedDatakeys = JSON.parse(datakeys)

  const COLORS = [
    '#00B39E',
    '#FFF066',
    '#9A0074',
    '#6A2EA0',
    '#99C0FF',
    '#D799C7',
    '#99F4EA',
    '#FF99B9',
    '#C3ABD9',
    '#E6CF00',
    '#B5B6EC',
    '#FF0050',
  ]
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={parsedData}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="1" vertical={false} stroke="#CCDFFF" />
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
        {parsedDatakeys[0].lines.map((item, index) => (
          <Line
            key={index}
            dataKey={item.line}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 3 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

export default SimpleLineChart
