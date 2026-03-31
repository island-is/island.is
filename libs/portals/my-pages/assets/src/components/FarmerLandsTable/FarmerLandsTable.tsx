import { Fragment, useEffect, useMemo, useState } from 'react'
import { ApolloError } from '@apollo/client'
import { Column, Row, useExpanded, useSortBy, useTable } from 'react-table'
import AnimateHeight from 'react-animate-height'
import { Box, Button, Icon, Table as T, Text } from '@island.is/island-ui/core'
import { EmptyTable } from '@island.is/portals/my-pages/core'
import { Problem } from '@island.is/react-spa/shared'
import * as styles from './FarmerLandsTable.css'

interface FarmerLandsTableProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: ApolloError
  emptyMessage: string
  renderExpandedRow?: (row: Row<T>) => React.ReactNode
  getRowId?: (row: T, relativeIndex: number) => string
  manualSort?: boolean
  onSortChange?: (sortBy: Array<{ id: string; desc: boolean }>) => void
}

export const FarmerLandsTable = <T extends object>({
  columns: providedColumns,
  data,
  loading = false,
  error,
  emptyMessage,
  renderExpandedRow,
  getRowId,
  manualSort,
  onSortChange,
}: FarmerLandsTableProps<T>) => {
  const [collapsingRows, setCollapsingRows] = useState<Set<string>>(new Set())

  const columns = useMemo<Column<T>[]>(() => {
    if (!renderExpandedRow) {
      return providedColumns
    }

    const expanderColumn: Column<T> = {
      id: 'expander',
      Header: () => null,
      Cell: ({ row }: { row: Row<T> }) => (
        <Box
          display="flex"
          alignItems="center"
          cursor="pointer"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(e: React.MouseEvent) => {
            if ((row as any).isExpanded) {
              setCollapsingRows((prev) => new Set(prev).add(row.id))
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(row as any).getToggleRowExpandedProps().onClick(e)
          }}
        >
          <Button
            circle
            colorScheme="light"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            icon={(row as any).isExpanded ? 'remove' : 'add'}
            iconType="filled"
            size="small"
            type="button"
            variant="primary"
          />
        </Box>
      ),
    }

    return [expanderColumn, ...providedColumns]
  }, [providedColumns, renderExpandedRow])

  const tableInstance = useTable(
    {
      columns,
      data,
      ...(getRowId ? { getRowId } : {}),
      ...(manualSort ? { manualSortBy: true } : {}),
    },
    useSortBy,
    ...(renderExpandedRow ? [useExpanded] : []),
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  useEffect(() => {
    if (!onSortChange) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sortBy = (tableInstance.state as any).sortBy as Array<{
      id: string
      desc: boolean
    }>
    onSortChange(sortBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [(tableInstance.state as any).sortBy, onSortChange])

  if (error) {
    return <Problem error={error} noBorder={false} />
  }

  return (
    <T.Table {...getTableProps()}>
      <T.Head>
        {headerGroups.map((headerGroup) => (
          <T.Row {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <T.HeadData
                {...column.getHeaderProps(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (column as any).getSortByToggleProps?.(),
                )}
                text={{ variant: 'medium', fontWeight: 'semiBold' }}
                style={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  cursor: (column as any).canSort ? 'pointer' : 'default',
                }}
              >
                <Box display="flex" flexDirection="row" alignItems="center">
                  {column.render('Header')}
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(column as any).isSorted && (
                    <Box marginLeft={1}>
                      <Icon
                        color="blue400"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        icon={
                          (column as any).isSortedDesc ? 'caretDown' : 'caretUp'
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
      <T.Body {...getTableBodyProps()}>
        {loading ? (
          <T.Row>
            <T.Data colSpan={columns.length} style={{ padding: 0 }}>
              <EmptyTable loading />
            </T.Data>
          </T.Row>
        ) : !data.length ? (
          <T.Row>
            <T.Data colSpan={columns.length} style={{ padding: 0 }}>
              <EmptyTable message={emptyMessage} />
            </T.Data>
          </T.Row>
        ) : null}
        {!loading &&
          rows.map((row) => {
            prepareRow(row)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const isExpanded = (row as any).isExpanded
            const isCollapsing = collapsingRows.has(row.id)

            return (
              <Fragment key={row.id}>
                <T.Row {...row.getRowProps()}>
                  {row.cells.map((cell, i) => (
                    <T.Data
                      {...cell.getCellProps()}
                      box={{
                        background:
                          isExpanded || isCollapsing
                            ? 'blue100'
                            : 'transparent',
                        borderBottomWidth:
                          isExpanded || isCollapsing ? undefined : 'standard',
                        ...(i === 0 ? { position: 'relative' } : {}),
                      }}
                    >
                      {i === 0 && (isExpanded || isCollapsing) && (
                        <div className={styles.line} />
                      )}
                      {cell.column.id === 'expander' ? (
                        cell.render('Cell')
                      ) : (
                        <Text variant="small">{cell.render('Cell')}</Text>
                      )}
                    </T.Data>
                  ))}
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
                            <Box background="blue100" padding={3}>
                              {renderExpandedRow(row)}
                            </Box>
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

export default FarmerLandsTable
