import { useMemo, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Box, FilterInput, Stack, Text } from '@island.is/island-ui/core'
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
import { Markdown } from '@island.is/shared/components'
import { olMessage as om } from '../../../lib/messages'
import { useShipRegistrySailorSchoolCertificatesQuery } from './CompetencyCertificates.generated'
import { ShipRegistrySailorSchoolCertificate } from '@island.is/api/schema'

//TODO: add file export
const columnHelper = createColumnHelper<ShipRegistrySailorSchoolCertificate>()

const CompetencyCertificates = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage, locale } = useLocale()

  const { data, loading, error } =
    useShipRegistrySailorSchoolCertificatesQuery()

  const [search, setSearch] = useState('')
  const filtered = useMemo(
    () =>
      (data?.shipRegistrySailor?.certificates?.schoolCertificates ?? []).filter(
        (c) =>
          !search ||
          (c.title ?? '').toLowerCase().includes(search.toLowerCase()),
      ),
    [data, search],
  )

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        header: formatMessage(om.sailorSchoolCertificatesColumnTitle),
        cell: ({ getValue }) => getValue() ?? '-',
      }),
      columnHelper.accessor('validToDate', {
        header: formatMessage(om.sailorSchoolCertificatesColumnValidDate),
        cell: ({ getValue }) => {
          const value = getValue()
          return value ? formatDate(new Date(value)) : '-'
        },
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  const renderExpandedRow = (row: Row<ShipRegistrySailorSchoolCertificate>) => (
    <NestedTable
      data={[
        {
          title: formatMessage(om.sailorSchoolCertificatesExpandSchool),
          value: row.original.school ?? '-',
        },
        {
          title: formatMessage(om.sailorSchoolCertificatesExpandIssueDate),
          value: row.original.issueDate
            ? formatDate(new Date(row.original.issueDate))
            : '-',
        },
      ]}
    />
  )

  return (
    <IntroWrapper
      title={m.sailorsSchoolCertificatesTitle}
      introComponent={
        <Text variant="default">
          <Markdown>{formatMessage(om.sailorSchoolCertificatesIntro)}</Markdown>
        </Text>
      }
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && filtered.length === 0 && !search && (
        <Problem type="no_data" noBorder={false} />
      )}
      {!loading && !error && (filtered.length > 0 || search) && (
        <Stack space={2}>
          <Box width="half">
            <FilterInput
              name="schoolCertificateSearch"
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
              emptyMessage={om.sailorSchoolCertificatesEmpty}
              mobileTitleKey="title"
              renderExpandedRow={renderExpandedRow}
            />
          )}
        </Stack>
      )}
    </IntroWrapper>
  )
}

export default CompetencyCertificates
