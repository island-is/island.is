import '@tanstack/react-table'
import { Fragment, useEffect, useId, useMemo, useState } from 'react'
import {
  createColumnHelper as _createColumnHelper,
  ColumnDef,
  ExpandedState,
  OnChangeFn,
  Row,
  RowData,
  SortingState,
  TableMeta,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import AnimateHeight from 'react-animate-height'
import cn from 'classnames'
import { helperStyles } from '@island.is/island-ui/theme'
import { theme } from '@island.is/island-ui/theme'

import { Box } from '../Box/Box'
import { Button } from '../Button/Button'
import { FocusableBox } from '../FocusableBox/FocusableBox'
import { Hidden } from '../Hidden/Hidden'
import { Icon } from '../IconRC/Icon'
import { LoadingDots } from '../LoadingDots/LoadingDots'
import { ProblemTemplate } from '../ProblemTemplate/ProblemTemplate'
import { Table as T } from '../Table'
import { Text } from '../Text/Text'
import * as styles from './InteractiveTable.css'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'right'
    /** Skip the `<Text>` wrapper — use for interactive cells (input, button) */
    type?: 'text' | 'interactive'
    span?: 1 | 2
  }
}

type WithExpander<TData extends object> = {
  renderExpandedRow: (row: Row<TData>) => React.ReactNode
  expanderLabel: string
  mobileTitleKey: string
}

type WithoutExpander = {
  renderExpandedRow?: never
  expanderLabel?: never
  mobileTitleKey?: string
}

type BaseInteractiveTableProps<TData extends object> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  data: TData[]
  loading?: boolean
  errorMessage?: string
  errorTitle?: string
  emptyMessage?: string
  getRowId?: (originalRow: TData, index: number) => string
  manualSorting?: boolean
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  defaultSorting?: SortingState
  srCaption?: string
  sortHint?: string
  meta?: TableMeta<TData>
  colorScheme?: 'default' | 'negative'
}

export type InteractiveTableProps<TData extends object> =
  BaseInteractiveTableProps<TData> & (WithExpander<TData> | WithoutExpander)

