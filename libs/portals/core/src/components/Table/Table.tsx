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

/**
 * Portal-specific wrapper around `InteractiveTable` from `@island.is/island-ui/core`.
 *
 * Adds on top of `InteractiveTable`:
 * - `error: ApolloError` → renders `<Problem>` (instead of a plain error string)
 * - `loading` → renders `<EmptyTable loading />` skeleton
 * - `emptyMessage` accepts `MessageDescriptor` in addition to `string`
 * - Icelandic defaults for `srCaption` and `sortHint` via portal messages
 *
 * Prefer using `InteractiveTable` directly when you don't need these portal conveniences.
 */
type PortalWithExpander<TData extends object> = {
  renderExpandedRow: (row: Row<TData>) => React.ReactNode
  /** Accessible label for the expand/collapse button. Defaults to the Icelandic "Skoða nánar". */
  expanderLabel?: string
  mobileTitleKey: string
}

type PortalWithoutExpander = {
  renderExpandedRow?: never
  expanderLabel?: never
  mobileTitleKey?: string
}

type PortalTableProps<TData extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  data: TData[]
  loading?: boolean
  error?: ApolloError
  emptyMessage: string | MessageDescriptor
  getRowId?: (originalRow: TData, index: number) => string
  manualSorting?: boolean
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  defaultSorting?: SortingState
  srCaption?: string
  meta?: TableMeta<TData>
} & (PortalWithExpander<TData> | PortalWithoutExpander)

export const PortalTable = <TData extends object>({
  columns,
  data,
  loading,
  error,
  emptyMessage,
  renderExpandedRow,
  expanderLabel,
  getRowId,
  mobileTitleKey,
  manualSorting,
  sorting,
  onSortingChange,
  defaultSorting,
  srCaption,
  meta,
}: PortalTableProps<TData>) => {
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

  const commonProps = {
    columns,
    data,
    emptyMessage: resolvedEmpty,
    getRowId,
    manualSorting,
    sorting,
    onSortingChange,
    defaultSorting,
    srCaption: srCaption ?? formatMessage(m.tableCaption),
    sortHint: formatMessage(m.tableSortHint),
    meta,
  }

  if (renderExpandedRow && mobileTitleKey) {
    return (
      <InteractiveTable
        {...commonProps}
        mobileTitleKey={mobileTitleKey}
        renderExpandedRow={renderExpandedRow}
        expanderLabel={expanderLabel ?? formatMessage(m.tableExpandColumn)}
      />
    )
  }

  return <InteractiveTable {...commonProps} mobileTitleKey={mobileTitleKey} />
}

export default PortalTable
export type {
  ColumnDef,
  Row,
  SortingState,
  OnChangeFn,
} from '@tanstack/react-table'
export { createColumnHelper } from '@tanstack/react-table'
