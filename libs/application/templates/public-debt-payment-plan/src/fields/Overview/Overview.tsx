import { Label, ReviewGroup, Table } from '@island.is/application/ui-components'
import { Box, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import React from 'react'

export const Overview = () => {
  const editAction = () => {
    console.log('this is edit action')
  }

  const formatIsk = (value: number): string =>
    value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'

  const mockTable = [
    {
      date: '01.01.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.02.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.03.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.04.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.05.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.06.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.07.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.08.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.09.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.10.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.11.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
    {
      date: '01.12.2021',
      remaining: formatIsk(95000),
      deposit: formatIsk(3750),
      interestRates: formatIsk(0),
      totalPayment: formatIsk(9076),
    },
  ]
  const data = React.useMemo(() => [...mockTable], [mockTable])
  const columns = React.useMemo(
    () => [
      {
        Header: 'Gjalddagi',
        accessor: 'date',
      } as const,
      {
        Header: 'Eftirstöðvar',
        accessor: 'remaining',
      } as const,
      {
        Header: 'Innborgun',
        accessor: 'deposit',
      } as const,
      {
        Header: 'Vextir',
        accessor: 'interestRates',
      } as const,
      {
        Header: 'Greiðsla alls',
        accessor: 'totalPayment',
      } as const,
    ],
    [],
  )
  return (
    <>
      <ReviewGroup isEditable editAction={editAction}>
        <GridRow>
          <GridColumn span={['6/12', '5/12']}>
            <Box>
              <Label>Nafn</Label>
              <Text>Fjármundur Skuldason</Text>
            </Box>
            <Box>
              <Label marginTop={2}>Sími</Label>
              <Text>8486525</Text>
            </Box>
          </GridColumn>
          <GridColumn span={['6/12', '5/12']}>
            <Box>
              <Label>Heimilisfang</Label>
              <Text>Skuldagötu 2, 110 Reykjavík</Text>
            </Box>
            <Box>
              <Label marginTop={2}>Netfang</Label>
              <Text>Fjarmundurskuldason@simnet.is</Text>
            </Box>
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup isEditable editAction={editAction}>
        <GridRow>
          <GridColumn span={['6/12', '5/12']}>
            <Box>
              <Label>Vinnuveitandi</Label>
              <Text>Krónan ehf.</Text>
            </Box>
          </GridColumn>
          <GridColumn span={['6/12', '5/12']}>
            <Box>
              <Label>Kennitala vinnuveitanda</Label>
              <Text>711298-2239</Text>
            </Box>
          </GridColumn>
        </GridRow>
      </ReviewGroup>
      <ReviewGroup isEditable editAction={editAction}>
        <Box paddingBottom={[2, 4]}>
          <Label>Skattar og gjöld</Label>
          <Text>Mánaðarlegar greiðslur</Text>
        </Box>
        <Table columns={columns} data={data} truncate />
      </ReviewGroup>
    </>
  )
}
