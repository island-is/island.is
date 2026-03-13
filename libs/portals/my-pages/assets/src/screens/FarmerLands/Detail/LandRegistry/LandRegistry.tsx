import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'
import {
  FarmerLandRegistryEntry,
  FarmerLandRegistryEntryProperty,
} from '@island.is/api/schema'
import { farmerLandsMessages as fm } from '../../../../lib/messages'

interface Props {
  landRegistry: FarmerLandRegistryEntry[]
  loading: boolean
  error: boolean
}

export const LandRegistry = ({ landRegistry, loading, error }: Props) => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()

  const columns = useMemo<Column<FarmerLandRegistryEntry>[]>(
    () => [
      {
        Header: formatMessage(fm.landRegistryEntry),
        accessor: 'name',
        sortType: 'basic',
      },
    ],
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<FarmerLandRegistryEntry>) => (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(fm.ownershipType)}</T.HeadData>
          <T.HeadData>{formatMessage(fm.usage)}</T.HeadData>
          <T.HeadData>{formatMessage(fm.share)}</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {(row.original.properties ?? []).map(
          (p: FarmerLandRegistryEntryProperty, i: number) => (
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
          ),
        )}
      </T.Body>
    </T.Table>
  )

  return (
    <FarmerLandsTable
      columns={columns}
      data={landRegistry}
      loading={loading}
      error={error}
      emptyMessage={formatMessage(m.noData)}
      errorMessage={formatMessage(m.errorFetch)}
      renderExpandedRow={renderExpandedRow}
    />
  )
}

export default LandRegistry
