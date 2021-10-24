import React from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Legend,
} from 'recharts'
import * as styles from './SimplePieChart.css'
import cn from 'classnames'
import {
  COLORS,
  RenderLegend,
  renderCustomizedLabel,
} from '../sharedChartComponents'

interface CustomTooltipProps extends TooltipProps<string, number> {
  sum: number
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { payload, active, sum } = props
  if (active && payload && payload.length) {
    const datakey = payload[0].dataKey
    return (
      <div className={cn(styles.tooltip)}>
        <p>
          {payload[0].name} (
          {((payload[0].payload[datakey] / sum) * 100).toFixed(0)}%)
        </p>
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

export const SimplePieChart = ({ graphData }: GraphProps) => {
  const { title, data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const { datakey, legendOn } = JSON.parse(datakeys)

  const sum = parsedData.reduce((sum, item) => sum + item[datakey], 0)
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={10} height={10}>
        {legendOn && <Legend iconType="circle" content={<RenderLegend />} />}
        <Pie
          dataKey={datakey}
          isAnimationActive={false}
          data={parsedData}
          labelLine={false}
          label={renderCustomizedLabel}
          cx="50%"
          cy="50%"
          outerRadius={136}
          startAngle={90}
          endAngle={-270}
        >
          {parsedData.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.color ? entry.color : COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip sum={sum} />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default SimplePieChart
