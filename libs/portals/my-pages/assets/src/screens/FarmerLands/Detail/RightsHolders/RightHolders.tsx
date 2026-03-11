import { useMemo } from 'react'
import { Column, Row } from 'react-table'
import { Table as T, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import { m } from '@island.is/portals/my-pages/core'
import FarmerLandsTable from '../../../../components/FarmerLandsTable/FarmerLandsTable'
import {
  FarmerLandBeneficiary,
  FarmerLandBeneficiaryPayment,
} from '@island.is/api/schema'
import { farmerLandsMessages as fm } from '../../../../lib/messages'

interface Props {
  beneficiaries: FarmerLandBeneficiary[]
  loading: boolean
  error: boolean
}

const formatDateRange = (from?: string | null, to?: string | null): string => {
  const start = from ? new Date(from).toLocaleDateString('is-IS') : ''
  const end = to ? new Date(to).toLocaleDateString('is-IS') : ''
  return start ? `${start} - ${end}` : ''
}

export const RightsHolders = ({ beneficiaries, loading, error }: Props) => {
  useNamespaces('sp.farmer-lands')
  const { formatMessage } = useLocale()

  const columns = useMemo<Column<FarmerLandBeneficiary>[]>(
    () => [
      {
        Header: formatMessage(fm.rightsHolder),
        accessor: 'name',
        sortType: 'basic',
      },
      {
        Header: formatMessage(fm.nationalId),
        accessor: 'nationalId',
        sortType: 'basic',
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
        accessor: 'vskNumberDisplayString',
        sortType: 'basic',
      },
    ],
    [formatMessage],
  )

  const renderExpandedRow = (row: Row<FarmerLandBeneficiary>) => (
    <T.Table>
      <T.Head>
        <T.Row>
          <T.HeadData>{formatMessage(fm.paymentType)}</T.HeadData>
          <T.HeadData>{formatMessage(fm.share)}</T.HeadData>
          <T.HeadData>{formatMessage(fm.pendingPayments)}</T.HeadData>
          <T.HeadData>{formatMessage(fm.operation)}</T.HeadData>
          <T.HeadData>{formatMessage(m.date)}</T.HeadData>
        </T.Row>
      </T.Head>
      <T.Body>
        {(row.original.payments ?? []).map((p: FarmerLandBeneficiaryPayment) => (
          <T.Row key={p.categoryId}>
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

  return (
    <FarmerLandsTable
      columns={columns}
      data={beneficiaries}
      loading={loading}
      error={error}
      emptyMessage={formatMessage(m.noData)}
      errorMessage={formatMessage(m.errorFetch)}
      renderExpandedRow={renderExpandedRow}
    />
  )
}

export default RightsHolders
