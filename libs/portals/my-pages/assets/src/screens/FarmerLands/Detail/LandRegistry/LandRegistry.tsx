import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PortalTable,
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
const propertyColumnHelper =
  createColumnHelper<FarmerLandRegistryEntryProperty>()

export const LandRegistry = ({ landRegistry, loading, error }: Props) => {
  const { formatMessage } = useLocale()

  const columns = useMemo(
    () => [
      columnHelper.accessor('ownerName', {
        header: formatMessage(fm.landRegistryEntry),
      }),
      columnHelper.accessor('ownerNationalId', {
        header: formatMessage(m.natreg),
        cell: ({ getValue }) => formatNationalId(getValue() ?? ''),
      }),
    ],
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<FarmerLandRegistryEntry>) => {
    const properties = row.original.properties ?? []
    if (!properties.length)
      return <EmptyTable message={formatMessage(m.noData)} />
    const propertyColumns = [
      propertyColumnHelper.accessor('ownershipType', {
        header: formatMessage(fm.ownershipType),
        enableSorting: false,
      }),
      propertyColumnHelper.accessor('usage', {
        header: formatMessage(fm.usage),
        enableSorting: false,
      }),
      propertyColumnHelper.accessor('share', {
        header: formatMessage(fm.share),
        cell: ({ getValue }) => (getValue() != null ? `${getValue()}%` : ''),
        enableSorting: false,
      }),
    ]
    return (
      <PortalTable
        columns={propertyColumns}
        data={properties}
        emptyMessage={m.noData}
        mobileTitleKey="ownershipType"
        cellBox={{ body: { background: 'white' } }}
      />
    )
  }

  return (
    <Box marginTop={4}>
      <PortalTable
        columns={columns}
        data={landRegistry}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        mobileTitleKey="ownerName"
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default LandRegistry
