import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, FilterInput, Text } from '@island.is/island-ui/core'
import {
  CardLoader,
  LinkButton,
  Table,
  createColumnHelper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../lib/messages'
import { ShipRegistrySailorMaritimeBook } from '@island.is/api/schema'
import { useShipRegistrySailorCrewRegistrationsQuery } from './SailorCrewRegistrations.generated'

const columnHelper = createColumnHelper<ShipRegistrySailorMaritimeBook>()

export const SailorCrewRegistrationsMaritimeBooks = () => {
  const { formatMessage, locale } = useLocale()
  const [search, setSearch] = useState('')

  const { data, loading, error } = useShipRegistrySailorCrewRegistrationsQuery()
  const books = data?.shipRegistrySailor?.certificates?.maritimeBooks ?? []

  const filtered = useMemo(
    () =>
      books.filter(
        (b) =>
          !search || (b.id ?? '').toLowerCase().includes(search.toLowerCase()),
      ),
    [books, search],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        header: formatMessage(m.number),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('type', {
        header: formatMessage(om.sailorMaritimeBooksType),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('dateFrom', {
        header: formatMessage(om.sailorColumnValidFrom),
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
      columnHelper.accessor('dateTo', {
        header: formatMessage(m.validTo),
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  return (
    <Box>
      <Text>{formatMessage(om.sailorMaritimeBooksIntro)}</Text>
      <Box marginTop={3}>
        <LinkButton
          to="#"
          text={formatMessage(om.sailorMaritimeBooksLinkText)}
          icon="open"
          variant="utility"
          disabled
        />
      </Box>
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && (
        <>
          <Box marginTop={6} width="half">
            <FilterInput
              name="maritimeSearch"
              placeholder={formatMessage(m.inputSearchTerm)}
              value={search}
              onChange={(val) => setSearch(val)}
              backgroundColor="blue"
            />
          </Box>
          <Box marginTop={2}>
            {filtered.length === 0 ? (
              <Problem type="no_data" noBorder={false} />
            ) : (
              <Table
                columns={columns}
                data={filtered}
                emptyMessage={om.sailorMaritimeBooksEmpty}
                mobileTitleKey="id"
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
