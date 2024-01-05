import React, { FC, PropsWithChildren, ReactElement, useState } from 'react'
import { Row, useTable } from 'react-table'

import { Box, Text, Table as T } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

type column<T> = {
  Header: string
  accessor: keyof T
}

interface TableProps<T extends object> {
  data: Array<T>
  columns: column<T>[]
  truncate?: boolean
  showMoreLabel?: string
  showLessLabel?: string
}

export const Table = <T extends object>(
  props: PropsWithChildren<TableProps<T>>,
): ReactElement => {
  const {
    columns,
    data,
    truncate,
    showMoreLabel = 'See all',
    showLessLabel = 'See less',
  } = props
  const [isExpanded, setExpanded] = useState<boolean>(false)
  const tableInstance = useTable<T>({ columns, data })
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance
  const enoughRowsToTruncate = rows.length > 4
  const lastIndex = rows.length - 1
  const lastRow = rows[lastIndex]
  let firstRows: Row<T>[], restRows: Row<T>[]
  if (truncate && enoughRowsToTruncate) {
    firstRows = rows.slice(0, 3)
    restRows = rows.slice(3, lastIndex)
  }

  const renderRow = (row: Row<T>) => {
    prepareRow(row)
    return (
      <T.Row {...row.getRowProps()}>
        {row.cells.map((cell) => {
          return (
            <T.Data {...cell.getCellProps()}>
              <Text variant="small">{cell.render('Cell')}</Text>
            </T.Data>
          )
        })}
      </T.Row>
    )
  }

  const ButtonRow: FC<
    React.PropsWithChildren<{
      label: string
      onClick: () => void
      style?: React.CSSProperties
    }>
  > = ({ label, onClick, style }) => {
    return (
      <T.Row>
        <T.Data colSpan={columns.length} style={{ textAlign: 'left' }}>
          <Box display="inlineBlock" cursor="pointer" onClick={onClick}>
            <Text color="blue400" variant="small">
              {label}
            </Text>
          </Box>
        </T.Data>
      </T.Row>
    )
  }

  const renderTruncatedRows = () => {
    return (
      <>
        {firstRows && firstRows.map((row) => renderRow(row))}
        {!isExpanded && (
          <ButtonRow
            label={showMoreLabel}
            onClick={() => setExpanded(true)}
            style={{ backgroundColor: theme.color.blue100 }}
          />
        )}
        {isExpanded && restRows && restRows.map((row) => renderRow(row))}
        {renderRow(lastRow)}
        {isExpanded && (
          <ButtonRow
            label={showLessLabel}
            onClick={() => setExpanded(false)}
            style={{ borderBottom: 'none' }}
          />
        )}
      </>
    )
  }

  return (
    <T.Table {...getTableProps()}>
      <T.Head>
        {headerGroups.map((headerGroup) => (
          <T.Row {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <T.HeadData {...column.getHeaderProps()}>
                <Text variant="h5">{column.render('Header')}</Text>
              </T.HeadData>
            ))}
          </T.Row>
        ))}
      </T.Head>
      <T.Body {...getTableBodyProps()}>
        {(truncate && enoughRowsToTruncate && renderTruncatedRows()) ||
          rows.map((row) => renderRow(row))}
      </T.Body>
    </T.Table>
  )
}

export default Table
