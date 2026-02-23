import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'

interface PaymentDetail {
  id: string
  paymentType: string
  share: string
  pendingPayments: string
  operation: string
  dateRange: string
}

interface RightsHolder {
  id: string
  name: string
  nationalId: string
  bankInfo: string
  isatNumber: string
  vatNumber: string
  paymentDetails: PaymentDetail[]
}

// Mock data - TODO: Replace with GraphQL query when API is ready
const mockRightsHolders: RightsHolder[] = [
  {
    id: '1',
    name: 'Keldudalur ehf',
    nationalId: '570196-2359',
    bankInfo: '0310-26-000570',
    isatNumber: '01.41.0 - Ræktun mjólkurkúa',
    vatNumber: '049242',
    paymentDetails: [
      {
        id: '1-1',
        paymentType: 'Gæðastýring í sauðfé',
        share: '100%',
        pendingPayments: 'Nei',
        operation: 'í rekstri',
        dateRange: '01.01.2018 - ',
      },
      {
        id: '1-2',
        paymentType: 'Framleiðslustyrkur',
        share: '75%',
        pendingPayments: 'Já',
        operation: 'í rekstri',
        dateRange: '15.03.2020 - ',
      },
      {
        id: '1-3',
        paymentType: 'Umhverfisstyrkur',
        share: '100%',
        pendingPayments: 'Nei',
        operation: 'lokið',
        dateRange: '01.06.2019 - 31.12.2023',
      },
      {
        id: '1-4',
        paymentType: 'Lífrænir vottaðir',
        share: '50%',
        pendingPayments: 'Nei',
        operation: 'í rekstri',
        dateRange: '01.01.2021 - ',
      },
      {
        id: '1-5',
        paymentType: 'Búvörusamningur',
        share: '100%',
        pendingPayments: 'Nei',
        operation: 'í rekstri',
        dateRange: '01.01.2015 - ',
      },
    ],
  },
  {
    id: '2',
    name: 'Jón Jónsson',
    nationalId: '040393-2359',
    bankInfo: '0310-26-000669',
    isatNumber: '01.50.0 - Blandaður búskapur',
    vatNumber: '103750',
    paymentDetails: [
      {
        id: '2-1',
        paymentType: 'Framleiðslustyrkur',
        share: '100%',
        pendingPayments: 'Nei',
        operation: 'í rekstri',
        dateRange: '01.01.2022 - ',
      },
      {
        id: '2-2',
        paymentType: 'Gæðastýring í nautgripum',
        share: '100%',
        pendingPayments: 'Nei',
        operation: 'í rekstri',
        dateRange: '10.05.2019 - ',
      },
      {
        id: '2-3',
        paymentType: 'Sauðfjárstyrkur',
        share: '80%',
        pendingPayments: 'Nei',
        operation: 'í rekstri',
        dateRange: '01.03.2020 - ',
      },
      {
        id: '2-4',
        paymentType: 'Beitarstyrkur',
        share: '100%',
        pendingPayments: 'Nei',
        operation: 'í rekstri',
        dateRange: '01.01.2021 - ',
      },
      {
        id: '2-5',
        paymentType: 'Kolefnisjöfnun',
        share: '100%',
        pendingPayments: 'Já',
        operation: 'í vinnslu',
        dateRange: '01.01.2023 - ',
      },
    ],
  },
]

export const RightsHolders = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()

  // TODO: Replace with actual query when API is ready
  // const { data, loading, error } = useRightsHoldersQuery()
  const loading = false
  const error = null

  const tableData = useMemo(() => mockRightsHolders, [])

  const columns = useMemo<Column<RightsHolder>[]>(
    () => [
      {
        Header: 'Handhafi',
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: 'Kennitala',
        accessor: 'nationalId',
        sortType: 'basic',
      },
      {
        Header: 'Bankaupplýsingar',
        accessor: 'bankInfo',
        sortType: 'basic',
      },
      {
        Header: 'Ísat númer',
        accessor: 'isatNumber',
        sortType: 'basic',
      },
      {
        Header: 'Vsk. númer',
        accessor: 'vatNumber',
        sortType: 'basic',
      },
    ],
    [],
  )

  const renderExpandedRow = (row: Row<RightsHolder>) => {
    return (
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Greiðslutegund</T.HeadData>
            <T.HeadData>Hlutfall</T.HeadData>
            <T.HeadData>Greiðslur í bið</T.HeadData>
            <T.HeadData>Rekstur</T.HeadData>
            <T.HeadData>Dagsetning</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {row.original.paymentDetails.map((detail) => (
            <T.Row key={detail.id}>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.paymentType}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.share}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.pendingPayments}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.operation}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.dateRange}</Text>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    )
  }

  return (
    <Box width="full" overflow="auto" rowGap={3} marginTop={6}>
      <Box display="flex" alignItems="flexEnd" marginBottom={3}>
        <Button
          size="small"
          variant="utility"
          name="Sækja"
          title="Sækja"
          icon="download"
          iconType="outline"
        >
          Sækja
        </Button>
      </Box>
      <FarmerLandsTable
        columns={columns}
        data={tableData}
        loading={loading}
        error={!!error}
        emptyMessage="Engir réttarhafar fundust"
        errorMessage="Villa kom upp við að sækja réttarhafa"
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default RightsHolders
