import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import * as styles from './SimplePieChart.treat'
import cn from 'classnames'
import { Payload } from 'recharts/types/component/DefaultTooltipContent'

const data = [
  {
    name: 'Menning, hönnun og afþreying',
    tala: 21,
  },
  {
    name: 'Almenn matvælatækni',
    tala: 18,
  },
  {
    name:
      'Almenn verslun og þjónusta (þ.m.t. fjármálaþjónusta og öryggisþjónusta)',
    tala: 15,
  },
  {
    name: 'Heilbrigðis- og velferðarþjónusta',
    tala: 15,
  },
  {
    name: 'Fræðslu- og menntatengd þjónusta',
    tala: 13,
  },
  {
    name: 'Fjarskiptaþjónusta og samgöngur',
    tala: 12,
  },
  {
    name: 'Vinnsla lífrænna og ólífrænna efna (önnur en efnaframleiðsla)',
    tala: 10,
  },
  {
    name: 'Bygginga- og mannvirkjagerð (þ.m.t. viðhald)',
    tala: 10,
  },
  {
    name: 'Hagnýting auðlinda lífríkis á landi (Landbúnaður skógrækt)',
    tala: 9,
  },
  {
    name: 'Umhverfis- og skipulagsmál (þ.m.t. vatnsveitur og úrgangur)',
    tala: 9,
  },
  {
    name: 'Ferðaþjónusta',
    tala: 7,
  },
  {
    name: 'Annað',
    tala: 5,
  },
]

const COLORS = [
  '#99C0FF',
  '#D799C7',
  '#99F4EA',
  '#FF99B9',
  '#C3ABD9',
  '#B5B6EC',
]

interface CustomTooltipProps extends TooltipProps<string, number> {
  sum: number
}

const CustomTooltip = (props:  CustomTooltipProps) => {
  const { payload, active, sum } = props
  if (active && payload && payload.length) {
    const datakey = payload[0].dataKey
    return (
      <div className={cn(styles.tooltip)}>
        <p>{payload[0].name} ({((payload[0].payload[datakey]/sum) * 100).toFixed(0)}%)</p>
      </div>
    )
  }

  return null
}

export const SimplePieChart = () => {
  const datakey = 'tala'
  const sum = data.reduce((sum, item) => sum+item[datakey], 0)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={10} height={10}>
        <Pie
          dataKey={datakey}
          isAnimationActive={true}
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={136}
          fill="#8884d8"
          label={false}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip sum={sum} />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default SimplePieChart
