import { forEach } from 'lodash'
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
  Line,
} from 'recharts'

const data = [
  {
    fund_year: 2010,
    'Karlmaður veittir styrkir': 16,
    'Kona veittir styrkir': 6,
    'Óskilgreint veittir styrkir': 1,
    'Karlmaður umsóknir': 88,
    'Kona umsóknir': 16,
    'Óskilgreint umsóknir': 5,
  },
  {
    fund_year: 2011,
    'Karlmaður veittir styrkir': 30,
    'Kona veittir styrkir': 15,
    'Óskilgreint veittir styrkir': 1,
    'Karlmaður umsóknir': 169,
    'Kona umsóknir': 48,
    'Óskilgreint umsóknir': 6,
  },
  {
    fund_year: 2012,
    'Karlmaður veittir styrkir': 38,
    'Kona veittir styrkir': 14,
    'Óskilgreint veittir styrkir': 1,
    'Karlmaður umsóknir': 144,
    'Kona umsóknir': 41,
    'Óskilgreint umsóknir': 3,
  },
  {
    fund_year: 2013,
    'Karlmaður veittir styrkir': 41,
    'Kona veittir styrkir': 19,
    'Óskilgreint veittir styrkir': 1,
    'Karlmaður umsóknir': 237,
    'Kona umsóknir': 86,
    'Óskilgreint umsóknir': 3,
  },
  {
    fund_year: 2014,
    'Karlmaður veittir styrkir': 40,
    'Kona veittir styrkir': 16,
    'Karlmaður umsóknir': 175,
    'Kona umsóknir': 57,
    'Óskilgreint umsóknir': 2,
  },
  {
    fund_year: 2015,
    'Karlmaður veittir styrkir': 69,
    'Kona veittir styrkir': 18,
    'Karlmaður umsóknir': 211,
    'Kona umsóknir': 54,
    'Óskilgreint umsóknir': 3,
  },
  {
    fund_year: 2016,
    'Karlmaður veittir styrkir': 75,
    'Kona veittir styrkir': 31,
    'Karlmaður umsóknir': 364,
    'Kona umsóknir': 128,
  },
  {
    fund_year: 2017,
    'Karlmaður veittir styrkir': 64,
    'Kona veittir styrkir': 37,
    'Karlmaður umsóknir': 367,
    'Kona umsóknir': 141,
  },
  {
    fund_year: 2018,
    'Karlmaður veittir styrkir': 54,
    'Kona veittir styrkir': 30,
    'Karlmaður umsóknir': 410,
    'Kona umsóknir': 189,
    'Óskilgreint umsóknir': 1,
  },
  {
    fund_year: 2019,
    'Karlmaður veittir styrkir': 54,
    'Kona veittir styrkir': 22,
    'Karlmaður umsóknir': 433,
    'Kona umsóknir': 196,
    'Óskilgreint umsóknir': 1,
  },
  {
    fund_year: 2020,
    'Karlmaður veittir styrkir': 66,
    'Kona veittir styrkir': 23,
    'Karlmaður umsóknir': 602,
    'Kona umsóknir': 278,
    'Óskilgreint umsóknir': 2,
  },
  {
    fund_year: 2021,
    'Karlmaður umsóknir': 48,
    'Kona umsóknir': 24,
  },
]

const dataKeysName = {
  sott: 'Umsóknir',
  veitt: 'Veittir styrkir',
  amount: 'Heildarupphæð styrkja',
}

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

const renderLabel = (value: string) => {
  return <p style={{ color: '#00003C' }}>{value}</p>
}
interface SimpleBarChartProps {
  dataset?: string
}
export const SimpleBarChart = ({ dataset }: SimpleBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={250}
        height={150}
        data={data}
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
        <YAxis stroke="#CCDFFF" tick={<CustomizedAxisTick />} />
        <Tooltip />
        <Legend iconType="circle" align="right" content={renderLegend} />
        <Bar
          dataKey="Óskilgreint umsóknir"
          fill="#B5B6EC"
          barSize={16}
          stackId="a"
        />
        <Bar
          dataKey="Karlmaður umsóknir"
          fill="#FF99B9"
          barSize={16}
          stackId="a"
        />
        <Bar
          dataKey="Kona umsóknir"
          fill="#D799C7"
          radius={[20, 20, 0, 0]}
          barSize={16}
          stackId="a"
        />
        <Bar
          dataKey="Óskilgreint veittir styrkir"
          fill="#99F4EA"
          barSize={16}
          stackId="b"
        />
        <Bar
          dataKey="Karlmaður veittir styrkir"
          fill="#C3ABD9"
          barSize={16}
          stackId="b"
        />
        <Bar
          dataKey="Kona veittir styrkir"
          fill="#99C0FF"
          radius={[20, 20, 0, 0]}
          barSize={16}
          stackId="b"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SimpleBarChart
