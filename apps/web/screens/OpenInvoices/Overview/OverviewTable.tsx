import { useMemo } from 'react'
import { useIntl } from 'react-intl'
import { ApolloError } from '@apollo/client'

import { IcelandicGovernmentInstitutionsInvoiceGroup } from '@island.is/api/schema'
import { createColumnHelper, InteractiveTable } from '@island.is/island-ui/core'
import { formatCurrency } from '@island.is/shared/utils'

import { m } from '../messages'
import { NestedLines } from './NestedLines'

interface Props {
  dateTo?: Date
  dateFrom?: Date
  invoiceGroups: Array<IcelandicGovernmentInstitutionsInvoiceGroup>
  loading?: boolean
  error?: ApolloError
}

const columnHelper =
  createColumnHelper<IcelandicGovernmentInstitutionsInvoiceGroup>()

export const OverviewTable = ({
  dateTo,
  dateFrom,
  invoiceGroups,
  loading,
  error,
}: Props) => {
  const { formatMessage } = useIntl()
  const data = useMemo(() => invoiceGroups ?? [], [invoiceGroups])

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.supplier.name, {
        id: 'supplier',
        header: formatMessage(m.overview.supplier),
      }),
      columnHelper.accessor((row) => row.debtor.name, {
        id: 'customer',
        header: formatMessage(m.overview.customer),
      }),
      columnHelper.accessor('totalSum', {
        header: formatMessage(m.overview.amount),
        cell: (info) => formatCurrency(info.getValue()),
        meta: { align: 'right' },
      }),
    ],
    [formatMessage],
  )

  return (
    <InteractiveTable
      columns={columns}
      data={data}
      loading={loading}
      errorTitle={formatMessage(m.overview.errorTitle)}
      errorMessage={
        error ? formatMessage(m.overview.errorLoading) : undefined
      }
      emptyMessage={formatMessage(m.overview.noResults)}
      srCaption={formatMessage(m.overview.srCaption)}
      sortHint={formatMessage(m.overview.sortHint)}
      mobileTitleKey="supplier"
      expanderLabel={formatMessage(m.overview.expandRow)}
      renderExpandedRow={(row) => (
        <NestedLines
          supplierLegalId={row.original.supplier.id}
          erpLegalEntityId={row.original.debtor.erpLegalEntityId}
          total={row.original.totalSum}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      )}
    />
  )
}
