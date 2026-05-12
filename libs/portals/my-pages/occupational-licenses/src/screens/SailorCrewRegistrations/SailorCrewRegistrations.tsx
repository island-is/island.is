import { useMemo, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, Input, Stack, Tabs, Text } from '@island.is/island-ui/core'
import {
  CardLoader,
  EmptyState,
  IntroWrapper,
  LinkButton,
  NestedTable,
  Table,
  createColumnHelper,
  formatDate,
  m,
  SAMGONGUSTOFA_SLUG,
  type Row,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { olMessage as om } from '../../lib/messages'
import {
  DUMMY_EXEMPTIONS,
  DUMMY_MARITIME_BOOKS,
  type MaritimeBookEntry,
  type RegistrationExemptionEntry,
} from './SailorCrewRegistrations.dummy'

// TODO: Replace dummy data with useShipRegistrySailorCertificatesQuery() once the
// domain module exposes these fields on ShipRegistrySailorCertificates:
//
// GraphQL wishlist:
//   registrationExemptions {
//     shipRegistrationNo   # Skipaskrárnúmer
//     shipName             # Skip
//     rank                 # Staða (Icelandic locale value)
//     advertised           # Staðan auglýst
//     exemptionLowerStatus # Heimild til að gegna lægri stöðu
//     dateFrom             # Gildir frá
//     dateTo               # Gildir til
//     numberOfDays         # Fjöldi daga
//   }
//   maritimeBooks {
//     maritimeBookSerial   # Númer
//     maritimeBookType     # Tegund (optional)
//     dateFrom             # Gildir frá
//     dateTo               # Gildir til
//   }

const exemptionColumnHelper = createColumnHelper<RegistrationExemptionEntry>()
const maritimeBookColumnHelper = createColumnHelper<MaritimeBookEntry>()

const SailorCrewRegistrations = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage, locale } = useLocale()

  // TODO: Replace stubs with generated hook when domain module exposes registrationExemptions/maritimeBooks
  const loading = false
  const error = undefined

  const [exemptionSearch, setExemptionSearch] = useState('')
  const [maritimeSearch, setMaritimeSearch] = useState('')

  const filteredExemptions = useMemo(
    () =>
      DUMMY_EXEMPTIONS.filter(
        (e) =>
          !exemptionSearch ||
          e.shipName.toLowerCase().includes(exemptionSearch.toLowerCase()) ||
          e.rank.toLowerCase().includes(exemptionSearch.toLowerCase()),
      ),
    [exemptionSearch],
  )

  const filteredMaritimeBooks = useMemo(
    () =>
      DUMMY_MARITIME_BOOKS.filter(
        (b) =>
          !maritimeSearch ||
          b.maritimeBookSerial
            .toLowerCase()
            .includes(maritimeSearch.toLowerCase()),
      ),
    [maritimeSearch],
  )

  const exemptionColumns = useMemo(
    () => [
      exemptionColumnHelper.accessor('shipName', {
        header: formatMessage(om.sailorColumnShip),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      exemptionColumnHelper.accessor('rank', {
        header: formatMessage(m.status),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      exemptionColumnHelper.accessor('dateFrom', {
        header: formatMessage(om.sailorColumnValidFrom),
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
      exemptionColumnHelper.accessor('dateTo', {
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

  const maritimeBookColumns = useMemo(
    () => [
      maritimeBookColumnHelper.accessor('maritimeBookSerial', {
        header: formatMessage(m.number),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      maritimeBookColumnHelper.accessor('dateFrom', {
        header: formatMessage(om.sailorColumnValidFrom),
        cell: ({ getValue }) => {
          const v = getValue()
          return v ? formatDate(new Date(v)) : '-'
        },
      }),
      maritimeBookColumnHelper.accessor('dateTo', {
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

  const renderExemptionExpanded = (row: Row<RegistrationExemptionEntry>) => (
    <NestedTable
      data={[
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandShipNo),
          value: row.original.shipRegistrationNo,
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandLowerRank),
          value: row.original.exemptionLowerStatus,
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandAdvertised),
          value: row.original.advertised,
        },
        {
          title: formatMessage(om.sailorCrewRegistrationsExpandDays),
          value: row.original.numberOfDays,
        },
      ]}
    />
  )

  return (
    <IntroWrapper
      title={m.sailorsCrewRegistrationsTitle}
      intro={formatMessage(om.sailorCrewRegistrationsIntro)}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      <Tabs
        label={`${formatMessage(om.sailorTabSiglingartimi)} / ${formatMessage(om.sailorTabUndanthaegur)} / ${formatMessage(om.sailorTabSjoferoadabaekur)}`}
        contentBackground="white"
        tabs={[
          {
            label: formatMessage(om.sailorTabSiglingartimi),
            content: (
              // TODO: Implement when API exposes sailing time (siglingartími) data
              <EmptyState description={om.sailorSiglingartimiPending} />
            ),
          },
          {
            label: formatMessage(om.sailorTabUndanthaegur),
            content: (
              <Stack space={3}>
                <Text>{formatMessage(om.sailorUndanthaegurIntro)}</Text>
                <Box>
                  <LinkButton
                    to="#"
                    text={formatMessage(om.sailorUndanthaegurLinkText)}
                    icon="open"
                    variant="utility"
                  />
                </Box>
                <Input
                  name="exemptionSearch"
                  placeholder={formatMessage(m.inputSearchTerm)}
                  value={exemptionSearch}
                  onChange={(e) => setExemptionSearch(e.target.value)}
                  icon={{ type: 'outline', name: 'search' }}
                  size="xs"
                  backgroundColor="blue"
                />
                {filteredExemptions.length === 0 ? (
                  <EmptyState
                    title={om.sailorCrewRegistrationsUndanthaegurEmpty}
                    description={m.noData}
                  />
                ) : (
                  <Table
                    columns={exemptionColumns}
                    data={filteredExemptions}
                    emptyMessage={om.sailorCrewRegistrationsUndanthaegurEmpty}
                    mobileTitleKey="shipName"
                    renderExpandedRow={renderExemptionExpanded}
                  />
                )}
              </Stack>
            ),
          },
          {
            label: formatMessage(om.sailorTabSjoferoadabaekur),
            content: (
              <Stack space={3}>
                <Text>{formatMessage(om.sailorMaritimeBooksIntro)}</Text>
                <Box>
                  <LinkButton
                    to="#"
                    text={formatMessage(om.sailorMaritimeBooksLinkText)}
                    icon="open"
                    variant="utility"
                  />
                </Box>
                <Input
                  name="maritimeSearch"
                  placeholder={formatMessage(m.inputSearchTerm)}
                  value={maritimeSearch}
                  onChange={(e) => setMaritimeSearch(e.target.value)}
                  icon={{ type: 'outline', name: 'search' }}
                  size="xs"
                  backgroundColor="blue"
                />
                {filteredMaritimeBooks.length === 0 ? (
                  <EmptyState
                    title={om.sailorMaritimeBooksEmpty}
                    description={m.noData}
                  />
                ) : (
                  <Table
                    columns={maritimeBookColumns}
                    data={filteredMaritimeBooks}
                    emptyMessage={om.sailorMaritimeBooksEmpty}
                    mobileTitleKey="maritimeBookSerial"
                  />
                )}
              </Stack>
            ),
          },
        ]}
      />
    </IntroWrapper>
  )
}

export default SailorCrewRegistrations
