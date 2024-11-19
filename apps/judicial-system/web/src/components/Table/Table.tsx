import { FC, PropsWithChildren, ReactNode, useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useLocalStorage } from 'react-use'
import parseISO from 'date-fns/parseISO'
import { AnimatePresence, motion } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseType,
  isCompletedCase,
  isDistrictCourtUser,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'

import { CaseListEntry, CaseState } from '../../graphql/schema'
import MobileCase from '../../routes/Shared/Cases/MobileCase'
import { directionType, sortableTableColumn, SortConfig } from '../../types'
import { useCase, useCaseList, useViewport } from '../../utils/hooks'
import { compareLocaleIS } from '../../utils/sortHelper'
import ContextMenu, { ContextMenuItem } from '../ContextMenu/ContextMenu'
import IconButton from '../IconButton/IconButton'
import { UserContext } from '../UserProvider/UserProvider'
import SortButton from './SortButton/SortButton'
import TableSkeleton from './TableSkeleton/TableSkeleton'
import { table as strings } from './Table.strings'
import * as styles from './Table.css'
import DurationDate, { getDurationDate } from './DurationDate/DurationDate'

interface Sortable {
  isSortable: boolean
  key: sortableTableColumn
}

interface TableProps {
  thead: {
    title: string
    sortable?: Sortable
  }[]
  data: CaseListEntry[]
  columns: { cell: (row: CaseListEntry) => ReactNode }[]
  generateContextMenuItems?: (row: CaseListEntry) => ContextMenuItem[]
  onClick?: (row: CaseListEntry) => boolean
}

interface TableWrapperProps {
  loading: boolean
}

export const TableWrapper: FC<PropsWithChildren<TableWrapperProps>> = ({
  loading,
  children,
}) => (
  <Box marginBottom={[5, 5, 12]}>{loading ? <TableSkeleton /> : children}</Box>
)

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

const Table: FC<TableProps> = (props) => {
  const { thead, data, columns, generateContextMenuItems, onClick } = props
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()
  const { sortConfig, requestSort, getClassNamesFor } = useTable()
  const { isTransitioningCase } = useCase()
  const { width } = useViewport()
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const handleCaseClick = (theCase: CaseListEntry) => {
    if (!onClick?.(theCase)) {
      handleOpenCase(theCase.id)
    }
  }

  const renderProsecutorText = (
    state?: CaseState | null,
    prosecutorName?: string | null,
  ) => {
    if (
      state &&
      state === CaseState.WAITING_FOR_CONFIRMATION &&
      prosecutorName
    ) {
      return (
        <Text fontWeight="medium" variant="small">
          {`${formatMessage(core.prosecutorPerson)}: ${prosecutorName}`}
        </Text>
      )
    }
    return null
  }

  const renderPostponedOrCourtDateText = (
    postponedIndefinitelyExplanation?: string | null,
    caseState?: CaseState | null,
    courtDate?: string | null,
  ) => {
    if (postponedIndefinitelyExplanation) {
      return <Text>{formatMessage(strings.postponed)}</Text>
    }

    if (!isCompletedCase(caseState) && courtDate) {
      return (
        <Text fontWeight="medium" variant="small">
          {`${formatMessage(strings.hearing)} ${formatDate(
            parseISO(courtDate),
            'd.M.y',
          )} kl. ${formatDate(parseISO(courtDate), 'kk:mm')}`}
        </Text>
      )
    }

    return null
  }

  const renderDurationDate = (
    caseType?: CaseType | null,
    caseState?: CaseState | null,
    validToDate?: string | null,
    initialRulingDate?: string | null,
    rulingDate?: string | null,
  ) => {
    if (isRestrictionCase(caseType) && isCompletedCase(caseState)) {
      return (
        <DurationDate
          date={getDurationDate(
            caseState,
            validToDate,
            initialRulingDate,
            rulingDate,
          )}
        />
      )
    }

    return null
  }

  useMemo(() => {
    if (sortConfig) {
      data.sort((a: CaseListEntry, b: CaseListEntry) => {
        const getColumnValue = (entry: CaseListEntry) => {
          if (
            sortConfig.column === 'defendants' &&
            entry.defendants &&
            entry.defendants.length > 0 &&
            entry.defendants[0].name
          ) {
            return entry.defendants[0].name
          }

          return entry[sortConfig.column]?.toString()
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

  return width < theme.breakpoints.lg ? (
    <>
      {data.map((theCase: CaseListEntry) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileCase
            onClick={() => handleCaseClick(theCase)}
            theCase={theCase}
            isCourtRole={isDistrictCourtUser(user)}
            isLoading={isOpeningCaseId === theCase.id && showLoading}
          >
            {renderProsecutorText(theCase.state, theCase.prosecutor?.name)}
            {renderPostponedOrCourtDateText(
              theCase.postponedIndefinitelyExplanation,
              theCase.state,
              theCase.courtDate,
            )}
            {renderDurationDate(
              theCase.type,
              theCase.state,
              theCase.validToDate,
              theCase.initialRulingDate,
              theCase.rulingDate,
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
                  dataTestid={`${th.sortable.key}SortButton`}
                />
              ) : (
                <Text as="span" fontWeight="regular">
                  {th.title}
                </Text>
              )}
            </th>
          ))}
          {generateContextMenuItems && <th className={styles.th} />}
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
              handleCaseClick(row)
            }}
            data-testid="tableRow"
          >
            {columns.map((td) => (
              <td key={`${td}-${columns.indexOf(td)}`}>{td.cell(row)}</td>
            ))}
            {generateContextMenuItems && (
              <td width="4%">
                {generateContextMenuItems(row).length > 0 && (
                  <AnimatePresence initial={false} mode="popLayout">
                    {isOpeningCaseId === row.id && showLoading ? (
                      <motion.div
                        className={styles.smallContainer}
                        key={row.id}
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
                        menuLabel={`Valmynd fyrir mál ${row.courtCaseNumber}`}
                        items={generateContextMenuItems(row)}
                        disclosure={
                          <motion.div
                            className={styles.smallContainer}
                            key={row.id}
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

export default Table
