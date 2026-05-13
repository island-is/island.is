import { useMemo } from 'react'
import { useLocale, useNamespaces } from '@island.is/localization'
import { Tag } from '@island.is/island-ui/core'
import {
  CardLoader,
  EmptyState,
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
import { useShipRegistrySailorCertificatesQuery } from './SailorSchoolCertificates.generated'
import { ShipRegistrySailorSchoolCertificate } from '@island.is/api/schema'

//TODO: add filter input and file export
//
const columnHelper = createColumnHelper<ShipRegistrySailorSchoolCertificate>()

const SailorSchoolCertificates = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage, locale } = useLocale()

  const { data, loading, error } = useShipRegistrySailorCertificatesQuery()
  const schoolCertificates =
    data?.shipRegistrySailorCertificates?.schoolCertificates ?? []

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
      intro={formatMessage(om.sailorSchoolCertificatesIntro)}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && schoolCertificates.length === 0 && (
        <EmptyState
          title={om.sailorSchoolCertificatesEmpty}
          description={m.noData}
        />
      )}
      {!loading && !error && schoolCertificates.length > 0 && (
        <Table
          columns={columns}
          data={schoolCertificates}
          emptyMessage={om.sailorSchoolCertificatesEmpty}
          loading={loading}
          mobileTitleKey="title"
          renderExpandedRow={renderExpandedRow}
        />
      )}
    </IntroWrapper>
  )
}

export default SailorSchoolCertificates
