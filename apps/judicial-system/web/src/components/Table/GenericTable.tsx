import {
  type FC,
  type JSX,
  type MouseEvent,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useLocalStorage } from 'react-use'
import cn from 'classnames'
import {
  AnimatePresence,
  motion,
  useIsPresent,
  useReducedMotion,
} from 'motion/react'

import { Icon, Text } from '@island.is/island-ui/core'
import type { ContextMenuItem } from '@island.is/judicial-system-web/src/components'
import { ContextMenu } from '@island.is/judicial-system-web/src/components'
import { ExpandingBlock } from '@island.is/judicial-system-web/src/components/Motion/ExpandingSection'
import {
  enterExitTransition,
  instantTransition,
} from '@island.is/judicial-system-web/src/components/Motion/transitions'
import { onEnterOrSpace } from '@island.is/judicial-system-web/src/utils/utils'

import SortButton from './SortButton/SortButton'
import * as styles from './Table.css'

interface GenericTableRow<Cell> {
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
}

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
  rows: GenericTableRow<Cell>[]
  loadingIndicator: () => JSX.Element
  // A row added to the table after its first render fades in, and a removed
  // row fades out before it leaves. The rows the table starts with appear at
  // once, and nothing else moves.
  fadeRows?: boolean
  // Columns take their given widths, or share the rest of the table's width,
  // rather than sizing to their content, so tables with the same columns line
  // up with each other.
  fixedLayout?: boolean
  // When false, the column titles are plain text, with no sort buttons.
  sortable?: boolean
}

const getRowProps = <Cell,>(r: GenericTableRow<Cell>) => ({
  role: 'button',
  tabIndex: r.isDisabled ? -1 : 0,
  'aria-label': r.actionLabel ?? (r.label ? `Opna mál ${r.label}` : 'Opna mál'),
  'aria-disabled': r.isDisabled,
  className: styles.tableRowContainer,
  onClick: (evt: MouseEvent<HTMLTableRowElement>) =>
    !r.isDisabled && r.onClick(evt),
  onKeyDown: onEnterOrSpace(() => !r.isDisabled && r.onClick()),
})

interface FadingRowProps {
  rowProps: ReturnType<typeof getRowProps>
  reduceMotion: boolean
}

/**
 * A row that fades in when it is added and out when it is removed. While it
 * fades out, the same case may already be a live row in another table, so the
 * fading copy takes no clicks, keys or focus, is hidden from assistive
 * technology, and carries data-exiting for code that looks for the rows
 * around it.
 */
const FadingRow: FC<PropsWithChildren<FadingRowProps>> = ({
  rowProps,
  reduceMotion,
  children,
}) => {
  const isPresent = useIsPresent()

  return (
    <motion.tr
      {...rowProps}
      tabIndex={isPresent ? rowProps.tabIndex : -1}
      onClick={isPresent ? rowProps.onClick : undefined}
      onKeyDown={isPresent ? rowProps.onKeyDown : undefined}
      aria-hidden={isPresent ? undefined : true}
      inert={!isPresent}
      data-exiting={isPresent ? undefined : true}
      style={isPresent ? undefined : { pointerEvents: 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={reduceMotion ? instantTransition : enterExitTransition}
    >
      {children}
    </motion.tr>
  )
}

/**
 * The content of a cell in a fading row. It opens from no height and closes
 * back to none with the row, on the same timing as the row's fade, and holds
 * the cell's vertical padding so that collapses too.
 */
const FadingCell: FC<PropsWithChildren<{ animatesIn: boolean }>> = ({
  animatesIn,
  children,
}) => (
  <ExpandingBlock animatesIn={animatesIn}>
    <div className={styles.fadingCellContent}>{children}</div>
  </ExpandingBlock>
)

const GenericTable = <Cell,>({
  tableId,
  rows,
  columns,
  loadingIndicator: LoadingIndicator,
  fadeRows = false,
  fixedLayout = false,
  sortable = true,
}: GenericTableProps<Cell>) => {
  const reduceMotion = useReducedMotion() ?? false
  // Rows of the first render appear as they are; later rows open in.
  const isFirstRenderRef = useRef(true)
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
    isFirstRenderRef.current = false
  }, [])

  const renderCells = (
    r: GenericTableRow<Cell>,
    wrap: (content: ReactNode) => ReactNode = (content) => content,
  ) => (
    <>
      {r.cells.map((cell, idx) => (
        <td key={idx}>{wrap(columns[idx].render(cell))}</td>
      ))}
      <td
        width="4%"
        className={fixedLayout ? styles.fixedLayoutMenuColumn : undefined}
      >
        {wrap(
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
          </AnimatePresence>,
        )}
      </td>
    </>
  )

  const animatesIn = !isFirstRenderRef.current
  const wrapInFadingCell = (content: ReactNode) => (
    <FadingCell animatesIn={animatesIn}>{content}</FadingCell>
  )

  return (
    <div className={styles.tableWrapper}>
      <table
        className={cn(styles.table, {
          [styles.fixedLayoutTable]: fixedLayout,
          [styles.fadeRowsTable]: fadeRows,
        })}
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
          {fadeRows ? (
            // Rows are keyed by id. A row that comes back while its old copy
            // is still fading out keeps that element, which turns live again
            // and fades back in, so the case is never in the table twice.
            <AnimatePresence initial={false}>
              {rows.map((r) => (
                <FadingRow
                  key={r.id}
                  rowProps={getRowProps(r)}
                  reduceMotion={reduceMotion}
                >
                  {renderCells(r, wrapInFadingCell)}
                </FadingRow>
              ))}
            </AnimatePresence>
          ) : (
            rows.map((r, idx) => (
              <tr key={idx} {...getRowProps(r)}>
                {renderCells(r)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default GenericTable
