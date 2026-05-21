import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, Select, Stack } from '@island.is/island-ui/core'
import {
  CardLoader,
  Table,
  createColumnHelper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../lib/messages'
import { ShipRegistrySailorSeaServiceEntry } from '@island.is/api/schema'
import {
  useShipRegistrySailorSeaServiceQuery,
  useShipRegistryRanksQuery,
} from './SailorCrewRegistrations.generated'

const columnHelper = createColumnHelper<ShipRegistrySailorSeaServiceEntry>()

export const SailorCrewRegistrationsSeaService = () => {
  const { formatMessage, locale } = useLocale()
  const [rankId, setRankId] = useState<number | undefined>(undefined)

  const { data: ranksData } = useShipRegistryRanksQuery()
  const rankOptions = useMemo(
    () =>
      (ranksData?.shipRegistryRanks ?? []).map((r) => ({
        label: locale === 'en' ? r.nameEn ?? r.name : r.name,
        value: r.id,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ranksData, locale],
  )

  const { data, loading, error } = useShipRegistrySailorSeaServiceQuery({
    variables: {
      filters: rankId != null ? { rankId } : undefined,
    },
  })

  const entries = useMemo(
    () => data?.shipRegistrySailorSeaService ?? [],
    [data],
  )

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
      <Box width="half">
        <Select
          name="rankFilter"
          label={formatMessage(om.sailorColumnRank)}
          placeholder={formatMessage(om.sailorSeaServiceRankAll)}
          options={rankOptions}
          onChange={(opt) => setRankId(opt ? Number(opt.value) : undefined)}
          isClearable
          size="sm"
          backgroundColor="blue"
        />
      </Box>
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
