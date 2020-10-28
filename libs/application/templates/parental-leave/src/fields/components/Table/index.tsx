import React, { FC, PropsWithChildren, ReactElement, useState } from 'react'
import { Row, useTable } from 'react-table'

import { Box, Text } from '@island.is/island-ui/core'
import * as styles from './Table.treat'
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

const Table = <T extends object>(
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
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance
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
      <tr {...row.getRowProps()} style={{}}>
        {row.cells.map((cell) => {
          return (
            <td {...cell.getCellProps()} style={{}}>
              <Text variant="small">{cell.render('Cell')}</Text>
            </td>
          )
        })}
      </tr>
    )
  }

  const ButtonRow: FC<{
    label: string
    onClick: () => void
    style?: React.CSSProperties
  }> = ({ label, onClick, style }) => {
    return (
      <tr>
        <td colSpan={columns.length} style={style}>
          <Box display="inlineBlock" cursor="pointer" onClick={onClick}>
            <Text color="blue400" variant="small">
              {label}
            </Text>
          </Box>
        </td>
      </tr>
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
          <ButtonRow label={showLessLabel} onClick={() => setExpanded(false)} />
        )}
      </>
    )
  }

  return (
    // @ts-ignore - 'CSSProperties | undefined' is not assignable to type 'React.CSSProperties | undefined'
    <table {...getTableProps()} className={styles.table}>
      <thead className={styles.header}>
        {headerGroups.map((headerGroup) => (
          // @ts-ignore - Same as above
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                <Text variant="h5">{column.render('Header')}</Text>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* @ts-ignore - Same as above */}
      <tbody {...getTableBodyProps()}>
        {(truncate && enoughRowsToTruncate && renderTruncatedRows()) ||
          rows.map((row) => renderRow(row))}
      </tbody>
    </table>
  )
}

export default Table
