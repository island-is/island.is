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

const veitt = [
  { fund_year: 2016, "Karlmaður": 75 },
  { fund_year: 2015, "Karlmaður": 69 },
  { fund_year: 2020, "Karlmaður": 66 },
  { fund_year: 2017, "Karlmaður": 64 },
  { fund_year: 2019, "Karlmaður": 54 },
  { fund_year: 2018, "Karlmaður": 54 },
  { fund_year: 2013, "Karlmaður": 41 },
  { fund_year: 2014, "Karlmaður": 40 },
  { fund_year: 2012, "Karlmaður": 38 },
  { fund_year: 2017, "Kona": 37 },
  { fund_year: 2016, "Kona": 31 },
  { fund_year: 2011, "Karlmaður": 30 },
  { fund_year: 2018, "Kona": 30 },
  { fund_year: 2020, "Kona": 23 },
  { fund_year: 2019, "Kona": 22 },
  { fund_year: 2013, "Kona": 19 },
  { fund_year: 2015, "Kona": 18 },
  { fund_year: 2014, "Kona": 16 },
  { fund_year: 2010, "Karlmaður": 16 },
  { fund_year: 2011, "Kona": 15 },
  { fund_year: 2012, "Kona": 14 },
  { fund_year: 2010, "Kona": 6 },
  { fund_year: 2011, "Óskilgreint": 1 },
  { fund_year: 2012, "Óskilgreint": 1 },
  { fund_year: 2010, "Óskilgreint": 1 },
  { fund_year: 2013, "Óskilgreint": 1 }
]

const umsoknir = [
  { fund_year: 2020, "Karlmaður": 602 },
  { fund_year: 2019, "Karlmaður": 433 },
  { fund_year: 2018, "Karlmaður": 410 },
  { fund_year: 2017, "Karlmaður": 367 },
  { fund_year: 2016, "Karlmaður": 364 },
  { fund_year: 2020, "Kona": 278 },
  { fund_year: 2013, "Karlmaður": 237 },
  { fund_year: 2015, "Karlmaður": 211 },
  { fund_year: 2019, "Kona": 196 },
  { fund_year: 2018, "Kona": 189 },
  { fund_year: 2014, "Karlmaður": 175 },
  { fund_year: 2011, "Karlmaður": 169 },
  { fund_year: 2012, "Karlmaður": 144 },
  { fund_year: 2017, "Kona": 141 },
  { fund_year: 2016, "Kona": 128 },
  { fund_year: 2010, "Karlmaður": 88 },
  { fund_year: 2013, "Kona": 86 },
  { fund_year: 2014, "Kona": 57 },
  { fund_year: 2015, "Kona": 54 },
  { fund_year: 2021, "Karlmaður": 48 },
  { fund_year: 2011, "Kona": 48 },
  { fund_year: 2012, "Kona": 41 },
  { fund_year: 2021, "Kona": 24 },
  { fund_year: 2010, "Kona": 16 },
  { fund_year: 2011, "Óskilgreint": 6 },
  { fund_year: 2010, "Óskilgreint": 5 },
  { fund_year: 2015, "Óskilgreint": 3 },
  { fund_year: 2012, "Óskilgreint": 3 },
  { fund_year: 2013, "Óskilgreint": 3 },
  { fund_year: 2020, "Óskilgreint": 2 },
  { fund_year: 2014, "Óskilgreint": 2 },
  { fund_year: 2019, "Óskilgreint": 1 },
  { fund_year: 2018, "Óskilgreint": 1 }
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
interface SimpleBarChartProps {
  dataset?: string,
}
export const SimpleBarChart = ({dataset}: SimpleBarChartProps) => {
  let data = umsoknir
  switch(dataset) {
    case "umsokn":
      data = umsoknir
      break
    case "veitt":
      data = veitt
      break
    default:
      data = umsoknir
      break 
  }
  const sorted_data = data.sort((a, b) => {
    return a.fund_year - b.fund_year
  })
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
        <YAxis stroke="#CCDFFF" tick={<CustomizedAxisTick />}/>
        <Tooltip />
        <Legend iconType="circle" align="right" content={renderLegend} />
        <Bar
          dataKey="Karlmaður"
          fill="#FF99B9"
          radius={[20, 20, 0, 0]}
          barSize={16}
        />
        <Bar
          dataKey="Kona"
          fill="#D799C7"
          radius={[20, 20, 0, 0]}
          barSize={16}
        />
        <Bar
          dataKey="Óskilgreint"
          fill="#B5B6EC"
          radius={[20, 20, 0, 0]}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default SimpleBarChart
