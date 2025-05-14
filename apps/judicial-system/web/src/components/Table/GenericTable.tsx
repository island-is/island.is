import { useMemo } from 'react'
import { useLocalStorage } from 'react-use'
import { AnimatePresence, motion } from 'motion/react'

import ContextMenu, { ContextMenuItem } from '../ContextMenu/ContextMenu'
import IconButton from '../IconButton/IconButton'
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
  generateContextMenuItems: (id: string) => ContextMenuItem[]
  loadingIndicator: () => JSX.Element
  rowIdBeingOpened: string | null
  showLoading: boolean
  onClick: (id: string) => void
}

const GenericTable = <Cell,>({
  tableId,
  rows,
  columns,
  generateContextMenuItems,
  loadingIndicator: LoadingIndicator,
  rowIdBeingOpened: isOpeningRow,
  showLoading,
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
          {<th className={styles.th} />}
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
              onClick(r.id)
            }}
          >
            {r.cells.map((cell, idx) => (
              <td key={idx}>{columns[idx].render(cell)}</td>
            ))}
            {generateContextMenuItems && (
              <td width="4%">
                {generateContextMenuItems(r.id).length > 0 && (
                  <AnimatePresence initial={false} mode="popLayout">
                    {isOpeningRow === r.id && showLoading ? (
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
                      <ContextMenu
                        menuLabel={`Valmynd fyrir mál ${r.id}`}
                        items={generateContextMenuItems(r.id)}
                        disclosure={
                          <motion.div
                            className={styles.smallContainer}
                            key={r.id}
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1, y: 1 }}
                            exit={{ opacity: 0, y: 5 }}
                            onClick={(evt) => {
                              evt.stopPropagation()
                            }}
                          >
                            <IconButton
                              icon="ellipsisVertical"
                              colorScheme="transparent"
                            />
                          </motion.div>
                        }
                      />
                    )}
                  </AnimatePresence>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default GenericTable
