import { useMemo } from 'react'
import { Column, Row, useExpanded, useSortBy, useTable } from 'react-table'
import { Box, Button, Table as T, Text } from '@island.is/island-ui/core'
import { EmptyTable } from '@island.is/portals/my-pages/core'

interface FarmerLandsTableProps<T extends object> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  error?: boolean
  emptyMessage?: string
  errorMessage?: string
  renderExpandedRow?: (row: Row<T>) => React.ReactNode
}

export const FarmerLandsTable = <T extends object,>({
  columns: providedColumns,
  data,
  loading = false,
  error = false,
  emptyMessage = 'Engar færslur fundust',
  errorMessage = 'Villa kom upp við að sækja gögn',
  renderExpandedRow,
}: FarmerLandsTableProps<T>) => {
  // Add expander column if renderExpandedRow is provided
  const columns = useMemo<Column<T>[]>(() => {
    if (!renderExpandedRow) {
      return providedColumns
    }

    const expanderColumn: Column<T> = {
      id: 'expander',
      Header: () => null,
      Cell: ({ row }: { row: Row<T> }) => (
        <Box
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...(row as any).getToggleRowExpandedProps()}
          display="flex"
          alignItems="center"
          cursor="pointer"
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
    { columns, data },
    useSortBy,
    ...(renderExpandedRow ? [useExpanded] : []),
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance

  if (loading) {
    return <EmptyTable loading />
  }

  if (error) {
    return <EmptyTable message={errorMessage} />
  }

  if (!data.length) {
    return <EmptyTable message={emptyMessage} />
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
                style={{
                  cursor: column.id !== 'expander' ? 'pointer' : 'default',
                }}
              >
                {column.render('Header')}
              </T.HeadData>
            ))}
          </T.Row>
        ))}
      </T.Head>
      <T.Body {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row)
          return (
            <>
              <T.Row {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <T.Data
                    {...cell.getCellProps()}
                    box={{
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      background: (row as any).isExpanded
                        ? 'blue100'
                        : 'transparent',
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      borderBottomWidth: (row as any).isExpanded
                        ? undefined
                        : 'standard',
                    }}
                  >
                    <Text variant="small">{cell.render('Cell')}</Text>
                  </T.Data>
                ))}
              </T.Row>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {renderExpandedRow && (row as any).isExpanded && (
                <T.Row>
                  <T.Data
                    box={{ background: 'blue100' }}
                    colSpan={columns.length}
                  >
                    <Box padding={3}>{renderExpandedRow(row)}</Box>
                  </T.Data>
                </T.Row>
              )}
            </>
          )
        })}
      </T.Body>
    </T.Table>
  )
}

export default FarmerLandsTable
