import React, { FC } from 'react'
import {
  Box,
  Text,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { formatYAxis } from '../../lib/utils'

export interface ChartData {
  name: string
  failures: number
  opened: number
}

interface Props {
  data: Array<ChartData>
}

const COLORS = ['#99C0FF', '#FF0050']
const TITLES = ['Send skjöl', 'Villur']

export const SentFilesAndErrorsBarChart: FC<React.PropsWithChildren<Props>> = ({
  data,
}) => {
  

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
          Skjöl afhend og villur
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
          >
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
              tick={{ fontSize: 14, fill: '#9999B1' }}
              width={40}
              tickFormatter={formatYAxis}
            />
            <Tooltip />

            <Bar
              dataKey="published"
              fill={COLORS[0]}
              name="Send skjöl"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="failures"
              fill={COLORS[1]}
              name="Villur"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <Box paddingLeft={4} paddingRight={4} marginTop={1}>
          <GridRow rowGap={2}>
            <GridColumn span={['6/12', '10/12']} offset={['1/12', '2/12']}>
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
