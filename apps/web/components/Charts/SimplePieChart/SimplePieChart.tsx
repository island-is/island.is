import cn from 'classnames'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts'

import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import {
  COLORS,
  renderCustomizedLabel,
  RenderLegend,
} from '../sharedChartComponents'
import * as styles from './SimplePieChart.css'

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
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            ((payload[0].payload[datakey] / sum) * 100).toFixed(0)
          }
          %)
        </p>
      </div>
    )
  }

  return null
}

const getOuterRadius = (width: number) => {
  if (width < theme.breakpoints.sm) {
    return 60
  } else if (width < theme.breakpoints.lg) {
    return 100
  }
  return 120
}

interface GraphDataProps {
  data: string
  datakeys: string
}
interface GraphProps {
  graphData: GraphDataProps
}

export const SimplePieChart = ({ graphData }: GraphProps) => {
  const { data, datakeys } = graphData
  const parsedData = JSON.parse(data)
  const { datakey, legendOn } = JSON.parse(datakeys)

  const { width } = useWindowSize()

  const sum = parsedData.reduce(
    (sum: number, item: number[]) => sum + item[datakey],
    0,
  )
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
          outerRadius={getOuterRadius(width)}
          startAngle={90}
          endAngle={-270}
        >
          {parsedData.map((entry: { color: string }, index: number) => (
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
