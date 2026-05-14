import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Input, Stack, Text } from '@island.is/island-ui/core'
import {
  // TODO: uncomment when URL is known
  // LinkButton,
  Table,
  createColumnHelper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../lib/messages'
import {
  DUMMY_MARITIME_BOOKS,
  type MaritimeBookEntry,
} from './SailorCrewRegistrations.dummy'

// TODO: Replace DUMMY_MARITIME_BOOKS with real API data once domain module exposes
// maritimeBooks { maritimeBookSerial, maritimeBookType, dateFrom, dateTo }

const columnHelper = createColumnHelper<MaritimeBookEntry>()

export const SailorCrewRegistrationsMaritimeBooks = () => {
  const { formatMessage, locale } = useLocale()
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      DUMMY_MARITIME_BOOKS.filter(
        (b) =>
          !search ||
          b.maritimeBookSerial.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('maritimeBookSerial', {
        header: formatMessage(m.number),
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
    <Stack space={3}>
      <Text>{formatMessage(om.sailorMaritimeBooksIntro)}</Text>
      {/* TODO: uncomment when URL is known
      <LinkButton
        to="#"
        text={formatMessage(om.sailorMaritimeBooksLinkText)}
        icon="open"
        variant="utility"
      /> */}
      <Input
        name="maritimeSearch"
        label={formatMessage(m.inputSearchTerm)}
        placeholder={formatMessage(m.inputSearchTerm)}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={{ type: 'outline', name: 'search' }}
        size="xs"
        backgroundColor="blue"
      />
      {filtered.length === 0 ? (
        <Problem type="no_data" noBorder={false} />
      ) : (
        <Table
          columns={columns}
          data={filtered}
          emptyMessage={om.sailorMaritimeBooksEmpty}
          mobileTitleKey="maritimeBookSerial"
        />
      )}
    </Stack>
  )
}
