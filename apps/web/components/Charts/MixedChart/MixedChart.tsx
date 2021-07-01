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

const data = [
  {
    fund_year: 2010,
    sott: 109,
    veitt: 23.0,
    amount: 127632000,
  },
  {
    fund_year: 2012,
    sott: 188,
    veitt: 53.0,
    amount: 163385000,
  },
  {
    fund_year: 2011,
    sott: 223,
    veitt: 46.0,
    amount: 157583000,
  },
  {
    fund_year: 2014,
    sott: 234,
    veitt: 56.0,
    amount: 1057143000,
  },
  {
    fund_year: 2015,
    sott: 268,
    veitt: 87.0,
    amount: 2114543000,
  },
  {
    fund_year: 2013,
    sott: 326,
    veitt: 61.0,
    amount: 606991000,
  },
  {
    fund_year: 2016,
    sott: 492,
    veitt: 106.0,
    amount: 2461778000,
  },
  {
    fund_year: 2017,
    sott: 508,
    veitt: 101.0,
    amount: 2406155000,
  },
  {
    fund_year: 2018,
    sott: 600,
    veitt: 84.0,
    amount: 1833837000,
  },
  {
    fund_year: 2019,
    sott: 630,
    veitt: 76.0,
    amount: 1594440000,
  },
  {
    fund_year: 2020,
    sott: 882,
    veitt: 89.0,
    amount: 1152500000,
  },
]

const dataKeysName = {
  sott: 'Umsóknir',
  veitt: 'Veittir styrkir',
  amount: 'Heildarupphæð styrkja',
}

const CustomizedAxisTick = (props) => {
  const { x, y, className, payload } = props
  const xAxis = className.includes("xAxis")
  return (
      <g transform={`translate(${x},${y})`}>
        <text x={xAxis ? 16 : -17} y={xAxis ? 20 : -10} dy={16} textAnchor="end" fill="#00003C">
          {payload.value} {xAxis}
        </text>
      </g>
  )
}

const renderLegend = (props) => {
  const { payload } = props

  return (
    <ul style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '37px' }}>
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
          {dataKeysName[entry.value]}
        </li>
      ))}
    </ul>
  )
}

const renderLabel = (value: string) => {
  return <p style={{ color: '#00003C' }}>{value}</p>
}

export const MixedChart = () => {
  const sorted_data = data.sort((a, b) => {
    return a.fund_year - b.fund_year
  })
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        width={250}
        height={150}
        data={sorted_data}
        margin={{
          top: 30,
          right: 0,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="1" vertical={false} color="#CCDFFF" />
        <XAxis
          dataKey="fund_year"
          stroke="#CCDFFF"
          tick={<CustomizedAxisTick />}
          padding={{ left: 30 }}
          tickLine={false}
        />
        <YAxis yAxisId="left" stroke="#CCDFFF" tick={<CustomizedAxisTick />}/>
        <YAxis yAxisId="right" hide />
        <Tooltip />
        <Legend iconType="circle" align="right" content={renderLegend} />
        <Bar
          dataKey="sott"
          fill="#99C0FF"
          stackId="a"
          barSize={16}
          yAxisId="left"
        />
        <Bar
          dataKey="veitt"
          fill="#0061FF"
          radius={[20, 20, 0, 0]}
          stackId="a"
          barSize={16}
          yAxisId="left"
        />
        <Line
          dataKey="amount"
          stroke="#99F4EA"
          yAxisId="right"
          strokeWidth={3}
          dot={{ r: 6, strokeWidth: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default MixedChart
