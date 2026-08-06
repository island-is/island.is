import { useMemo, useState } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  Box,
  FilterInput,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  CardLoader,
  IntroWrapper,
  NestedTable,
  PortalTable,
  createColumnHelper,
  formatDate,
  m,
  SAMGONGUSTOFA_SLUG,
  useIsMobile,
  type Row,
} from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import { Markdown } from '@island.is/shared/components'
import { olMessage as om } from '../../../lib/messages'
import { useShipRegistrySailorSchoolCertificatesQuery } from './CompetencyCertificates.generated'
import { ShipRegistrySailorSchoolCertificate } from '@island.is/api/schema'

const columnHelper = createColumnHelper<ShipRegistrySailorSchoolCertificate>()

const CompetencyCertificates = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
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
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<ShipRegistrySailorSchoolCertificate>) => {
    const nestedData = [
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
    ]
    if (isMobile) {
      return (
        <Box>
          {nestedData.map(({ title, value }) => (
            <Box
              key={title}
              display="flex"
              flexDirection="row"
              marginBottom={1}
            >
              <Box width="half" display="flex" alignItems="center">
                <Text fontWeight="semiBold">{title}</Text>
              </Box>
              <Box width="half">
                <Text textAlign="right">{value}</Text>
              </Box>
            </Box>
          ))}
        </Box>
      )
    }
    return <NestedTable data={nestedData} />
  }

  return (
    <IntroWrapper
      title={m.sailorsSchoolCertificatesTitle}
      introComponent={
        <Markdown>{formatMessage(om.sailorSchoolCertificatesIntro)}</Markdown>
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
        <Box marginTop={5}>
          <Stack space={3}>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '6/12']}>
                <FilterInput
                  name="schoolCertificateSearch"
                  placeholder={formatMessage(m.inputSearchTerm)}
                  value={search}
                  onChange={(val) => setSearch(val)}
                  backgroundColor="blue"
                />
              </GridColumn>
            </GridRow>
            {filtered.length === 0 ? (
              <Problem type="no_data" noBorder={false} />
            ) : (
              <PortalTable
                columns={columns}
                data={filtered}
                emptyMessage={om.sailorSchoolCertificatesEmpty}
                mobileTitleKey="title"
                renderExpandedRow={renderExpandedRow}
              />
            )}
          </Stack>
        </Box>
      )}
    </IntroWrapper>
  )
}

export default CompetencyCertificates
