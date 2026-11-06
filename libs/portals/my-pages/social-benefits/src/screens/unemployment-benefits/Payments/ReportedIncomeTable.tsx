import { Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { ApolloError } from '@apollo/client'
import {
  PortalTable,
  createColumnHelper,
  ellipsis,
} from '@island.is/portals/my-pages/core'
import { useMemo } from 'react'
import { unemploymentBenefitsMessages as um } from '../../../lib/messages/unemployment'

export interface ReportedIncomeRow {
  id: string
  type: string
  payer: string
  date: string
  dateTo: string
  amount: string
}

interface Props {
  rows?: ReportedIncomeRow[]
  loading?: boolean
  error?: ApolloError
}

const PAYER_MAX_LENGTH = 30

const columnHelper = createColumnHelper<ReportedIncomeRow>()

export const ReportedIncomeTable = ({ rows, loading, error }: Props) => {
  const { formatMessage } = useLocale()

  const columns = useMemo(
    () => [
      columnHelper.accessor('type', {
        id: 'type',
        header: formatMessage(um.reportedIncomeTypeHeader),
        cell: ({ getValue }) => (
          <Text variant="medium" as="span">
            {getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('payer', {
        id: 'payer',
        header: formatMessage(um.reportedIncomePayerHeader),
        cell: ({ getValue }) => (
          <Text variant="medium" as="span" title={getValue()}>
            {ellipsis(getValue(), PAYER_MAX_LENGTH)}
          </Text>
        ),
      }),
      columnHelper.accessor('date', {
        id: 'date',
        header: formatMessage(um.reportedIncomeDateHeader),
        cell: ({ getValue }) => (
          <Text variant="medium" as="span">
            {getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('dateTo', {
        id: 'dateTo',
        header: formatMessage(um.reportedIncomeDateToHeader),
        cell: ({ getValue }) => (
          <Text variant="medium" as="span">
            {getValue()}
          </Text>
        ),
      }),
      columnHelper.accessor('amount', {
        id: 'amount',
        header: formatMessage(um.reportedIncomeAmountHeader),
        cell: ({ getValue }) => (
          <Text variant="medium" as="span">
            {getValue()}
          </Text>
        ),
      }),
    ],
    [formatMessage],
  )

  return (
    <PortalTable
      columns={columns}
      data={rows ?? []}
      loading={loading}
      error={error}
      emptyMessage={um.reportedIncomeEmpty}
      getRowId={(row) => row.id}
      mobileTitleKey="type"
    />
  )
}
