import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelProps,
  Legend as ChartLegend,
  LegendProps,
  ResponsiveContainer,
  Text as ChartText,
  XAxis,
  YAxis,
} from 'recharts'
import { CartesianViewBox } from 'recharts/types/util/types'

import { ArrowLink, Box, Inline, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './Chart.css'

interface AxisTickProps {
  x?: number
  y?: number
  offset?: number
  payload?: { value: string }
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
      dy={15}
      className={styles.xAxisText}
      width="10"
      verticalAnchor="start"
    >
      {payload?.value}
    </ChartText>
  )
}

const Legend = (props: LegendProps) => {
  const { payload } = props

  if (!payload?.length) {
    return null
  }

  return (
    <Inline space={3}>
      {payload.map((entry) => {
        return (
          <Box key={entry.id} display="flex" alignItems="center">
            <Box
              marginRight={1}
              className={styles.legendIcon}
              style={{ background: entry.color }}
            />
            <Text>{entry.value}</Text>
          </Box>
        )
      })}
    </Inline>
  )
}

interface Props {
  title?: string
  link?: {
    text: string
    url: string
  }
  outlined?: boolean
  chart: {
    bars?: Array<{
      datakey: string
      fill: string
    }>
    dataset: unknown[]
    xAxisOptions: {
      datakey: string
    }
    legend?: {
      title?: string
    }
    tooltip?: {
      title?: string
    }
  }
}

export const Chart = ({ title, link, outlined, chart }: Props) => {
  const isMultipleBars = (chart.bars?.length ?? 0) > 1

  return (
    <Box
      width="full"
      height="full"
      padding={4}
      background={'transparent'}
      border={outlined ? 'standard' : 'disabled'}
      borderRadius="large"
    >
      {(title || link) && (
        <Box display="flex" justifyContent="spaceBetween" marginBottom={5}>
          {title && <Text variant="h5">{title}</Text>}
          {link && (
            <Box display="flex" alignItems="center">
              <ArrowLink href={link.url}>{link.text}</ArrowLink>
            </Box>
          )}
        </Box>
      )}
      <ResponsiveContainer aspect={1.5} width="100%" maxHeight={520}>
        <BarChart
          barGap="5%"
          barSize={isMultipleBars ? '3%' : '8%'}
          data={chart.dataset}
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
          {
            //chart.tooltip && <Tooltip content={<InvoiceTooltip />} />
          }
          {chart.legend && (
            <ChartLegend
              content={<Legend />}
              wrapperStyle={{ left: 100, bottom: 24 }}
              align="left"
              verticalAlign="bottom"
            />
          )}
          <XAxis
            dataKey={chart.xAxisOptions?.datakey}
            tick={<CustomizedAxisTick />}
            interval={0}
          />
          <YAxis
            label={<CustomizedYAxisLabel />}
            type="number"
            tick={{ fill: '#000000', dx: -7 }}
            domain={['dataMin - 5000', 'auto']}
            format={'string'}
            tickFormatter={(value) =>
              value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            }
          />
          {chart.bars?.map((bar) => (
            <Bar
              dataKey={bar.datakey}
              fill={bar.fill}
              radius={isMultipleBars ? [2, 2, 0, 0] : [4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  )
}
