import React, { ReactNode, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useLocalStorage } from 'react-use'
import parseISO from 'date-fns/parseISO'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { formatDate } from '@island.is/judicial-system/formatters'
import { isDistrictCourtUser } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'

import { CaseListEntry, CaseState } from '../../graphql/schema'
import MobileCase from '../../routes/Shared/Cases/MobileCase'
import { directionType, sortableTableColumn, SortConfig } from '../../types'
import { useCase, useCaseList, useViewport } from '../../utils/hooks'
import { compareLocaleIS } from '../../utils/sortHelper'
import ContextMenu, {
  ContextMenuItem,
  type MenuItems,
  PrebuiltMenuItems,
  useContextMenu,
} from '../ContextMenu/ContextMenu'
import IconButton from '../IconButton/IconButton'
import { UserContext } from '../UserProvider/UserProvider'
import SortButton from './SortButton/SortButton'
import { table as strings } from './Table.strings'
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
  const { openCaseInNewTabMenuItem, deleteCaseMenuItem } = useContextMenu()
  const { sortConfig, requestSort, getClassNamesFor } = useTable()
  const { isTransitioningCase } = useCase()
  const { width } = useViewport()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

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

  return width < theme.breakpoints.md ? (
    <>
      {data.map((theCase: CaseListEntry) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileCase
            onClick={() => handleOpenCase(theCase.id)}
            theCase={theCase}
            isCourtRole={isDistrictCourtUser(user)}
            isLoading={isOpeningCaseId === theCase.id && showLoading}
          >
            {theCase.state &&
              theCase.state === CaseState.WAITING_FOR_CONFIRMATION && (
                <Text fontWeight="medium" variant="small">
                  {`${formatMessage(core.prosecutorPerson)}: ${
                    theCase.prosecutor?.name
                  }`}
                </Text>
              )}
            {theCase.courtDate && (
              <Text fontWeight="medium" variant="small">
                {`${formatMessage(strings.hearing)} ${formatDate(
                  parseISO(theCase.courtDate),
                  'd.M.y',
                )} kl. ${formatDate(parseISO(theCase.courtDate), 'kk:mm')}`}
              </Text>
            )}
          </MobileCase>
        </Box>
      ))}
    </>
  ) : (
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
            aria-disabled={isOpeningCaseId === row.id || isTransitioningCase}
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
                          : item === PrebuiltMenuItems.deleteCase
                          ? deleteCaseMenuItem(row)
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
