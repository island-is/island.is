import { FC } from 'react'

import { Text } from '@island.is/island-ui/core'
import { CaseTableColumnType } from '@island.is/judicial-system/types'

import * as styles from './Table.css'

interface GenericTableProps {
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

const GenericTable: FC<GenericTableProps> = ({ rows, columns, onClick }) => {
  console.log('GenericTableProps', columns, rows)
  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {columns.map((column) => (
            <th key={column.title} className={styles.th}>
              <Text as="span" fontWeight="regular">
                {column.title}
              </Text>
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