export const InteractiveTable = <TData extends object>({
  columns: providedColumns,
  data,
  loading,
  errorMessage,
  errorTitle,
  emptyMessage,
  renderExpandedRow,
  expanderLabel,
  getRowId,
  mobileTitleKey,
  manualSorting,
  sorting: controlledSorting,
  onSortingChange,
  defaultSorting,
  srCaption = 'Table with sortable columns.',
  sortHint = 'Activate to sort.',
  meta,
  colorScheme = 'default',
}: InteractiveTableProps<TData>) => {
  const resolvedExpanderLabel = expanderLabel ?? ''
  const [internalSorting, setInternalSorting] = useState<SortingState>(
    defaultSorting ?? [],
  )
  const sorting = controlledSorting ?? internalSorting
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [collapsingRows, setCollapsingRows] = useState<Set<string>>(new Set())

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
      cell: () => null,
      enableSorting: false,
    }
    return [expanderCol, ...providedColumns]
  }, [providedColumns, renderExpandedRow])

  const tableId = useId()

  const table = useReactTable<TData>({
    data,
    columns,
    state: { sorting, expanded },
    onSortingChange: onSortingChange ?? setInternalSorting,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    ...(getRowId ? { getRowId } : {}),
    ...(manualSorting ? { manualSorting: true } : {}),
    ...(meta ? { meta } : {}),
  })

  if (errorMessage) {
    return (
      <ProblemTemplate
        variant="error"
        title={errorTitle ?? 'Error'}
        message={errorMessage}
        noBorder
      />
    )
  }

  const hasSortableColumns = table
    .getAllColumns()
    .some((col) => col.getCanSort())

  const desktopTable = (
    <T.Table>
      {srCaption && (
        <caption>
          <span className={helperStyles.srOnly}>
            {srCaption}
            {hasSortableColumns && ` ${sortHint}`}
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
                    ? resolvedExpanderLabel
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
                style={{
                  fontSize: '16px',
                  ...(header.column.columnDef.meta?.align && {
                    textAlign: header.column.columnDef.meta.align,
                  }),
                }}
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
        {loading ? (
          <tr>
            <td colSpan={columns.length}>
              <Box padding={4} display="flex" justifyContent="center">
                <LoadingDots />
              </Box>
            </td>
          </tr>
        ) : (
          <>
            {!data.length && emptyMessage && (
              <tr>
                <td colSpan={columns.length}>
                  <Box padding={4} display="flex" justifyContent="center">
                    <Text color="dark400">{emptyMessage}</Text>
                  </Box>
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
                              isExpanded || isCollapsing
                                ? undefined
                                : 'standard',
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
                              aria-label={
                                mobileTitleKey
                                  ? undefined
                                  : resolvedExpanderLabel
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
                              isExpanded || isCollapsing
                                ? undefined
                                : 'standard',
                          }}
                        >
                          {cell.column.columnDef.meta?.type ===
                          'interactive' ? (
                            mobileTitleKey &&
                            cell.column.id === mobileTitleKey ? (
                              <Box id={`${tableId}-row-title-${row.id}`}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </Box>
                            ) : (
                              flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )
                            )
                          ) : (
                            <Text
                              variant="medium"
                              id={
                                mobileTitleKey &&
                                cell.column.id === mobileTitleKey
                                  ? `${tableId}-row-title-${row.id}`
                                  : undefined
                              }
                              textAlign={cell.column.columnDef.meta?.align}
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </Text>
                          )}
                        </T.Data>
                      ),
                    )}
                  </T.Row>
                  {renderExpandedRow && (
                    <tr aria-hidden={!isExpanded && !isCollapsing}>
                      <T.Data
                        colSpan={columns.length}
                        style={{ padding: 0 }}
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
          </>
        )}
      </T.Body>
    </T.Table>
  )

  const mobileView = (
    <Box>
      {loading ? (
        <Box padding={4} display="flex" justifyContent="center">
          <LoadingDots />
        </Box>
      ) : (
        <>
          {!data.length && emptyMessage && (
            <Box padding={4} display="flex" justifyContent="center">
              <Text color="dark400">{emptyMessage}</Text>
            </Box>
          )}
          {table.getRowModel().rows.map((row, rowIndex) => {
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
                background={
                  isExpanded || isCollapsing
                    ? colorScheme === 'negative'
                      ? 'white'
                      : 'blue100'
                    : colorScheme === 'negative'
                    ? 'blue100'
                    : undefined
                }
                className={cn(styles.mobileRow, {
                  [styles.container]: isExpanded || isCollapsing,
                })}
                position="relative"
                paddingTop={rowIndex > 0 ? 5 : 3}
                paddingBottom={3}
              >
                <Box
                  marginBottom={1}
                  display="flex"
                  flexDirection="row"
                  justifyContent="spaceBetween"
                >
                  {titleCell?.column.columnDef.meta?.type === 'interactive' ? (
                    <Box
                      id={
                        mobileTitleKey
                          ? `${tableId}-row-title-${row.id}`
                          : undefined
                      }
                    >
                      {flexRender(
                        titleCell.column.columnDef.cell,
                        titleCell.getContext(),
                      )}
                    </Box>
                  ) : (
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
                  )}
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
                        aria-label={
                          mobileTitleKey ? undefined : resolvedExpanderLabel
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
                  )}
                </Box>
                <Box>
                  {dataCells.map((cell) => {
                    const headerGroup = table.getHeaderGroups()[0]
                    const header = headerGroup?.headers.find(
                      (h) => h.column.id === cell.column.id,
                    )
                    const cellMeta = cell.column.columnDef.meta
                    if (cellMeta?.span === 2) {
                      return (
                        <Box key={cell.id} marginBottom={1}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </Box>
                      )
                    }
                    return (
                      <Box
                        key={cell.id}
                        display="flex"
                        flexDirection="row"
                        marginBottom={1}
                      >
                        <Box width="half" display="flex" alignItems="center">
                          <Text fontWeight="semiBold">
                            {header
                              ? flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )
                              : null}
                          </Text>
                        </Box>
                        <Box width="half">
                          {cellMeta?.type === 'interactive' ? (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )
                          ) : (
                            <Text textAlign="right">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )}
                            </Text>
                          )}
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
        </>
      )}
    </Box>
  )

  return (
    <>
      <Hidden above="sm">{mobileView}</Hidden>
      <Hidden below="md">{desktopTable}</Hidden>
    </>
  )
}

export default InteractiveTable

// Re-exported as local declarations so exportFinder (which only supports
// relative re-exports) can resolve them through the barrel index.
export type { ColumnDef, Row, SortingState, OnChangeFn }
export const createColumnHelper = _createColumnHelper
