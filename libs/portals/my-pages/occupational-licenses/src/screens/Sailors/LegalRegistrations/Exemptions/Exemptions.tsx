import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, FilterInput, Text } from '@island.is/island-ui/core'
import {
  CardLoader,
  LinkButton,
  NestedTable,
  Table,
  createColumnHelper,
  formatDate,
  m,
  type Row,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../../../lib/messages'
import { ShipRegistrySailorRegistrationExemption } from '@island.is/api/schema'
import { useShipRegistrySailorRegistrationExemptionsQuery } from './Exemptions.generated'

const columnHelper =
  createColumnHelper<ShipRegistrySailorRegistrationExemption>()

export const Exemptions = () => {
  const { formatMessage, locale } = useLocale()
  const [search, setSearch] = useState('')

  const { data, loading, error } =
    useShipRegistrySailorRegistrationExemptionsQuery()

  const filtered = useMemo(
    () =>
      (
        data?.shipRegistrySailor?.certificates?.registrationExemptions ?? []
      ).filter(
        (e) =>
          !search ||
          (e.shipName ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (e.rank ?? '').toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
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

  const renderExpanded = (
    row: Row<ShipRegistrySailorRegistrationExemption>,
  ) => (
    <NestedTable
      data={[
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandShipNo),
          value: row.original.shipRegistrationNo ?? '-',
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandAdvertised),
          value: row.original.advertised ?? '-',
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandLowerRank),
          value: row.original.exemptionLowerStatus ?? '-',
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandDays),
          value: String(row.original.numberOfDays ?? '-'),
        },
      ]}
    />
  )

  return (
    <Box>
      <Text>{formatMessage(om.sailorExemptionsIntro)}</Text>
      <Box marginTop={3}>
        <LinkButton
          to="#"
          text={formatMessage(om.sailorExemptionsLinkText)}
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
              name="exemptionSearch"
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
                emptyMessage={om.sailorCrewRegistrationsExemptionsEmpty}
                mobileTitleKey="shipName"
                renderExpandedRow={renderExpanded}
              />
            )}
          </Box>
        </>
      )}
    </Box>
  )
}
