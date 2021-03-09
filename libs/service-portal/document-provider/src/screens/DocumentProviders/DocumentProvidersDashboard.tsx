import React, { useState, useEffect } from 'react'
import { useLocale } from '@island.is/localization'
import { GridRow, GridColumn, Box } from '@island.is/island-ui/core'
import { StatisticBox } from '../../components/StatisticBox/StatisticBox'

export const DocumentProvidersDashboard = () => {
  const { formatMessage } = useLocale()

  interface Data {
    name: string
    value: number
  }
  const [data, setData] = useState<Data[]>([])

  useEffect(() => {
    //TODO: Set up real data
    handleFetch()
  }, [])

  const handleFetch = () => {
    //TODO: Set up real data
    setData([
      {
        name: 'Fjöldi skjalaveitenda',
        value: 120,
      },
      { name: 'Send skjöl', value: 120 },
      { name: 'Opnuð skjöl', value: 75 },
      { name: 'Hnipp', value: 85 },
    ])
  }

  return (
    <Box marginBottom={2}>
      {data && (
        <GridRow>
          {data.map((Data, index) => (
            <GridColumn span={['12/12', '3/12']} key={index}>
              <StatisticBox name={Data.name} value={Data.value} />
            </GridColumn>
          ))}
        </GridRow>
      )}
    </Box>
  )
}
