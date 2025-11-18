import { useMeasure, useWindowSize } from "react-use"
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
  YAxis} from 'recharts'
import { CartesianViewBox } from "recharts/types/util/types"

import { ArrowLink, Box, Icon, LinkV2, Text } from "@island.is/island-ui/core"
import { formatCurrency } from "@island.is/shared/utils"

import { MOCK_CHART_1 } from "../../Totals/mockData"
import * as styles from './Chart.css'
import { theme, UNIT } from "@island.is/island-ui/theme"
import { M } from "msw/lib/glossary-2792c6da"


interface AxisTickProps {
  x?: number
  y?: number
  offset?: number,
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
      fontWeight={theme.typography.semiBold}
      width={180}>
      m.kr.
    </ChartText>
  )
}


const CustomizedAxisTick = ({x,y ,payload}: AxisTickProps) => {
  return <ChartText x={x} y={y} dy={15} className={styles.xAxisText} width="10" verticalAnchor="start">
     {payload?.value}
  </ChartText>
}

interface Props {
  title: string
  link?: {
    text: string;
    url: string;
  }
  chartData: unknown[]
}

export const Chart = ({title, link, chartData }: Props) => {
  if (!chartData || chartData.length < 1) {
    return null;
  }

  return (
    <Box width="full" height="full" padding={4} background="white" border="standard"  borderRadius="large">
     <Box display="flex" justifyContent="spaceBetween" marginBottom={5}>
        <Text variant="h5">{title}</Text>
        {link && <Box display="flex" alignItems="center">
          <ArrowLink href={link.url}>
            {link.text}
          </ArrowLink>
        </Box>}
     </Box>
      <ResponsiveContainer aspect={1.5} width="100%" maxHeight={520}>
        <BarChart
          barGap='20%'
          barSize='8%'
          data={chartData}
          margin={{
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
          }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#CCDFFF"
          />
          <XAxis dataKey="institution" tick={<CustomizedAxisTick />} interval={0} />
          <YAxis label={<CustomizedYAxisLabel />} type="number" tick={{ fill: '#000000', dx: -7}} domain={['dataMin - 5000', 'auto']} format={'string'} tickFormatter={(value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} />
          <Bar dataKey="amount" fill="#0061FF" radius={[4, 4, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </Box>);
}
