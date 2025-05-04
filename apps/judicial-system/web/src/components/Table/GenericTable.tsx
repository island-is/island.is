import { FC, useMemo } from 'react'
import { useLocalStorage } from 'react-use'

import { CaseTableColumnType } from '@island.is/judicial-system/types'

import { compareLocaleIS } from '../../utils/sortHelper'
import SortButton from './SortButton/SortButton'
import * as styles from './Table.css'

interface GenericTableProps {
  tableId: string
  columns: {
    title: string
    type: CaseTableColumnType
  }[]
  rows: {
    caseId: string
    cells: {
      value: string[]
    }[]
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
        const aValue = a.cells[sortConfig.column].value
        const bValue = b.cells[sortConfig.column].value

        for (let i = 0; i < aValue.length; i++) {
          if (aValue[i] === bValue[i]) {
            continue
          }

          if (sortConfig.direction === 'ascending') {
            return compareLocaleIS(aValue[i], bValue[i])
          } else {
            return compareLocaleIS(bValue[i], aValue[i])
          }
        }

        return 0
      })
    }
  }, [rows, sortConfig])

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {columns.map((column, index) => (
            <th key={column.title} className={styles.th}>
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
            key={row.caseId}
            role="button"
            aria-label="Opna kröfu"
            className={styles.tableRowContainer}
            onClick={() => {
              if (onClick) {
                onClick(row.caseId)
              }
            }}
          >
            {row.cells.map((cell, index) => (
              <td key={index}>{cell.value.join(', ')}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default GenericTable
