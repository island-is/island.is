import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, FilterInput, GridColumn, GridRow, Text } from '@island.is/island-ui/core'
import {
  CardLoader,
  LinkButton,
  Table,
  createColumnHelper,
  formatDate,
  m,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../../../lib/messages'
import { ShipRegistrySailorMaritimeBook } from '@island.is/api/schema'
import { useShipRegistrySailorSeaServiceBooksQuery } from './SeaServiceBooks.generated'

const columnHelper = createColumnHelper<ShipRegistrySailorMaritimeBook>()

export const SeaServiceBooks = () => {
  const { formatMessage } = useLocale()
  const [search, setSearch] = useState('')

  const { data, loading, error } = useShipRegistrySailorSeaServiceBooksQuery()

  const filtered = useMemo(
    () =>
      (data?.shipRegistrySailor?.certificates?.seaServiceBooks ?? []).filter(
        (b) =>
          !search || (b.id ?? '').toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
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
    [formatMessage],
  )

  return (
    <Box>
      <Text>{formatMessage(om.sailorSeaServiceBooksIntro)}</Text>
      <Box marginTop={3}>
        <LinkButton
          to={formatMessage(om.sailorSeaServiceBooksLinkUrl)}
          text={formatMessage(om.sailorSeaServiceBooksLinkText)}
          icon="open"
          variant="utility"
        />
      </Box>
      {loading && (
        <Box marginTop={6}>
          <CardLoader />
        </Box>
      )}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && (
        <>
          <Box marginTop={6}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <FilterInput
                  name="maritimeSearch"
                  placeholder={formatMessage(m.inputSearchTerm)}
                  value={search}
                  onChange={(val) => setSearch(val)}
                  backgroundColor="blue"
                />
              </GridColumn>
            </GridRow>
          </Box>
          <Box marginTop={3}>
            {filtered.length === 0 ? (
              <Problem type="no_data" noBorder={false} />
            ) : (
              <Table
                columns={columns}
                data={filtered}
                emptyMessage={om.sailorSeaServiceBooksEmpty}
                mobileTitleKey="id"
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
