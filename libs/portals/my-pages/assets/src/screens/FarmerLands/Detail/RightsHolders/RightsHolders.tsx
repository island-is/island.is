import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { Box } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  PortalTable,
  createColumnHelper,
  m,
  formatNationalId,
  EmptyTable,
  type Row,
} from '@island.is/portals/my-pages/core'
import {
  FarmerLandBeneficiary,
  FarmerLandBeneficiaryPayment,
} from '@island.is/api/schema'
import { farmerLandsMessages as fm } from '../../../../lib/messages'

interface Props {
  beneficiaries: FarmerLandBeneficiary[]
  loading: boolean
  error?: ApolloError
}

const formatDateRange = (from?: string | null, to?: string | null): string => {
  const start = from ? new Date(from).toLocaleDateString('is-IS') : ''
  const end = to ? new Date(to).toLocaleDateString('is-IS') : ''
  if (!start) return ''
  if (!end) return start
  return `${start} - ${end}`
}

const columnHelper = createColumnHelper<FarmerLandBeneficiary>()
const paymentColumnHelper = createColumnHelper<FarmerLandBeneficiaryPayment>()

export const RightsHolders = ({ beneficiaries, loading, error }: Props) => {
  const { formatMessage } = useLocale()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: formatMessage(fm.rightsHolder),
      }),
      columnHelper.accessor('nationalId', {
        header: formatMessage(m.natreg),
        cell: ({ getValue }) => formatNationalId(getValue() ?? ''),
      }),
      columnHelper.accessor('bankInfo', {
        header: formatMessage(fm.bankInfo),
      }),
      columnHelper.accessor('isat', {
        header: formatMessage(fm.isatNumber),
      }),
      columnHelper.accessor('vatNumber', {
        header: formatMessage(fm.vatNumber),
      }),
    ],
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<FarmerLandBeneficiary>) => {
    const payments = row.original.payments ?? []
    if (!payments.length)
      return <EmptyTable message={formatMessage(m.noData)} />
    const paymentColumns = [
      paymentColumnHelper.accessor('category', {
        header: formatMessage(fm.paymentType),
        enableSorting: false,
      }),
      paymentColumnHelper.accessor('share', {
        header: formatMessage(fm.share),
        cell: ({ getValue }) => (getValue() != null ? `${getValue()}%` : ''),
        enableSorting: false,
      }),
      paymentColumnHelper.accessor('blocked', {
        header: formatMessage(fm.pendingPayments),
        cell: ({ getValue }) => formatMessage(getValue() ? m.yes : m.no),
        enableSorting: false,
      }),
      paymentColumnHelper.accessor('operating', {
        header: formatMessage(fm.operation),
        cell: ({ getValue }) =>
          formatMessage(getValue() ? fm.inOperation : fm.finished),
        enableSorting: false,
      }),
      paymentColumnHelper.display({
        id: 'date',
        header: formatMessage(m.date),
        cell: ({ row }) =>
          formatDateRange(row.original.dateFrom, row.original.dateTo),
        enableSorting: false,
      }),
    ]
    return (
      <PortalTable
        columns={paymentColumns}
        data={payments}
        emptyMessage={m.noData}
        mobileTitleKey="category"
        cellBox={{ body: { background: 'white' } }}
      />
    )
  }

  return (
    <Box marginTop={4}>
      <PortalTable
        columns={columns}
        data={beneficiaries}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        mobileTitleKey="name"
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default RightsHolders
