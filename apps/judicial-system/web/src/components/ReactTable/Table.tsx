import React, { FC, PropsWithChildren, ReactElement, useState } from 'react'
import { Row, useSortBy, useTable } from 'react-table'
import cn from 'classnames'

import { Box, Icon, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './Table.css'

type column<T> = {
  Header: string
  accessor: keyof T
}

// eslint-disable-next-line @typescript-eslint/ban-types
interface TableProps<T extends object> {
  data: Array<T>
  columns: column<T>[]
  handleRowClick: (id: string) => void
  truncate?: boolean
  showMoreLabel?: string
  showLessLabel?: string
  className?: string
  sortableColumnIds?: ReadonlyArray<string>
  testid?: string
}

// eslint-disable-next-line @typescript-eslint/ban-types
const Table = <T extends object>(
  props: PropsWithChildren<TableProps<T>>,
): ReactElement => {
  const {
    columns,
    data,
    handleRowClick,
    truncate,
    showMoreLabel = 'See all',
    showLessLabel = 'See less',
    className,
    testid,
  } = props
  const [isExpanded, setExpanded] = useState<boolean>(false)
  const tableInstance = useTable<T>(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'defendants',
            desc: false,
          },
        ],
      },
    },
    useSortBy,
  )
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderRow = (row: any) => {
    prepareRow(row)

    return (
      <tr
        {...row.getRowProps()}
        className={styles.row}
        onClick={() => handleRowClick(row.original.id)}
      >
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          row.cells.map((cell: any) => {
            return (
              <td {...cell.getCellProps()} style={{}}>
                <Text>{cell.render('Cell')}</Text>
              </td>
            )
          })
        }
      </tr>
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
      <tr>
        <td colSpan={columns.length} style={{ textAlign: 'left', ...style }}>
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - 'CSSProperties | undefined' is not assignable to type 'React.CSSProperties | undefined' ?
    <table
      {...getTableProps()}
      className={cn(styles.table, className)}
      data-testid={testid}
    >
      <thead className={styles.header}>
        {headerGroups.map((headerGroup) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - Same as above
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => {
              return (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - Same as above
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <Text fontWeight="regular" as="span">{`${column.render(
                    'Header',
                  )} `}</Text>
                  <span>
                    {!column.disableSortBy ? (
                      column.isSorted ? (
                        column.isSortedDesc ? (
                          <Icon icon="caretDown" size="small" />
                        ) : (
                          <Icon icon="caretUp" size="small" />
                        )
                      ) : (
                        <Box opacity={0.5} component="span">
                          <Icon icon="caretUp" size="small" />
                        </Box>
                      )
                    ) : null}
                  </span>
                </th>
              )
            })}
          </tr>
        ))}
      </thead>
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore - Same as above */}
      <tbody {...getTableBodyProps()}>
        {(truncate && enoughRowsToTruncate && renderTruncatedRows()) ||
          rows.map((row) => renderRow(row))}
      </tbody>
    </table>
  )
}

export default Table
