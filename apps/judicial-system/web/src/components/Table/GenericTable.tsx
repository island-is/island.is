import { FC, useMemo } from 'react'
import { useLocalStorage } from 'react-use'

import SortButton from './SortButton/SortButton'
import * as styles from './Table.css'

interface Cell {
  value: string[]
}

interface GenericTableProps {
  tableId: string
  columns: {
    title: string
    compare: (a: Cell, b: Cell) => number
    render: (cell: Cell) => React.ReactNode
  }[]
  rows: {
    id: string
    cells: Cell[]
  }[]
  // generateContextMenuItems?: (row: CaseListEntry) => ContextMenuItem[]
  onClick?: (id: string) => boolean
}

const GenericTable: FC<GenericTableProps> = ({
  tableId,
  rows,
  columns,
  onClick,
}) => {
  const [sortConfig, setSortConfig] = useLocalStorage<{
    column: number
    direction: 'ascending' | 'descending'
  }>(tableId)

  useMemo(() => {
    if (sortConfig) {
      rows.sort((a, b) => {
        const aValue = a.cells[sortConfig.column]
        const bValue = b.cells[sortConfig.column]

        if (sortConfig.direction === 'ascending') {
          return columns[sortConfig.column].compare(aValue, bValue)
        }

        return columns[sortConfig.column].compare(bValue, aValue)
      })
    }
  }, [columns, rows, sortConfig])

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className={styles.th}>
              <SortButton
                title={column.title}
                onClick={() => {
                  setSortConfig({
                    column: index,
                    direction:
                      sortConfig &&
                      sortConfig.column === index &&
                      sortConfig.direction === 'ascending'
                        ? 'descending'
                        : 'ascending',
                  })
                }}
                sortAsc={
                  sortConfig?.column === index &&
                  sortConfig?.direction === 'ascending'
                }
                sortDes={
                  sortConfig?.column === index &&
                  sortConfig?.direction === 'descending'
                }
                isActive={sortConfig?.column === index}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            role="button"
            aria-label="Opna kröfu"
            className={styles.tableRowContainer}
            onClick={() => {
              if (onClick) {
                onClick(row.id)
              }
            }}
          >
            {row.cells.map((cell, index) => (
              <td key={index}>{columns[index].render(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default GenericTable
