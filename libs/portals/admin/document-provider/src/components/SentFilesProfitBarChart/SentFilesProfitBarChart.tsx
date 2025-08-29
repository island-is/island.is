import React, { FC } from 'react'
import {
  Box,
  Text,
  Inline,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  Cell,
  Label,
  Pie,
  PieChart,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'
import { formatYAxis } from '../../lib/utils'

export interface ChartData {
  name: string
  winning: number
}

interface Props {
  data: Array<ChartData>
}

const COLORS = ['#00B39E', '#FF0050']
const TITLES = ['Ávinningur']

export const SentFilesProfitBarChart: FC<React.PropsWithChildren<Props>> = ({
  data,
}) => {
  const { formatMessage } = useLocale()

  return (
    <GridColumn span={['12/12', '12/12', '6/12']}>
      <Box
        marginBottom={3}
        padding={3}
        border="standard"
        borderWidth="large"
        borderRadius="large"
        alignItems={'center'}
      >
        <Text variant="h3" marginBottom={2} color="blue400">
          Ávinningur í krónum
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              interval={0} // Show all labels
              tickLine
              height={50}
              tickMargin={10}
              axisLine
              tickSize={10}
              tick={{ fontSize: 14, fill: '#9999B1' }}
            />
            <YAxis
              width={40}
              tick={{ fontSize: 14, fill: '#9999B1' }}
              tickFormatter={formatYAxis}
            />
            <Tooltip />

            <Bar
              dataKey="winning"
              fill={COLORS[0]}
              name="Ávinningur"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <Box paddingLeft={4} paddingRight={4} marginTop={1}>
          <GridRow rowGap={2}>
            <GridColumn span={['6/12', '8/12']} offset={['1/12', '4/12']}>
              <GridRow>
                {TITLES.map((entry, index) => (
                  <GridColumn key={index} span="6/12">
                    <Text variant="small" fontWeight="medium" color="dark400">
                      <span
                        className="custom-rechart-bullet"
                        style={{
                          backgroundColor: COLORS[index],
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          marginRight: 5,
                        }}
                      />
                      {entry}
                    </Text>
                  </GridColumn>
                ))}
              </GridRow>
            </GridColumn>
          </GridRow>
        </Box>
      </Box>
    </GridColumn>
  )
}
