import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  Table,
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

export const RightsHolders = ({ beneficiaries, loading, error }: Props) => {
  const { formatMessage, locale } = useLocale()

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  )

  const renderExpandedRow = (row: Row<FarmerLandBeneficiary>) => {
    const payments = row.original.payments ?? []
    if (!payments.length)
      return <EmptyTable message={formatMessage(m.noData)} />
    return (
      <T.Table>
        <T.Head>
          <T.Row>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(fm.paymentType)}
            </T.HeadData>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(fm.share)}
            </T.HeadData>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(fm.pendingPayments)}
            </T.HeadData>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(fm.operation)}
            </T.HeadData>
            <T.HeadData text={{ variant: 'small', fontWeight: 'semiBold' }}>
              {formatMessage(m.date)}
            </T.HeadData>
          </T.Row>
        </T.Head>
        <T.Body>
          {payments.map((p: FarmerLandBeneficiaryPayment, i) => (
            <T.Row key={`${p.categoryId}-${i}`}>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">{p.category}</Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">
                  {p.share != null ? `${p.share}%` : ''}
                </Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">
                  {p.blocked ? formatMessage(m.yes) : formatMessage(m.no)}
                </Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">
                  {p.operating
                    ? formatMessage(fm.inOperation)
                    : formatMessage(fm.finished)}
                </Text>
              </T.Data>
              <T.Data box={{ background: 'white' }}>
                <Text variant="small">
                  {formatDateRange(p.dateFrom, p.dateTo)}
                </Text>
              </T.Data>
            </T.Row>
          ))}
        </T.Body>
      </T.Table>
    )
  }

  return (
    <Box marginTop={4}>
      <Table
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
