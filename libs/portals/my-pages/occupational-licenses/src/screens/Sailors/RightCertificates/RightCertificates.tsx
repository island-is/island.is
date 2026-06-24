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
  Table,
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
import { useShipRegistrySailorRightCertificatesQuery } from './RightCertificates.generated'
import { ShipRegistrySailorRightCertificate } from '@island.is/api/schema'

const columnHelper = createColumnHelper<ShipRegistrySailorRightCertificate>()

const RightCertificates = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const { data, loading, error } = useShipRegistrySailorRightCertificatesQuery()

  const [search, setSearch] = useState('')
  const filtered = useMemo(
    () =>
      (data?.shipRegistrySailor?.certificates?.rightCertificates ?? []).filter(
        (c) =>
          !search ||
          (c.type ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (c.rightsCategories ?? '')
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [data, search],
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
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<ShipRegistrySailorRightCertificate>) => {
    const nestedData = [
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
                <Text>{value}</Text>
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
      title={m.sailorsRightCertificatesTitle}
      introComponent={
        <Text variant="default">
          <Markdown>{formatMessage(om.sailorRightCertificatesIntro)}</Markdown>
        </Text>
      }
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading &&
        !error &&
        !data?.shipRegistrySailor?.certificates?.rightCertificates?.length && (
          <Problem type="no_data" noBorder={false} />
        )}
      {!loading &&
        !error &&
        !!data?.shipRegistrySailor?.certificates?.rightCertificates?.length && (
          <Box marginTop={5}>
            <Stack space={3}>
              <GridRow>
                <GridColumn span={['12/12', '12/12', '6/12']}>
                  <FilterInput
                    name="rightCertificateSearch"
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
                <Table
                  columns={columns}
                  data={filtered}
                  emptyMessage={om.sailorRightCertificatesEmpty}
                  mobileTitleKey="type"
                  renderExpandedRow={renderExpandedRow}
                />
              )}
            </Stack>
          </Box>
        )}
    </IntroWrapper>
  )
}

export default RightCertificates
