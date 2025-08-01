import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CustomizedAxisTick,
  CustomTooltip,
  RenderLegend,
  YAxisLabel,
} from '../sharedChartComponents'
import * as styles from './styles.css'

interface Axis {
  label?: string
  datakey: string
  valueFormat?: (arg: number) => string
}

interface BarType {
  datakey: string
}

interface TooltipType {
  labels: Record<string, string>
  valueFormat?: (arg: number) => string
}

export interface GraphDataProps {
  title?: string
  data: Array<Record<string, number | string>>
  datakeys: Array<string>
  bars: Array<BarType>
  xAxis: Axis
  yAxis: Axis
  tooltip?: TooltipType
}

export const SimpleBarChart = ({
  title,
  data,
  datakeys,
  bars,
  xAxis,
  yAxis,
  tooltip,
}: GraphDataProps) => {
  return (
    <Box
      className={styles.frameWrapper}
      display="flex"
      flexDirection="column"
      flexGrow={1}
      alignItems="stretch"
      justifyContent="flexStart"
    >
      <Box className={styles.graphWrapper} width="full">
        <Box
          justifyContent="center"
          alignItems="center"
          className={styles.graphParent}
        >
          <Box width="full" height="full">
            <YAxisLabel label={yAxis.label} />
            <ResponsiveContainer width="100%" height="90%">
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
                <Tooltip
                  content={
                    <CustomTooltip
                      valueLabels={tooltip?.labels}
                      valueFormat={tooltip?.valueFormat}
                    />
                  }
                />
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
                    name={tooltip?.labels?.[item.datakey] || item.datakey}
                    aria-label={`Bar chart data for ${item.datakey}`}
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
