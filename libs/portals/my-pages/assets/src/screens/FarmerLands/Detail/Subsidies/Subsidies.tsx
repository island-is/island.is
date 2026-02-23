import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'

interface SubsidyDetail {
  id: string
  name: string
  type: string
  nationalId: string
  units: string
  unitPrice: string
}

interface Subsidy {
  id: string
  date: string
  taxYear: string
  agreement: string
  amount: number
  deduction: number
  paidOut: number
  subsidyDetails: SubsidyDetail[]
}

// Mock data - TODO: Replace with GraphQL query when API is ready
const mockSubsidies: Subsidy[] = [
  {
    id: '1',
    date: '29.01.2023',
    taxYear: '2023',
    agreement: 'Nautgriparækt',
    amount: 310826,
    deduction: 0,
    paidOut: 310826,
    subsidyDetails: [
      {
        id: '1-1',
        name: 'Keldurdalur ehf.',
        type: 'Jarðræktarstyrkur - Sprettgreiðslur',
        nationalId: '570196-2359',
        units: '28,8',
        unitPrice: '22.080',
      },
      {
        id: '1-2',
        name: 'Keldurdalur ehf.',
        type: 'Framleiðslustyrkur',
        nationalId: '570196-2359',
        units: '150',
        unitPrice: '1.250',
      },
      {
        id: '1-3',
        name: 'Keldurdalur ehf.',
        type: 'Gæðastýring',
        nationalId: '570196-2359',
        units: '12',
        unitPrice: '4.500',
      },
    ],
  },
  {
    id: '2',
    date: '15.03.2023',
    taxYear: '2023',
    agreement: 'Sauðfé',
    amount: 245000,
    deduction: -12500,
    paidOut: 232500,
    subsidyDetails: [
      {
        id: '2-1',
        name: 'Jón Jónsson',
        type: 'Sauðfjárstyrkur',
        nationalId: '040393-2359',
        units: '200',
        unitPrice: '1.000',
      },
      {
        id: '2-2',
        name: 'Jón Jónsson',
        type: 'Beitarstyrkur',
        nationalId: '040393-2359',
        units: '45',
        unitPrice: '1.000',
      },
    ],
  },
  {
    id: '3',
    date: '20.06.2022',
    taxYear: '2022',
    agreement: 'Nautgriparækt',
    amount: 289450,
    deduction: 0,
    paidOut: 289450,
    subsidyDetails: [
      {
        id: '3-1',
        name: 'Keldurdalur ehf.',
        type: 'Framleiðslustyrkur',
        nationalId: '570196-2359',
        units: '140',
        unitPrice: '1.200',
      },
      {
        id: '3-2',
        name: 'Keldurdalur ehf.',
        type: 'Umhverfisstyrkur',
        nationalId: '570196-2359',
        units: '80',
        unitPrice: '1.500',
      },
    ],
  },
  {
    id: '4',
    date: '10.02.2022',
    taxYear: '2022',
    agreement: 'Umhverfisstyrkur',
    amount: 150000,
    deduction: -7500,
    paidOut: 142500,
    subsidyDetails: [
      {
        id: '4-1',
        name: 'Jón Jónsson',
        type: 'Kolefnisjöfnun',
        nationalId: '040393-2359',
        units: '100',
        unitPrice: '1.500',
      },
    ],
  },
  {
    id: '5',
    date: '05.12.2021',
    taxYear: '2021',
    agreement: 'Gæðastýring',
    amount: 180000,
    deduction: 0,
    paidOut: 180000,
    subsidyDetails: [
      {
        id: '5-1',
        name: 'Keldurdalur ehf.',
        type: 'Gæðastýring í mjólkurframleiðslu',
        nationalId: '570196-2359',
        units: '120',
        unitPrice: '1.500',
      },
    ],
  },
]

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('is-IS').format(value)
}

export const Subsidies = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()

  // TODO: Replace with actual query when API is ready
  // const { data, loading, error } = useSubsidiesQuery()
  const loading = false
  const error = null

  const tableData = useMemo(() => mockSubsidies, [])

  const columns = useMemo<Column<Subsidy>[]>(
    () => [
      {
        Header: 'Dagsetning',
        accessor: 'date',
        sortType: 'basic',
      },
      {
        Header: 'Skattár',
        accessor: 'taxYear',
        sortType: 'basic',
      },
      {
        Header: 'Samningur',
        accessor: 'agreement',
        sortType: 'basic',
      },
      {
        Header: 'Upphæð',
        accessor: 'amount',
        sortType: 'alphanumeric',
        Cell: ({ value }) => formatNumber(value),
      },
      {
        Header: 'Skuldajöf.',
        accessor: 'deduction',
        sortType: 'alphanumeric',
        Cell: ({ value }) => (value !== 0 ? formatNumber(value) : '0'),
      },
      {
        Header: 'Útborgað',
        accessor: 'paidOut',
        sortType: 'alphanumeric',
        Cell: ({ value }) => formatNumber(value),
      },
    ],
    [],
  )

  const renderExpandedRow = (row: Row<Subsidy>) => {
    return (
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Nafn</T.HeadData>
            <T.HeadData>Tegund</T.HeadData>
            <T.HeadData>Kennitala</T.HeadData>
            <T.HeadData>Eining</T.HeadData>
            <T.HeadData>Einingaverð</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {row.original.subsidyDetails.map((detail) => (
            <T.Row key={detail.id}>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.name}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.type}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.nationalId}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.units}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.unitPrice}</Text>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    )
  }

  return (
    <Box width="full" rowGap={3} marginTop={6}>
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
        emptyMessage="Engir styrkir fundust"
        errorMessage="Villa kom upp við að sækja styrki"
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default Subsidies
