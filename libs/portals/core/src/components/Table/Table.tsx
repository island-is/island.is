import { Fragment, useEffect, useId, useMemo, useState } from 'react'
import { ApolloError } from '@apollo/client'
import {
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import AnimateHeight from 'react-animate-height'
import {
  Box,
  Button,
  FocusableBox,
  Icon,
  Table as T,
  Text,
} from '@island.is/island-ui/core'
import { helperStyles } from '@island.is/island-ui/theme'
import { useLocale } from '@island.is/localization'
import { MessageDescriptor } from 'react-intl'
import { m } from '../../lib/messages'
import { Problem } from '@island.is/react-spa/shared'
import { EmptyTable } from '../EmptyTable/EmptyTable'
import { useIsMobile } from '../../hooks/useIsMobile/useIsMobile'
import * as styles from './Table.css'
import cn from 'classnames'
import { theme } from '@island.is/island-ui/theme'

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
  /** Screen-reader-only caption describing the table. Auto-included when the table has sortable columns. */
  srCaption?: string
}

export const Table = <TData extends object>({
  columns: providedColumns,
  data,
  loading,
  error,
  emptyMessage,
  renderExpandedRow,
  getRowId,
  mobileTitleKey,
  manualSorting,
  sorting: controlledSorting,
  onSortingChange,
  defaultSorting,
  srCaption,
}: TableProps<TData>) => {
  const { formatMessage } = useLocale()
  const { isMobile } = useIsMobile()
  const [internalSorting, setInternalSorting] = useState<SortingState>(
    defaultSorting ?? [],
  )
  const sorting = controlledSorting ?? internalSorting
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [collapsingRows, setCollapsingRows] = useState<Set<string>>(new Set())

  // Clear stale collapsing rows when data changes (e.g. on pagination reload).
  // Also clear expanded state when renderExpandedRow is used without a stable
  // getRowId, since TanStack uses index-based row IDs by default and those
  // become stale/mismatched after a data update.
  useEffect(() => {
    setCollapsingRows(new Set())
    if (renderExpandedRow && !getRowId) {
      setExpanded({})
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const columns = useMemo<ColumnDef<TData>[]>(() => {
    if (!renderExpandedRow) return providedColumns
    const expanderCol: ColumnDef<TData> = {
      id: 'expander',
      header: () => null,
      // cell returns null — the expand/collapse button is rendered directly
      // in the body loop when i === 0 and renderExpandedRow is set
      cell: () => null,
      enableSorting: false,
    }
    return [expanderCol, ...providedColumns]
  }, [providedColumns, renderExpandedRow])

  const tableId = useId()

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      sorting,
      expanded,
    },
    onSortingChange: onSortingChange ?? setInternalSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(getRowId ? { getRowId } : {}),
    ...(manualSorting ? { manualSorting: true } : {}),
  })

  if (error) {
    return <Problem error={error} noBorder={false} />
  }

  if (loading) {
    return <EmptyTable loading />
  }

  if (isMobile) {
    if (!data.length) {
      return <EmptyTable message={emptyMessage} />
    }
    return (
      <Box>
        {table.getRowModel().rows.map((row) => {
          const titleCell = row
            .getVisibleCells()
            .find((c) => c.column.id === mobileTitleKey)
          const dataCells = row
            .getVisibleCells()
            .filter(
              (c) =>
                c.column.id !== mobileTitleKey && c.column.id !== 'expander',
            )
          const isExpanded = row.getIsExpanded()
          const isCollapsing = collapsingRows.has(row.id)

          return (
            <Box
              key={row.id}
              background={isExpanded || isCollapsing ? 'blue100' : undefined}
              className={cn(styles.mobileRow, {
                [styles.container]: isExpanded || isCollapsing,
              })}
              position="relative"
              paddingTop={3}
              paddingBottom={3}
            >
              <Box
                marginBottom={1}
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Text
                  variant="h4"
                  as="h2"
                  color="blue400"
                  id={
                    mobileTitleKey
                      ? `${tableId}-row-title-${row.id}`
                      : undefined
                  }
                >
                  {titleCell
                    ? flexRender(
                        titleCell.column.columnDef.cell,
                        titleCell.getContext(),
                      )
                    : null}
                </Text>
                {renderExpandedRow && (
                  <Box marginLeft={1}>
                    <Button
                      circle
                      colorScheme="light"
                      icon={isExpanded ? 'remove' : 'add'}
                      iconType="filled"
                      size="small"
                      type="button"
                      variant="primary"
                      aria-labelledby={
                        mobileTitleKey
                          ? `${tableId}-row-title-${row.id}`
                          : undefined
                      }
                      aria-expanded={isExpanded}
                      aria-controls={`${tableId}-row-expanded-${row.id}`}
                      onClick={() => {
                        if (isExpanded) {
                          setCollapsingRows((prev) => new Set(prev).add(row.id))
                        }
                        row.toggleExpanded()
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box marginBottom={2}>
                {dataCells.map((cell) => {
                  const headerGroup = table.getHeaderGroups()[0]
                  const header = headerGroup?.headers.find(
                    (h) => h.column.id === cell.column.id,
                  )
                  return (
                    <Box
                      key={cell.id}
                      display="flex"
                      flexDirection="row"
                      marginBottom={1}
                    >
                      <Box width="half" display="flex" alignItems="center">
                        <Text fontWeight="semiBold" variant="default">
                          {header
                            ? flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )
                            : null}
                        </Text>
                      </Box>
                      <Box width="half">
                        <Text variant="default">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Text>
                      </Box>
                    </Box>
                  )
                })}
              </Box>
              {renderExpandedRow && (
                <AnimateHeight
                  id={`${tableId}-row-expanded-${row.id}`}
                  duration={300}
                  height={isExpanded ? 'auto' : 0}
                  onHeightAnimationEnd={(newHeight) => {
                    if (newHeight === 0) {
                      setCollapsingRows((prev) => {
                        const next = new Set(prev)
                        next.delete(row.id)
                        return next
                      })
                    }
                  }}
                >
                  {(isExpanded || isCollapsing) && renderExpandedRow(row)}
                </AnimateHeight>
              )}
            </Box>
          )
        })}
      </Box>
    )
  }

  const hasSortableColumns = table
    .getAllColumns()
    .some((col) => col.getCanSort())

  return (
    <T.Table>
      {hasSortableColumns && (
        <caption>
          <span className={helperStyles.srOnly}>
            {srCaption ?? formatMessage(m.tableCaption)}{' '}
            {formatMessage(m.tableSortHint)}
          </span>
        </caption>
      )}
      <T.Head>
        {table.getHeaderGroups().map((headerGroup) => (
          <T.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <T.HeadData
                key={header.id}
                scope="col"
                aria-label={
                  header.column.id === 'expander'
                    ? formatMessage(m.tableExpandColumn)
                    : undefined
                }
                aria-sort={
                  header.column.getCanSort()
                    ? header.column.getIsSorted() === 'asc'
                      ? 'ascending'
                      : header.column.getIsSorted() === 'desc'
                      ? 'descending'
                      : 'none'
                    : undefined
                }
                style={{ fontSize: '16px' }}
              >
                {header.column.getCanSort() ? (
                  <FocusableBox
                    component="button"
                    type="button"
                    display="flex"
                    alignItems="center"
                    color="blue"
                    className={styles.sortButton}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <Box
                      marginLeft={1}
                      aria-hidden="true"
                      style={{
                        visibility: header.column.getIsSorted()
                          ? 'visible'
                          : 'hidden',
                      }}
                    >
                      <Icon
                        color="blue400"
                        icon={
                          header.column.getIsSorted() === 'desc'
                            ? 'caretDown'
                            : 'caretUp'
                        }
                        size="small"
                      />
                    </Box>
                  </FocusableBox>
                ) : (
                  <Box display="flex" flexDirection="row" alignItems="center">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </Box>
                )}
              </T.HeadData>
            ))}
          </T.Row>
        ))}
      </T.Head>
      <T.Body>
        {!data.length && (
          <tr>
            <td colSpan={columns.length}>
              <EmptyTable message={emptyMessage} />
            </td>
          </tr>
        )}
        {table.getRowModel().rows.map((row) => {
          const isExpanded = row.getIsExpanded()
          const isCollapsing = collapsingRows.has(row.id)

          const rowBackground =
            isExpanded || isCollapsing ? 'blue100' : undefined

          return (
            <Fragment key={row.id}>
              <T.Row>
                {row.getVisibleCells().map((cell, i) =>
                  i === 0 && renderExpandedRow ? (
                    <T.Data
                      key={cell.id}
                      style={{ padding: theme.spacing[2] + 'px' }}
                      box={{
                        position: 'relative',
                        background: rowBackground,
                        borderBottomWidth:
                          isExpanded || isCollapsing ? undefined : 'standard',
                      }}
                    >
                      {(isExpanded || isCollapsing) && (
                        <div className={styles.line} />
                      )}
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Button
                          circle
                          colorScheme="light"
                          icon={isExpanded ? 'remove' : 'add'}
                          iconType="filled"
                          size="small"
                          type="button"
                          variant="primary"
                          aria-labelledby={
                            mobileTitleKey
                              ? `${tableId}-row-title-${row.id}`
                              : undefined
                          }
                          aria-expanded={isExpanded}
                          aria-controls={`${tableId}-row-expanded-${row.id}`}
                          onClick={() => {
                            if (isExpanded) {
                              setCollapsingRows((prev) =>
                                new Set(prev).add(row.id),
                              )
                            }
                            row.toggleExpanded()
                          }}
                        />
                      </Box>
                    </T.Data>
                  ) : (
                    <T.Data
                      key={cell.id}
                      style={{
                        padding: theme.spacing[2] + 'px',
                        background: rowBackground,
                      }}
                      box={{
                        background: rowBackground,
                        borderBottomWidth:
                          isExpanded || isCollapsing ? undefined : 'standard',
                      }}
                    >
                      <Text
                        variant="medium"
                        id={
                          mobileTitleKey && cell.column.id === mobileTitleKey
                            ? `${tableId}-row-title-${row.id}`
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Text>
                    </T.Data>
                  ),
                )}
              </T.Row>
              {renderExpandedRow && (
                // T.Row doesn't forward aria-hidden, so we use a native <tr>.
                // Safe: content is not rendered when collapsed, so no focusable children exist when hidden.
                <tr aria-hidden={!isExpanded && !isCollapsing}>
                  <T.Data
                    colSpan={columns.length}
                    style={{
                      padding: 0,
                      ...(!isExpanded && !isCollapsing
                        ? { borderBottom: 'none' }
                        : {}),
                    }}
                    box={{
                      position: 'relative',
                      background:
                        isExpanded || isCollapsing ? 'blue100' : undefined,
                      borderBottomWidth:
                        isExpanded || isCollapsing ? 'standard' : undefined,
                    }}
                  >
                    <AnimateHeight
                      id={`${tableId}-row-expanded-${row.id}`}
                      duration={300}
                      height={isExpanded ? 'auto' : 0}
                      onHeightAnimationEnd={(newHeight) => {
                        if (newHeight === 0) {
                          setCollapsingRows((prev) => {
                            const next = new Set(prev)
                            next.delete(row.id)
                            return next
                          })
                        }
                      }}
                    >
                      {(isExpanded || isCollapsing) && (
                        <>
                          <div className={styles.line} />
                          <Box marginLeft={3} marginBottom={3}>
                            {renderExpandedRow(row)}
                          </Box>
                        </>
                      )}
                    </AnimateHeight>
                  </T.Data>
                </tr>
              )}
            </Fragment>
          )
        })}
      </T.Body>
    </T.Table>
  )
}

//reexport for package types for simpler imports
export default Table
export type {
  ColumnDef,
  Row,
  SortingState,
  OnChangeFn,
} from '@tanstack/react-table'
export { createColumnHelper } from '@tanstack/react-table'
