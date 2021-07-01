import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  {
    name: "Menning, hönnun og afþreying",
      count: 21
  },
  {
      name: "Almenn matvælatækni",
      count: 18
  },
  {
      name: "Almenn verslun og þjónusta (þ.m.t. fjármálaþjónusta og öryggisþjónusta)",
      count: 15
  },
  {
      name: "Heilbrigðis- og velferðarþjónusta",
      count: 15
  },
  {
      name: "Fræðslu- og menntatengd þjónusta",
      count: 13
  },
  {
      name: "Fjarskiptaþjónusta og samgöngur",
      count: 12
  },
  {
      name: "Vinnsla lífrænna og ólífrænna efna (önnur en efnaframleiðsla)",
      count: 10
  },
  {
      name: "Bygginga- og mannvirkjagerð (þ.m.t. viðhald)",
      count: 10
  },
  {
      name: "Hagnýting auðlinda lífríkis á landi (Landbúnaður skógrækt)",
      count: 9
  },
  {
      name: "Umhverfis- og skipulagsmál (þ.m.t. vatnsveitur og úrgangur)",
      count: 9
  },
  {
      name: "Ferðaþjónusta",
      count: 7
  },
  {
      name: "Annað",
      count: 5
  }]
  
  
  
  
  
  const COLORS = [
    '#99C0FF',
    '#D799C7',
    '#99F4EA',
    '#FF99B9',
    '#C3ABD9',
    '#B5B6EC',
  ]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="#00003C"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export const SimplePieChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={10} height={10}>
        <Pie
          dataKey="count"
          isAnimationActive={true}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={136}
          fill="#8884d8"
          label={renderCustomizedLabel}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default SimplePieChart
