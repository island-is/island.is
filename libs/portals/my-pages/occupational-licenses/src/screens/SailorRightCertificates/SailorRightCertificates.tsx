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
// Both SailorSchoolCertificates and SailorRightCertificates use the SAME query
// to ensure shared Apollo cache between screens.
import { useShipRegistrySailorCertificatesQuery } from '../SailorSchoolCertificates/SailorSchoolCertificates.generated'
import {
  ShipRegistrySailorRightCertificate,
  ShipRegistrySailorCertificateStatus,
} from '@island.is/api/schema'

const columnHelper = createColumnHelper<ShipRegistrySailorRightCertificate>()

const SailorRightCertificates = () => {
  useNamespaces('sp.occupational-licenses')
  const { formatMessage, locale } = useLocale()

  const { data, loading, error } = useShipRegistrySailorCertificatesQuery()
  const rightCertificates =
    data?.shipRegistrySailorCertificates?.rightCertificates ?? []

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
      columnHelper.accessor('status', {
        id: 'status',
        header: formatMessage(om.sailorRightCertificatesColumnStatus),
        enableSorting: false,
        cell: ({ getValue }) => {
          const value = getValue()
          if (value === ShipRegistrySailorCertificateStatus.Unknown) return null
          const isValid = value === ShipRegistrySailorCertificateStatus.Valid
          return (
            <Tag outlined disabled variant={isValid ? 'mint' : 'red'}>
              {isValid
                ? formatMessage(om.validLicense)
                : formatMessage(om.invalidLicense)}
            </Tag>
          )
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
          title: formatMessage(
            om.sailorRightCertificatesExpandCertificateNumber,
          ),
          value: row.original.certificateNumber ?? '-',
        },
        {
          title: formatMessage(
            om.sailorRightCertificatesExpandRightsCategories,
          ),
          value: row.original.rightsCategories ?? '-',
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
      intro={formatMessage(om.sailorRightCertificatesIntro)}
      serviceProvider={{
        slug: SAMGONGUSTOFA_SLUG,
        tooltip: formatMessage(m.sailorsTooltip),
      }}
    >
      {loading && <CardLoader />}
      {error && <Problem error={error} noBorder={false} />}
      {!loading && !error && rightCertificates.length === 0 && (
        <EmptyState
          title={om.sailorRightCertificatesEmpty}
          description={m.noData}
        />
      )}
      {!loading && !error && rightCertificates.length > 0 && (
        <Table
          columns={columns}
          data={rightCertificates}
          emptyMessage={om.sailorRightCertificatesEmpty}
          loading={loading}
          mobileTitleKey="type"
          renderExpandedRow={renderExpandedRow}
        />
      )}
    </IntroWrapper>
  )
}

export default SailorRightCertificates
