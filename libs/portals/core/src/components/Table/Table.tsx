import { ApolloError } from '@apollo/client'
import {
  InteractiveTable,
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type SortingState,
} from '@island.is/island-ui/core'
import { TableMeta } from '@tanstack/react-table'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { EmptyTable } from '../EmptyTable/EmptyTable'

interface TableProps<TData extends object> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  data: TData[]
  loading?: boolean
  error?: ApolloError
  emptyMessage: string | MessageDescriptor
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode
  getRowId?: (originalRow: TData, index: number) => string
  mobileTitleKey?: string
  manualSorting?: boolean
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  defaultSorting?: SortingState
  srCaption?: string
  meta?: TableMeta<TData>
}

export const Table = <TData extends object>({
  columns,
  data,
  loading,
  error,
  emptyMessage,
  renderExpandedRow,
  getRowId,
  mobileTitleKey,
  manualSorting,
  sorting,
  onSortingChange,
  defaultSorting,
  srCaption,
  meta,
}: TableProps<TData>) => {
  const { formatMessage } = useLocale()

  if (error) {
    return <Problem error={error} noBorder={false} />
  }

  if (loading) {
    return <EmptyTable loading />
  }

  const resolvedEmpty =
    typeof emptyMessage === 'string'
      ? emptyMessage
      : formatMessage(emptyMessage)

  return (
    <InteractiveTable
      columns={columns}
      data={data}
      emptyMessage={resolvedEmpty}
      renderExpandedRow={renderExpandedRow}
      getRowId={getRowId}
      mobileTitleKey={mobileTitleKey}
      manualSorting={manualSorting}
      sorting={sorting}
      onSortingChange={onSortingChange}
      defaultSorting={defaultSorting}
      srCaption={srCaption ?? formatMessage(m.tableCaption)}
      sortHint={formatMessage(m.tableSortHint)}
      meta={meta}
    />
  )
}

export default Table
export type {
  ColumnDef,
  Row,
  SortingState,
  OnChangeFn,
} from '@tanstack/react-table'
export { createColumnHelper } from '@tanstack/react-table'
