import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'

interface LandUseDetail {
  id: string
  landUse: string
  share: string
}

interface LandRegistryEntry {
  id: string
  registry: string
  nationalId: string
  type: string
  landUseDetails: LandUseDetail[]
}

// Mock data - TODO: Replace with GraphQL query when API is ready
const mockLandRegistry: LandRegistryEntry[] = [
  {
    id: '1',
    registry: 'Keldudalur ehf',
    nationalId: '570196-2359',
    type: 'Eigandi',
    landUseDetails: [
      {
        id: '1-1',
        landUse: 'Ræktað land',
        share: '45%',
      },
      {
        id: '1-2',
        landUse: 'Beitarland',
        share: '30%',
      },
      {
        id: '1-3',
        landUse: 'Skógrækt',
        share: '25%',
      },
    ],
  },
  {
    id: '2',
    registry: 'Jón Jónsson',
    nationalId: '040393-2359',
    type: 'Leigutaki',
    landUseDetails: [
      {
        id: '2-1',
        landUse: 'Ræktað land',
        share: '60%',
      },
      {
        id: '2-2',
        landUse: 'Beitarland',
        share: '35%',
      },
      {
        id: '2-3',
        landUse: 'Annað',
        share: '5%',
      },
    ],
  },
]

export const LandRegistry = () => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()

  // TODO: Replace with actual query when API is ready
  // const { data, loading, error } = useLandRegistryQuery()
  const loading = false
  const error = null

  const tableData = useMemo(() => mockLandRegistry, [])

  const columns = useMemo<Column<LandRegistryEntry>[]>(
    () => [
      {
        Header: 'Jarðaskrá',
        accessor: 'registry',
        sortType: 'basic',
      },
      {
        Header: 'Kennitala',
        accessor: 'nationalId',
        sortType: 'basic',
      },
      {
        Header: 'Tegund',
        accessor: 'type',
        sortType: 'basic',
      },
    ],
    [],
  )

  const renderExpandedRow = (row: Row<LandRegistryEntry>) => {
    return (
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData>Notkun matshluta</T.HeadData>
            <T.HeadData>Hlutfall</T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {row.original.landUseDetails.map((detail) => (
            <T.Row key={detail.id}>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.landUse}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{detail.share}</Text>
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
        emptyMessage="Engar færslur í jarðaskrá fundust"
        errorMessage="Villa kom upp við að sækja jarðaskrá"
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default LandRegistry
