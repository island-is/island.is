import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts'
import * as styles from './SimplePieChart.treat'
import cn from 'classnames'


const veitt = [
  { "name": "HB", "count": 655 },
  { "name": null, "count": 66 },
  { "name": "RN", "count": 18 },
  { "name": "SL", "count": 17 },
  { "name": "VF", "count": 10 },
  { "name": "AL", "count": 7 },
  { "name": "VL", "count": 6 },
  { "name": "NV", "count": 3 }
]
const umsokn = [
  { "name": "HB", "count": 3669 },
  { "name": null, "count": 442 },
  { "name": "RN", "count": 128 },
  { "name": "SL", "count": 115 },
  { "name": "VL", "count": 67 },
  { "name": "VF", "count": 47 },
  { "name": "AL", "count": 35 },
  { "name": "NV", "count": 29 }
]
const COLORS = [
  '#00B39E',
  '#FFF066',
  '#0061FF',
  '#FF99B9',
  '#C3ABD9',
  '#E6CF00',
  '#6A2EA0',
  '#00E4CA',
  '#9A0074',
  '#99C0FF',
  '#D799C7',
  '#99F4EA',
  '#B5B6EC',
  '#FF0050',
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

interface GraphDataProps {
  title?: string
  data: string
  datakeys: string
}
interface GraphProps {
  graphData: GraphDataProps
}

export const SimplePieChart = ({graphData}: GraphProps) => {
  const { title, data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const {datakey} = JSON.parse(datakeys)

  const sum = parsedData.reduce((sum, item) => sum+item[datakey], 0)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={10} height={10}>
        <Pie
          dataKey={datakey}
          isAnimationActive={true}
          data={parsedData}
          cx="50%"
          cy="50%"
          outerRadius={136}
          fill="#8884d8"
          label={false}
          labelLine={false}
          startAngle={90}
          endAngle={-270}
        >
          {parsedData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip sum={sum} />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default SimplePieChart
