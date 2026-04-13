import { useMemo } from 'react'
import { ApolloError } from '@apollo/client'
import { Column, Row } from 'react-table'
import { Box, Table as T, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  m,
  formatNationalId,
  EmptyTable,
} from '@island.is/portals/my-pages/core'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'
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

export const RightsHolders = ({ beneficiaries, loading, error }: Props) => {
  const { formatMessage } = useLocale()

  const columns = useMemo<Column<FarmerLandBeneficiary>[]>(
    () => [
      {
        Header: formatMessage(fm.rightsHolder),
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: formatMessage(m.natreg),
        accessor: 'nationalId',
        sortType: 'basic',
        Cell: ({ value }: { value: string | null | undefined }) =>
          formatNationalId(value ?? ''),
      },
      {
        Header: formatMessage(fm.bankInfo),
        accessor: 'bankInfo',
        sortType: 'basic',
      },
      {
        Header: formatMessage(fm.isatNumber),
        accessor: 'isat',
        sortType: 'basic',
      },
      {
        Header: formatMessage(fm.vatNumber),
        accessor: 'vatNumber',
        sortType: 'basic',
      },
    ],
    [formatMessage],
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
      <FarmerLandsTable
        columns={columns}
        data={beneficiaries}
        loading={loading}
        error={error}
        emptyMessage={formatMessage(m.noData)}
        renderExpandedRow={renderExpandedRow}
      />
    </Box>
  )
}

export default RightsHolders
