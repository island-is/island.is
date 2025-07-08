import { FC, ReactNode, useMemo } from 'react'
import { useIntl } from 'react-intl'
import { useLocalStorage } from 'react-use'
import parseISO from 'date-fns/parseISO'
import { AnimatePresence, motion } from 'motion/react'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  districtCourtAbbreviation,
  formatDate,
} from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  ContextMenu,
  ContextMenuItem,
  IconButton,
} from '@island.is/judicial-system-web/src/components'

import { CaseListEntry, CaseState, CaseType } from '../../graphql/schema'
import MobileCase from '../../routes/Shared/Cases/MobileCase'
import {
  directionType,
  sortableFn,
  sortableTableColumn,
  SortConfig,
} from '../../types'
import { useCase, useCaseList, useViewport } from '../../utils/hooks'
import { compareLocaleIS } from '../../utils/sortHelper'
import { mapCaseStateToTagVariant } from '../Tags/TagCaseState/TagCaseState'
import DurationDate, { getDurationDate } from './DurationDate/DurationDate'
import SortButton from './SortButton/SortButton'
import { table as strings } from './Table.strings'
import * as styles from './Table.css'

interface TableProps {
  thead: {
    title: string
    sortBy?: sortableTableColumn
    sortFn?: sortableFn
  }[]
  data: CaseListEntry[]
  columns: { cell: (row: CaseListEntry) => ReactNode }[]
  generateContextMenuItems?: (row: CaseListEntry) => ContextMenuItem[]
  onClick?: (row: CaseListEntry) => boolean
}

export const useTable = () => {
  const [sortConfig, setSortConfig] = useLocalStorage<SortConfig>(
    'sortConfig',
    {
      column: 'courtDate',
      direction: 'descending',
    },
  )

  const requestSort = (column: sortableTableColumn, sortFn?: sortableFn) => {
    let direction: directionType = 'ascending'

    if (
      sortConfig &&
      sortConfig.column === column &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }

    setSortConfig({ column, direction, sortFn })
  }

  const getClassNamesFor = (name: sortableTableColumn) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.column === name ? sortConfig.direction : undefined
  }

  return { requestSort, getClassNamesFor, sortConfig }
}

const Table: FC<TableProps> = (props) => {
  const { thead, data, columns, generateContextMenuItems, onClick } = props
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()
  const { sortConfig, requestSort, getClassNamesFor } = useTable()
  const { isTransitioningCase } = useCase()
  const { width } = useViewport()
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
    const getColumnValue = (
      entry: CaseListEntry,
      column: keyof CaseListEntry,
    ) => {
      const courtAbbreviation = districtCourtAbbreviation(entry.court?.name)

      switch (column) {
        case 'defendants':
          return entry.defendants?.[0]?.name ?? ''
        case 'defendantsPunishmentType':
          return entry.defendants?.[0]?.punishmentType ?? ''
        case 'courtCaseNumber':
          return courtAbbreviation
            ? `${courtAbbreviation}: ${entry.courtCaseNumber}`
            : entry.courtCaseNumber ?? ''
        case 'state':
          return mapCaseStateToTagVariant(formatMessage, entry).text
        case 'policeCaseNumbers':
          return entry.policeCaseNumbers?.[0] ?? ''
        default:
          return entry[column]?.toString() ?? ''
      }
    }

    const getSortFn = (
      sortConfig: SortConfig,
      sortFnName?: sortableFn,
    ): ((a: CaseListEntry, b: CaseListEntry) => number) => {
      const toNumber = (value?: string | null): number =>
        Number(value?.replace(/\D/g, '') || '0')

      const getSortableValue = (value?: string | null): number =>
        toNumber(value) +
        (!value || value.includes('R-') ? 0 : Number.MAX_SAFE_INTEGER)

      switch (sortFnName) {
        case 'number':
          return (a: CaseListEntry, b: CaseListEntry) => {
            const aValue = getColumnValue(a, sortConfig.column)
            const bValue = getColumnValue(b, sortConfig.column)

            const getValue =
              sortConfig.column === 'courtCaseNumber'
                ? getSortableValue
                : toNumber

            const sortableAValue = getValue(aValue)
            const sortableBValue = getValue(bValue)

            return sortConfig?.direction === 'ascending'
              ? sortableAValue - sortableBValue
              : sortableBValue - sortableAValue
          }
        default:
          return (a: CaseListEntry, b: CaseListEntry) => {
            const compareResult = compareLocaleIS(
              getColumnValue(a, sortConfig.column),
              getColumnValue(b, sortConfig.column),
            )
            return sortConfig.direction === 'ascending'
              ? compareResult
              : -compareResult
          }
      }
    }

    if (sortConfig) {
      data.sort(getSortFn(sortConfig, sortConfig.sortFn))
    }
  }, [data, formatMessage, sortConfig])

  return width < theme.breakpoints.lg ? (
    <>
      {data.map((theCase: CaseListEntry) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileCase
            onClick={() => handleCaseClick(theCase)}
            theCase={theCase}
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
              {th.sortBy && data.length > 1 ? (
                <SortButton
                  title={th.title}
                  onClick={() => {
                    th.sortBy && requestSort(th.sortBy, th.sortFn)
                  }}
                  sortAsc={getClassNamesFor(th.sortBy) === 'ascending'}
                  sortDes={getClassNamesFor(th.sortBy) === 'descending'}
                  isActive={sortConfig?.column === th.sortBy}
                  dataTestid={`${th.sortBy}SortButton`}
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
                        items={generateContextMenuItems(row)}
                        render={
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
