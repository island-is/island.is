import { type JSX, type MouseEvent, useEffect, useMemo, useRef } from 'react'
import { useLocalStorage } from 'react-use'
import cn from 'classnames'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Icon, Text } from '@island.is/island-ui/core'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components'
import { ContextMenu } from '@island.is/judicial-system-web/src/components'
import {
  enterExitTransition,
  instantTransition,
} from '@island.is/judicial-system-web/src/components/Motion/transitions'
import { onEnterOrSpace } from '@island.is/judicial-system-web/src/utils/utils'

import SortButton from './SortButton/SortButton'
import * as styles from './Table.css'

interface GenericTableProps<Cell> {
  tableId: string
  columns: {
    title: string
    // A CSS width for the column, such as '14%'. Used with fixedLayout, where
    // the columns without one share what is left.
    width?: string
    compare: (a: Cell, b: Cell) => number
    render: (cell: Cell) => React.ReactNode
  }[]
  rows: {
    id: string
    cells: Cell[]
    contextMenuItems: ContextMenuItem[]
    // Given the mouse event when the row is clicked, and nothing when it is
    // activated with the keyboard.
    onClick: (event?: MouseEvent<HTMLTableRowElement>) => void
    isDisabled: boolean
    isLoading: boolean
    label?: string
    // The row's accessible name, in place of the default "Opna mál <label>",
    // for rows whose click does something other than open the case.
    actionLabel?: string
  }[]
  loadingIndicator: () => JSX.Element
  // A row added to the table after its first render fades in. The rows it
  // starts with appear at once, and nothing else moves.
  fadeInNewRows?: boolean
  // Columns take their given widths, or share the rest of the table's width,
  // rather than sizing to their content, so tables with the same columns line
  // up with each other.
  fixedLayout?: boolean
  // When false, the column titles are plain text, with no sort buttons.
  sortable?: boolean
}

const GenericTable = <Cell,>({
  tableId,
  rows,
  columns,
  loadingIndicator: LoadingIndicator,
  fadeInNewRows = false,
  fixedLayout = false,
  sortable = true,
}: GenericTableProps<Cell>) => {
  const reduceMotion = useReducedMotion()
  // Rows mounted before this is set are the ones the table started with.
  const hasRenderedRef = useRef(false)
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

  useEffect(() => {
    hasRenderedRef.current = true
  }, [])

  return (
    <div className={styles.tableWrapper}>
      <table
        className={cn(styles.table, { [styles.fixedLayoutTable]: fixedLayout })}
      >
        <thead className={styles.thead}>
          <tr>
            {columns.map((c, idx) => (
              <th
                key={idx}
                className={styles.th}
                style={fixedLayout && c.width ? { width: c.width } : undefined}
                aria-sort={
                  !sortable
                    ? undefined
                    : sortConfig?.column === idx
                    ? sortConfig.direction
                    : 'none'
                }
              >
                {sortable ? (
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
                ) : (
                  <Text as="span" fontWeight="regular">
                    {c.title}
                  </Text>
                )}
              </th>
            ))}
            {
              <th
                className={cn(styles.th, {
                  [styles.fixedLayoutMenuColumn]: fixedLayout,
                })}
              />
            }
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            const rowProps = {
              role: 'button',
              tabIndex: r.isDisabled ? -1 : 0,
              'aria-label':
                r.actionLabel ?? (r.label ? `Opna mál ${r.label}` : 'Opna mál'),
              'aria-disabled': r.isDisabled,
              className: styles.tableRowContainer,
              onClick: (evt: MouseEvent<HTMLTableRowElement>) =>
                !r.isDisabled && r.onClick(evt),
              onKeyDown: onEnterOrSpace(() => !r.isDisabled && r.onClick()),
            }

            const content = (
              <>
                {r.cells.map((cell, idx) => (
                  <td key={idx}>{columns[idx].render(cell)}</td>
                ))}
                <td
                  width="4%"
                  className={
                    fixedLayout ? styles.fixedLayoutMenuColumn : undefined
                  }
                >
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
              </>
            )

            return fadeInNewRows ? (
              <motion.tr
                // Keyed by its id, so a row stays mounted while the rows
                // around it come and go, and only a new row fades in.
                key={r.id}
                initial={hasRenderedRef.current ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={
                  reduceMotion ? instantTransition : enterExitTransition
                }
                {...rowProps}
              >
                {content}
              </motion.tr>
            ) : (
              <tr key={idx} {...rowProps}>
                {content}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default GenericTable
