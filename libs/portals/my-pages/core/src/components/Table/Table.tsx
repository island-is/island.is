import { Fragment, useEffect, useMemo, useState } from 'react'
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
import { Box, Button, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { MessageDescriptor } from 'react-intl'
import { Problem } from '@island.is/react-spa/shared'
import { EmptyTable } from '../EmptyTable/EmptyTable'
import { useIsMobile } from '../../hooks/useIsMobile/useIsMobile'
import * as styles from './Table.css'

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
}: TableProps<TData>) => {
  const { isMobile } = useIsMobile()
  const [internalSorting, setInternalSorting] = useState<SortingState>(
    defaultSorting ?? [],
  )
  const sorting = controlledSorting ?? internalSorting
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [collapsingRows, setCollapsingRows] = useState<Set<string>>(new Set())

  // Clear stale collapsing rows when data changes (e.g. on pagination reload)
  useEffect(() => {
    setCollapsingRows(new Set())
  }, [data])

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

  if (!data.length) {
    return <EmptyTable message={emptyMessage} />
  }

  if (isMobile && mobileTitleKey) {
    return (
      <Box>
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
              background={isExpanded || isCollapsing ? 'blue100' : undefined}
              paddingTop={3}
              marginTop={rowIndex > 0 ? 3 : 0}
              position="relative"
            >
              <Box
                marginBottom={1}
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Text variant="h4" as="h2" color="blue400">
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

  return (
    <T.Table>
      <T.Head>
        {table.getHeaderGroups().map((headerGroup) => (
          <T.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <T.HeadData
                key={header.id}
                style={{
                  cursor: header.column.getCanSort() ? 'pointer' : 'default',
                }}
                onClick={header.column.getToggleSortingHandler()}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {header.column.getIsSorted() && (
                    <Box marginLeft={1}>
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
                  )}
                </Box>
              </T.HeadData>
            ))}
          </T.Row>
        ))}
      </T.Head>
      <T.Body>
        {table.getRowModel().rows.map((row) => {
          const isExpanded = row.getIsExpanded()
          const isCollapsing = collapsingRows.has(row.id)

          return (
            <Fragment key={row.id}>
              <T.Row>
                {row.getVisibleCells().map((cell, i) =>
                  i === 0 && renderExpandedRow ? (
                    <T.Data key={cell.id} box={{ position: 'relative' }}>
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
                    <T.Data key={cell.id}>
                      <Text variant="small">
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
                <T.Row>
                  <T.Data
                    colSpan={columns.length}
                    style={{ padding: 0 }}
                    box={{ position: 'relative' }}
                  >
                    <AnimateHeight
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
                          {renderExpandedRow(row)}
                        </>
                      )}
                    </AnimateHeight>
                  </T.Data>
                </T.Row>
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
