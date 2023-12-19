import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages/Core'
import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import { TagAppealState } from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  DefendantInfo,
  getDurationDate,
  MobileAppealCase,
  SortButton,
  TableContainer,
  TableHeaderText,
} from '@island.is/judicial-system-web/src/components/Table'
import {
  CaseDecision,
  CaseListEntry,
  CaseState,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCaseList,
  useSortAppealCases,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'

import * as styles from '../Table.css'

interface Props {
  cases: CaseListEntry[]
  loading: boolean
  showingCompletedCases?: boolean
}

const AppealCasesTable: React.FC<Props> = (props) => {
  const { cases, loading, showingCompletedCases } = props
  const { formatMessage } = useIntl()
  const { isOpeningCaseId, handleOpenCase, LoadingIndicator, showLoading } =
    useCaseList()
  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } =
    useSortAppealCases('appealedDate', 'descending', cases)
  const activeCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        (a['appealedDate'] ?? '').localeCompare(b['appealedDate'] ?? ''),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {activeCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileAppealCase
            theCase={theCase}
            onClick={() => handleOpenCase(theCase.id)}
            isLoading={isOpeningCaseId === theCase.id && showLoading}
          >
            {showingCompletedCases && (
              <Text fontWeight={'medium'} variant="small">
                {isRestrictionCase(theCase.type)
                  ? `${formatDate(theCase.rulingDate ?? '', 'd.M.y')} -
                      ${formatDate(theCase.validToDate ?? '', 'd.M.y')}`
                  : ''}
              </Text>
            )}
          </MobileAppealCase>
        </Box>
      ))}
    </>
  ) : (
    <TableContainer
      loading={loading}
      tableHeader={
        <>
          <TableHeaderText title={formatMessage(tables.caseNumber)} />
          <th className={cn(styles.th, styles.largeColumn)}>
            <SortButton
              title={capitalize(formatMessage(core.defendant, { suffix: 'i' }))}
              onClick={() => requestSort('defendant')}
              sortAsc={getClassNamesFor('defendant') === 'ascending'}
              sortDes={getClassNamesFor('defendant') === 'descending'}
              isActive={isActiveColumn('defendant')}
            />
          </th>
          <TableHeaderText title={formatMessage(tables.type)} />
          <TableHeaderText title={formatMessage(tables.state)} />
          {showingCompletedCases ? (
            <TableHeaderText title={formatMessage(tables.duration)} />
          ) : (
            <th className={cn(styles.th, styles.largeColumn)}>
              <SortButton
                title={formatMessage(tables.appealDate)}
                onClick={() => requestSort('appealedDate')}
                sortAsc={getClassNamesFor('appealedDate') === 'ascending'}
                sortDes={getClassNamesFor('appealedDate') === 'descending'}
                isActive={isActiveColumn('appealedDate')}
              />
            </th>
          )}
          <th></th>
        </>
      }
    >
      {sortedData.map((column) => {
        return (
          <tr
            className={styles.row}
            onClick={() => handleOpenCase(column.id)}
            key={column.id}
          >
            <td>
              <CourtCaseNumber
                courtCaseNumber={column.courtCaseNumber ?? ''}
                policeCaseNumbers={column.policeCaseNumbers ?? []}
                appealCaseNumber={column.appealCaseNumber ?? ''}
              />
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              <DefendantInfo defendants={column.defendants as Defendant[]} />
            </td>
            <td>
              <ColumnCaseType
                type={column.type}
                decision={column.decision as CaseDecision}
                parentCaseId={column.parentCaseId ?? ''}
              />
            </td>
            <td>
              <TagAppealState
                appealState={column.appealState}
                appealRulingDecision={column.appealRulingDecision}
                appealCaseNumber={column.appealCaseNumber}
              />
            </td>
            <td>
              {showingCompletedCases ? (
                <Text>
                  {isRestrictionCase(column.type)
                    ? getDurationDate(
                        column.state as CaseState,
                        column.validToDate,
                        column.initialRulingDate,
                        column.rulingDate,
                      )
                    : ''}
                </Text>
              ) : (
                <Text>
                  {column.appealedDate
                    ? formatDate(column.appealedDate, 'd.M.y')
                    : '-'}
                </Text>
              )}
            </td>
            <td className={styles.loadingContainer}>
              <AnimatePresence>
                {isOpeningCaseId === column.id && showLoading && (
                  <LoadingIndicator />
                )}
              </AnimatePresence>
            </td>
          </tr>
        )
      })}
    </TableContainer>
  )
}

export default AppealCasesTable
