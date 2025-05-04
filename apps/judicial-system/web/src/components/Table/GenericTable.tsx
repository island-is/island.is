import { useMemo } from 'react'
import { useLocalStorage } from 'react-use'

import SortButton from './SortButton/SortButton'
import * as styles from './Table.css'

interface GenericTableProps<Cell> {
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

const GenericTable = <Cell,>({
  tableId,
  rows,
  columns,
  onClick,
}: GenericTableProps<Cell>) => {
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
          {columns.map((c, idx) => (
            <th key={idx} className={styles.th}>
              <SortButton
                title={c.title}
                onClick={() => {
                  setSortConfig({
                    column: idx,
                    direction:
                      sortConfig &&
                      sortConfig.column === idx &&
                      sortConfig.direction === 'ascending'
                        ? 'descending'
                        : 'ascending',
                  })
                }}
                sortAsc={
                  sortConfig?.column === idx &&
                  sortConfig?.direction === 'ascending'
                }
                sortDes={
                  sortConfig?.column === idx &&
                  sortConfig?.direction === 'descending'
                }
                isActive={sortConfig?.column === idx}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr
            key={idx}
            role="button"
            aria-label="Opna kröfu"
            className={styles.tableRowContainer}
            onClick={() => {
              if (onClick) {
                onClick(r.id)
              }
            }}
          >
            {r.cells.map((cell, idx) => (
              <td key={idx}>{columns[idx].render(cell)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default GenericTable
