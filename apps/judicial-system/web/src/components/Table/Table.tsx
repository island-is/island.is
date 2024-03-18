import React, { ReactNode } from 'react'

import * as styles from './Table.css'
import { SortConfig, directionType, sortableTableColumn } from '../../types'
import { useLocalStorage } from 'react-use'

interface TableProps {
  thead: ReactNode[]
  columns: ReactNode[]
}

export const useTable = () => {
  const [sortConfig, setSortConfig] = useLocalStorage<SortConfig>(
    'sortConfig',
    {
      column: 'courtDate',
      direction: 'descending',
    },
  )

  const requestSort = (column: sortableTableColumn) => {
    let d: directionType = 'ascending'

    if (
      sortConfig &&
      sortConfig.column === column &&
      sortConfig.direction === 'ascending'
    ) {
      d = 'descending'
    }
    setSortConfig({ column, direction: d })
  }

  const getClassNamesFor = (name: sortableTableColumn) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.column === name ? sortConfig.direction : undefined
  }

  return { requestSort, getClassNamesFor, sortConfig }
}

const Table: React.FC<TableProps> = (props) => {
  const { thead, columns } = props

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {thead.map((th) => (
            <th key={`${th}-${thead.indexOf(th)}`} className={styles.th}>
              {th}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {columns.map((td) => (
            <td key={`${td}-${columns.indexOf(td)}`} className={styles.td}>
              {td}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  )
}

export default Table
