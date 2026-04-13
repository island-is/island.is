import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { Column, Row } from 'react-table'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m,
  formatNationalId,
  EmptyTable,
} from '@island.is/portals/my-pages/core'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'
import {
  FarmerLandRegistryEntry,
  FarmerLandRegistryEntryProperty,
} from '@island.is/api/schema'
import { farmerLandsMessages as fm } from '../../../../lib/messages'

interface Props {
  landRegistry: FarmerLandRegistryEntry[]
  loading: boolean
  error?: ApolloError
}

export const LandRegistry = ({ landRegistry, loading, error }: Props) => {
  const { formatMessage } = useLocale()

  const columns = useMemo<Column<FarmerLandRegistryEntry>[]>(
    () => [
      {
        Header: formatMessage(fm.landRegistryEntry),
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: formatMessage(m.natreg),
        accessor: 'nationalId',
        sortType: 'basic',
        Cell: ({ value }: { value: string | null | undefined }) =>
          formatNationalId(value ?? ''),
      },
    ],
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<FarmerLandRegistryEntry>) => {
    const properties = row.original.properties ?? []
    if (!properties.length)
      return <EmptyTable message={formatMessage(m.noData)} />
    return (
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(fm.ownershipType)}
            </T.HeadData>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(fm.usage)}
            </T.HeadData>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(fm.share)}
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {properties.map((p: FarmerLandRegistryEntryProperty, i: number) => (
            <T.Row key={i}>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{p.ownershipType}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{p.usage}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">
                  {p.share != null ? `${p.share}%` : ''}
                </Text>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    )
  }

  return (
    <Box marginTop={4}>
      <FarmerLandsTable
        columns={columns}
        data={landRegistry}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default LandRegistry
