import React, { FC } from 'react'
import { Box, Text, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { SentFilesChartDataItem } from '../../lib/types'
import { formatYAxis } from '../../lib/utils'

interface Props {
  data: Array<SentFilesChartDataItem>
  title: string
  valueIndex?: number
}

const COLORS = ['#0061FF', '#6A2EA0', '#FF0050', '#00B39E']
const CAT_KEYS = ['cat1', 'cat2', 'cat3', 'cat4']

export const SentFilesBarChart: FC<React.PropsWithChildren<Props>> = ({
  data,
}) => {
  const { formatMessage } = useLocale()

  const TITLES =
    data && data.length > 0
      ? CAT_KEYS.map(
          (key) =>
            (data[0][key as keyof SentFilesChartDataItem] as { name?: string })
              ?.name ?? key,
        )
      : CAT_KEYS

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
          Send skjöl
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
            {CAT_KEYS.map((key, idx) => (
              <Bar
                key={key}
                dataKey={`${key}.published`}
                fill={COLORS[idx % COLORS.length]}
                name={TITLES[idx]}
                radius={[8, 8, 0, 0]}
              />
            ))}
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
