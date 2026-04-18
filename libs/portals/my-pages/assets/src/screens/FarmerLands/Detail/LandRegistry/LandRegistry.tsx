import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Table,
  createColumnHelper,
  m,
  formatNationalId,
  EmptyTable,
  type Row,
} from '@island.is/portals/my-pages/core'
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

const columnHelper = createColumnHelper<FarmerLandRegistryEntry>()

export const LandRegistry = ({ landRegistry, loading, error }: Props) => {
  const { formatMessage, locale } = useLocale()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: formatMessage(fm.landRegistryEntry),
      }),
      columnHelper.accessor('nationalId', {
        header: formatMessage(m.natreg),
        cell: ({ getValue }) => formatNationalId(getValue() ?? ''),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
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
      <Table
        columns={columns}
        data={landRegistry}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        mobileTitleKey="name"
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default LandRegistry
