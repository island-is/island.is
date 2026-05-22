import { useMemo, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, FilterInput, Stack } from '@island.is/island-ui/core'
import {
  CardLoader,
  IntroWrapper,
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
import { useShipRegistrySailorRightCertificatesQuery } from './SailorRightCertificates.generated'
import { ShipRegistrySailorRightCertificate } from '@island.is/api/schema'

const columnHelper = createColumnHelper<ShipRegistrySailorRightCertificate>()

//TODO: add file export

const SailorRightCertificates = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage, locale } = useLocale()

  const { data, loading, error } = useShipRegistrySailorRightCertificatesQuery()
  const rightCertificates =
    data?.shipRegistrySailor?.certificates?.rightCertificates ?? []

  const [search, setSearch] = useState('')
  const filtered = useMemo(
    () =>
      rightCertificates.filter(
        (c) =>
          !search ||
          (c.type ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (c.rightsCategories ?? '')
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rightCertificates, search],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('type', {
        header: formatMessage(om.sailorRightCertificatesColumnType),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('rightsCategories', {
        header: formatMessage(om.sailorRightCertificatesColumnRightsCategories),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('validToDate', {
        header: formatMessage(om.sailorRightCertificatesColumnValidDate),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(new Date(value)) : '-'
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  const renderExpandedRow = (row: Row<ShipRegistrySailorRightCertificate>) => (
    <NestedTable
      data={[
        {
          title: formatMessage(om.licenseNumber),
          value: row.original.certificateNumber ?? '-',
        },
        {
          title: formatMessage(om.sailorRightCertificatesExpandIssueDate),
          value: row.original.issueDate
            ? formatDate(new Date(row.original.issueDate))
            : '-',
        },
      ]}
    />
  )

  return (
    <IntroWrapper
      title={m.sailorsRightCertificatesTitle}
      intro={om.sailorRightCertificatesIntro}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && rightCertificates.length === 0 && (
        <Problem type="no_data" noBorder={false} />
      )}
      {!loading && !error && rightCertificates.length > 0 && (
        <Stack space={2}>
          <Box width="half">
            <FilterInput
              name="rightCertificateSearch"
              placeholder={formatMessage(m.inputSearchTerm)}
              value={search}
              onChange={(val) => setSearch(val)}
              backgroundColor="blue"
            />
          </Box>
          {filtered.length === 0 ? (
            <Problem type="no_data" noBorder={false} />
          ) : (
            <Table
              columns={columns}
              data={filtered}
              emptyMessage={om.sailorRightCertificatesEmpty}
              mobileTitleKey="type"
              renderExpandedRow={renderExpandedRow}
            />
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default SailorRightCertificates
