import React, { ReactNode, useMemo } from 'react'
import { useLocalStorage } from 'react-use'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'

import { CaseListEntry } from '../../graphql/schema'
import { directionType, sortableTableColumn, SortConfig } from '../../types'
import { useCaseList } from '../../utils/hooks'
import { compareLocaleIS } from '../../utils/sortHelper'
import ContextMenu, {
  ContextMenuItem,
  type MenuItems,
  PrebuiltMenuItems,
  useContextMenu,
} from '../ContextMenu/ContextMenu'
import IconButton from '../IconButton/IconButton'
import SortButton from './SortButton/SortButton'
import * as styles from './Table.css'

interface TableProps {
  thead: {
    title: string
    sortable?: {
      isSortable: boolean
      key: sortableTableColumn
    }
  }[]
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

  return { requestSort, getClassNamesFor, sortConfig, setSortConfig }
}

const Table: React.FC<TableProps> = (props) => {
  const { thead, data, columns, contextMenu } = props
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()
  const { openCaseInNewTabMenuItem } = useContextMenu()
  const { sortConfig, requestSort, getClassNamesFor } = useTable()

  useMemo(() => {
    if (sortConfig) {
      data.sort((a: CaseListEntry, b: CaseListEntry) => {
        const getColumnValue = (entry: CaseListEntry) => {
          if (
            sortConfig.column === 'defendant' &&
            entry.defendants &&
            entry.defendants.length > 0
          ) {
            return entry.defendants[0].name ?? ''
          }
          if (sortConfig.column === 'courtDate') {
            return entry.courtDate ?? ''
          }
          return entry.created
        }
        const compareResult = compareLocaleIS(
          getColumnValue(a),
          getColumnValue(b),
        )

        return sortConfig.direction === 'ascending'
          ? compareResult
          : -compareResult
      })
    }
  }, [data, sortConfig])

  return (
    <table className={styles.table}>
      <thead className={styles.thead}>
        <tr>
          {thead.map((th) => (
            <th key={`${th}-${thead.indexOf(th)}`} className={styles.th}>
              {th.sortable ? (
                <SortButton
                  title={th.title}
                  onClick={() => th.sortable && requestSort(th.sortable.key)}
                  sortAsc={getClassNamesFor(th.sortable.key) === 'ascending'}
                  sortDes={getClassNamesFor(th.sortable.key) === 'descending'}
                  isActive={sortConfig?.column === th.sortable.key}
                  dataTestid="accusedNameSortButton"
                />
              ) : (
                <Text as="span" fontWeight="regular">
                  {th.title}
                </Text>
              )}
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
                <AnimatePresence exitBeforeEnter initial={false}>
                  {isOpeningCaseId === row.id && showLoading ? (
                    <Box padding={1}>
                      <LoadingIndicator />
                    </Box>
                  ) : (
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
                  )}
                </AnimatePresence>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
