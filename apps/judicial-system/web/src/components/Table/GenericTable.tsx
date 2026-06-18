import { type JSX,useMemo } from 'react'
import { useLocalStorage } from 'react-use'
import { AnimatePresence, motion } from 'motion/react'

import { Icon } from '@island.is/island-ui/core'
import {
  ContextMenu,
  ContextMenuItem,
} from '@island.is/judicial-system-web/src/components'
import { onEnterOrSpace } from '@island.is/judicial-system-web/src/utils/utils'

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
    contextMenuItems: ContextMenuItem[]
    onClick: () => void
    isDisabled: boolean
    isLoading: boolean
    label?: string
  }[]
  loadingIndicator: () => JSX.Element
}

const GenericTable = <Cell,>({
  tableId,
  rows,
  columns,
  loadingIndicator: LoadingIndicator,
}: GenericTableProps<Cell>) => {
  const [sortConfig, setSortConfig] = useLocalStorage<{
    column: number
    direction: 'ascending' | 'descending'
  }>(tableId)

  useMemo(() => {
    if (sortConfig) {
      rows.sort((a, b) => {
        const aCells = a.cells
        const bCells = b.cells

        if (
          aCells.length <= sortConfig.column ||
          bCells.length <= sortConfig.column
        ) {
          // Should not happen, but if it does, don't sort and keep the original order
          return 0
        }

        const aValue = aCells[sortConfig.column]
        const bValue = bCells[sortConfig.column]

        if (sortConfig.direction === 'ascending') {
          return columns[sortConfig.column].compare(aValue, bValue)
        }

        return columns[sortConfig.column].compare(bValue, aValue)
      })
    }
  }, [columns, rows, sortConfig])

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((c, idx) => (
              <th
                key={idx}
                className={styles.th}
                aria-sort={
                  sortConfig?.column === idx ? sortConfig.direction : 'none'
                }
              >
                <SortButton
                  title={c.title}
                  onClick={() =>
                    setSortConfig({
                      column: idx,
                      direction:
                        sortConfig &&
                        sortConfig.column === idx &&
                        sortConfig.direction === 'ascending'
                          ? 'descending'
                          : 'ascending',
                    })
                  }
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
            {<th className={styles.th} />}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={idx}
              role="button"
              tabIndex={r.isDisabled ? -1 : 0}
              aria-label={r.label ? `Opna mál ${r.label}` : 'Opna mál'}
              aria-disabled={r.isDisabled}
              className={styles.tableRowContainer}
              onClick={() => !r.isDisabled && r.onClick()}
              onKeyDown={onEnterOrSpace(() => !r.isDisabled && r.onClick())}
            >
              {r.cells.map((cell, idx) => (
                <td key={idx}>{columns[idx].render(cell)}</td>
              ))}
              <td width="4%">
                <AnimatePresence initial={false} mode="popLayout">
                  {r.isLoading ? (
                    <motion.div
                      className={styles.smallContainer}
                      key={r.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 1 }}
                      exit={{
                        opacity: 0,
                        y: 5,
                      }}
                      transition={{ type: 'spring' }}
                    >
                      <LoadingIndicator />
                    </motion.div>
                  ) : (
                    r.contextMenuItems.length > 0 && (
                      <ContextMenu
                        items={r.contextMenuItems}
                        render={
                          <motion.div
                            className={styles.contextMenuButton}
                            aria-label={`Frekari aðgerðir fyrir mál ${
                              r.label ?? r.id
                            }`}
                            key={r.id}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1, y: 1 }}
                            exit={{ opacity: 0, y: 5 }}
                            onClick={(evt) => evt.stopPropagation()}
                          >
                            <Icon
                              icon="ellipsisVertical"
                              color="blue400"
                              size="small"
                            />
                          </motion.div>
                        }
                      />
                    )
                  )}
                </AnimatePresence>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GenericTable
