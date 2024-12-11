import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  CustomizedAxisTick,
  RenderLegend,
  COLORS,
  CustomTooltip,
  YAxisLabel,
} from '../sharedChartComponents'
import { Box } from '@island.is/island-ui/core'
import * as styles from './styles.css'
import { theme } from '@island.is/island-ui/theme'

type Datakeys = Array<string>

interface Axis {
  label?: string
  datakey: string
}

interface BarType {
  datakey: string
}

interface GraphDataProps {
  title?: string
  data: Array<Record<string, number | string>>
  datakeys: Array<string>
  bars: Array<BarType>
  xAxis: Axis
  yAxis: Axis
}

export const SimpleBarChart = ({
  title,
  data,
  datakeys,
  bars,
  xAxis,
  yAxis,
}: GraphDataProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      alignItems="stretch"
      justifyContent="flexStart"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        className={styles.graphWrapper}
      >
        <Box
          justifyContent="center"
          alignItems="center"
          className={styles.graphParent}
        >
          <Box width="full" height="full">
            <YAxisLabel label={yAxis.label} />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={20}
                height={150}
                data={data}
                margin={{
                  top: 30,
                  right: 0,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#CCDFFF"
                />
                <XAxis
                  dataKey={xAxis.datakey}
                  stroke="#CCDFFF"
                  tick={<CustomizedAxisTick />}
                  padding={{ left: 30 }}
                  tickLine={false}
                />
                <YAxis stroke="#CCDFFF" tick={<CustomizedAxisTick />} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  align="right"
                  content={
                    <RenderLegend labels={{ mileage: 'Kílómetrastaða' }} />
                  }
                />
                {bars.map((item: BarType, index: number) => (
                  <Bar
                    key={index}
                    dataKey={item.datakey}
                    fill={theme.color.blue400}
                    barSize={16}
                    radius={[20, 20, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SimpleBarChart
