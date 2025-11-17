import { useMeasure } from 'react-use'
import cn from 'classnames'
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelProps,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Text as ChartText,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CartesianViewBox } from 'recharts/types/util/types'

import { Box, Icon, LinkV2, Text } from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/shared/utils'

import { MOCK_CHART_1 } from '../../Totals/mockData'
import * as styles from './Chart.css'

interface AxisTickProps {
  x?: number
  y?: number
  offset?: number
  payload?: { value: string }
}

interface yAxisLabelProps {
  label?: string
  labelRight?: string
  rightPadding?: number
}

const CustomizedYAxisLabel = (data: LabelProps) => {
  const viewBox = data.viewBox as CartesianViewBox
  return (
    <ChartText
      x={0}
      y={0}
      dy={20}
      dx={viewBox?.width}
      fill="#000000"
      textAnchor="start"
      width={180}
    >
      m.kr.
    </ChartText>
  )
}

const CustomizedAxisTick = ({ x, y, payload }: AxisTickProps) => {
  return (
    <ChartText
      x={x}
      y={y}
      style={{ fontSize: '14px' }}
      fill="#000000"
      textAnchor="middle"
      width="30"
      verticalAnchor="start"
    >
      {payload?.value}
    </ChartText>
  )
}

export const Chart = () => {
  return (
    <Box
      width="full"
      height="full"
      padding={4}
      background="white"
      border="standard"
      borderRadius="large"
    >
      <Box display="flex" justifyContent="spaceBetween" marginBottom={5}>
        <Text variant="h5">Stærstu kaupendur</Text>
        <Box display="flex" alignItems="center">
          <LinkV2
            href={'/temp'}
            color="blue400"
            underline="normal"
            underlineVisibility="always"
          >
            Sjá alla kaupendur
          </LinkV2>
          <Icon icon="arrowForward" color="blue400" />
        </Box>
      </Box>
      <ResponsiveContainer aspect={1.5} width="100%" maxHeight={520}>
        <BarChart
          barGap="20%"
          barSize={56}
          data={MOCK_CHART_1}
          margin={{
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          }}
        >
          <CartesianGrid vertical={false} stroke="#CCDFFF" />
          <XAxis
            dataKey="institution"
            tick={<CustomizedAxisTick />}
            interval={0}
          />
          <YAxis
            label={<CustomizedYAxisLabel />}
            type="number"
            tick={{ fill: '#000000' }}
            domain={['dataMin - 5000', 'auto']}
            format={'string'}
            tickFormatter={(value) =>
              value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
          />
          <Bar dataKey="amount" fill="#0061FF" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )

  /*  return (
    <Box
      className={cn(styles.frameWrapper, {
        [styles.scroll]: width < 800,
      })}
      borderColor="purple100"
      borderWidth="standard"
      borderRadius="large"
      display="flex"
      flexDirection="column"
    >
      <Box
        ref={ref}
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
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={600}
              height={600}
              data={MOCK_CHART_1}
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
                dataKey={'insitutions'}
                stroke="#CCDFFF"
                padding={{ left: 30 }}
                tickLine={false}
              />
              <YAxis stroke="#CCDFFF" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
      </Box>

    </Box>
  )*/
}
