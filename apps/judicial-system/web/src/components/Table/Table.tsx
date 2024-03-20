import React, { ReactNode } from 'react'
import { useLocalStorage } from 'react-use'

import { CaseListEntry } from '../../graphql/schema'
import { directionType, sortableTableColumn, SortConfig } from '../../types'
import { useCaseList } from '../../utils/hooks'
import ContextMenu, {
  ContextMenuItem,
  type MenuItems,
  PrebuiltMenuItems,
  useContextMenu,
} from '../ContextMenu/ContextMenu'
import IconButton from '../IconButton/IconButton'
import * as styles from './Table.css'

interface TableProps {
  thead: ReactNode[]
  data: CaseListEntry[]
  columns: { cell: (row: CaseListEntry) => ReactNode }[]
  contextMenu?: {
    menuItems: MenuItems
  }
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
  const { thead, data, columns, contextMenu } = props
  const { isOpeningCaseId, handleOpenCase } = useCaseList()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {thead.map((th) => (
            <th key={`${th}-${thead.indexOf(th)}`} className={styles.th}>
              {th}
            </th>
          ))}
          {contextMenu && <th className={styles.th} />}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row.id}
            role="button"
            aria-label="Opna kröfu"
            aria-disabled={isOpeningCaseId === row.id}
            className={styles.tableRowContainer}
            onClick={() => {
              handleOpenCase(row.id)
            }}
          >
            {columns.map((td) => (
              <td key={`${td}-${columns.indexOf(td)}`} className={styles.td}>
                {td.cell(row)}
              </td>
            ))}
            {contextMenu && (
              <td className={styles.td}>
                <ContextMenu
                  menuLabel={`Valmynd fyrir mál ${row.courtCaseNumber}`}
                  items={contextMenu.menuItems.map((item) =>
                    item === PrebuiltMenuItems.openCaseInNewTab
                      ? openCaseInNewTabMenuItem(row.id)
                      : (item as ContextMenuItem),
                  )}
                  disclosure={
                    <IconButton
                      icon="ellipsisVertical"
                      colorScheme="transparent"
                      onClick={(evt) => {
                        evt.stopPropagation()
                      }}
                    />
                  }
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
