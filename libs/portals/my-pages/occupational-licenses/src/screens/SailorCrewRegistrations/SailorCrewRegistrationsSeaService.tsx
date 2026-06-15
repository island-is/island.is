import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { Box, Pagination, Stack } from '@island.is/island-ui/core'
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
import { ShipRegistrySailorCrewRegistrationsQuery } from './SailorCrewRegistrations.generated'

const columnHelper = createColumnHelper<ShipRegistrySailorSeaServiceBookEntry>()

interface Props {
  data: ShipRegistrySailorCrewRegistrationsQuery | undefined
  loading: boolean
  error: ApolloError | undefined
  page: number
  setPage: (page: number) => void
  pageSize: number
}

export const SailorCrewRegistrationsSeaService = ({
  data,
  loading,
  error,
  page,
  setPage,
  pageSize,
}: Props) => {
  const { formatMessage, locale } = useLocale()

  const seaServiceBook = data?.shipRegistrySailor?.seaServiceBook
  const entries = seaServiceBook?.data ?? []
  const totalCount = seaServiceBook?.totalCount ?? 0
  const totalPages = Math.ceil(totalCount / pageSize)

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
        <>
          <Table
            columns={columns}
            data={entries}
            emptyMessage={om.sailorSeaServiceEmpty}
            mobileTitleKey="shipName"
          />
          {totalPages > 1 && (
            <Box marginTop={3}>
              <Pagination
                page={page}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <button className={className} onClick={() => setPage(page)}>
                    {children}
                  </button>
                )}
              />
            </Box>
          )}
        </>
      )}
    </Stack>
  )
}
