import { useMemo, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { Box, FilterInput, Text } from '@island.is/island-ui/core'
import {
  LinkButton,
  NestedTable,
  Table,
  createColumnHelper,
  formatDate,
  m,
  type Row,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../lib/messages'
import {
  DUMMY_EXEMPTIONS,
  type RegistrationExemptionEntry,
} from './SailorCrewRegistrations.dummy'

// TODO: Replace DUMMY_EXEMPTIONS with real API data once domain module exposes
// registrationExemptions { shipRegistrationNo, shipName, rank, advertised,
//   exemptionLowerStatus, dateFrom, dateTo, numberOfDays }

const columnHelper = createColumnHelper<RegistrationExemptionEntry>()

export const SailorCrewRegistrationsExemptions = () => {
  const { formatMessage, locale } = useLocale()
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      DUMMY_EXEMPTIONS.filter(
        (e) =>
          !search ||
          e.shipName.toLowerCase().includes(search.toLowerCase()) ||
          e.rank.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
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

  const renderExpanded = (row: Row<RegistrationExemptionEntry>) => (
    <NestedTable
      data={[
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandShipNo),
          value: row.original.shipRegistrationNo,
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandAdvertised),
          value: row.original.advertised,
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandLowerRank),
          value: row.original.exemptionLowerStatus,
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandDays),
          value: row.original.numberOfDays,
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
    </Box>
  )
}
