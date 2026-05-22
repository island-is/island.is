import { useMemo } from 'react'
import { useLocale } from '@island.is/localization'
import { Stack } from '@island.is/island-ui/core'
import {
  CardLoader,
  Table,
  createColumnHelper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../lib/messages'
import { ShipRegistrySailorSeaServiceBookEntry } from '@island.is/api/schema'
import { useShipRegistrySailorCrewRegistrationsQuery } from './SailorCrewRegistrations.generated'

const columnHelper = createColumnHelper<ShipRegistrySailorSeaServiceBookEntry>()

export const SailorCrewRegistrationsSeaService = () => {
  const { formatMessage, locale } = useLocale()

  const { data, loading, error } = useShipRegistrySailorCrewRegistrationsQuery()

  const entries = data?.shipRegistrySailor?.seaServiceBook ?? []

  const columns = useMemo(
    () => [
      columnHelper.accessor('shipName', {
        header: formatMessage(om.sailorColumnShip),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('rank', {
        header: formatMessage(om.sailorColumnRank),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('startDate', {
        header: formatMessage(om.sailorColumnValidFrom),
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
      columnHelper.accessor('endDate', {
        header: formatMessage(m.validTo),
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
      columnHelper.accessor('numberOfDays', {
        header: formatMessage(om.sailorCrewRegistrationsExpandDays),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  return (
    <Stack space={4}>
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && entries.length === 0 && (
        <Problem type="no_data" noBorder={false} />
      )}
      {!loading && !error && entries.length > 0 && (
        <Table
          columns={columns}
          data={entries}
          emptyMessage={om.sailorSeaServiceEmpty}
          mobileTitleKey="shipName"
        />
      )}
    </Stack>
  )
}
