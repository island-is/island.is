import React, { FC } from 'react'
import { Box, Text, GridColumn, GridRow } from '@island.is/island-ui/core'
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  value: number
  color: string
}

interface Props {
  data: Array<ChartData>
  title: string
  valueIndex?: number
}

export const OpenedFilesDonutChart: FC<React.PropsWithChildren<Props>> = ({
  data,
  title,
  valueIndex,
}) => {
  return (
    <GridColumn span={['12/12', '6/12']}>
      <Box
        margin={0}
        padding={3}
        border="standard"
        borderWidth="large"
        borderRadius="large"
      >
        <Text variant="h3" marginBottom={2} color="blue400">
          {title}
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
              <Label
                value={
                  valueIndex !== undefined && data[valueIndex]
                    ? `${data[valueIndex].value}%`
                    : '%'
                }
                position="center"
                style={{
                  fontSize: '24px',
                  fill: '#0061ff',
                  fontWeight: 'bold',
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <Box paddingLeft={4} paddingRight={4} marginTop={1} marginBottom={3}>
          <GridRow rowGap={2}>
            {data.map((entry, index) => (
              <GridColumn key={index} span="6/12">
                <GridRow>
                  <GridColumn span="9/12">
                    <Text variant="small" fontWeight="medium" color="dark400">
                      <span
                        className="custom-rechart-bullet"
                        style={{
                          backgroundColor: entry.color,
                          display: 'inline-block',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          marginRight: 5,
                        }}
                      />
                      {entry.name}
                    </Text>
                  </GridColumn>
                  <GridColumn span="3/12">
                    <Text textAlign="right" variant="small" color="dark400">
                      {entry.value}%
                    </Text>
                  </GridColumn>
                </GridRow>
              </GridColumn>
            ))}
          </GridRow>
        </Box>
      </Box>
    </GridColumn>
  )
}
