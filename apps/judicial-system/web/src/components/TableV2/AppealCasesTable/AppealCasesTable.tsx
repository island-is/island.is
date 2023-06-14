import React, { useMemo } from 'react'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'

import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import { useIntl } from 'react-intl'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDOB,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages/Core'
import { useViewport } from '@island.is/judicial-system-web/src/utils/hooks'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'
import TagAppealState from '../../TagAppealState/TagAppealState'
import SortButton from '../SortButton/SortButton'
import TableHeaderText from '../TableHeaderText/TableHeaderText'
import { theme } from '@island.is/island-ui/theme'
import TableContainer from '../TableContainer/TableContainer'
import useSortAppealCases from '@island.is/judicial-system-web/src/utils/hooks/useTable/useSortAppealCases'
import { AppealedCasesQueryResponse } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/Cases/Cases'

import * as styles from '../Table.css'
import { isRestrictionCase } from '@island.is/judicial-system/types'
import MobileAppealCase from './MobileAppealCase'

interface Props {
  cases: AppealedCasesQueryResponse[]
  onRowClick: (id: string) => void
  loading: boolean
  showingCompletedCases?: boolean
}

const AppealCasesTable: React.FC<Props> = (props) => {
  const { cases, onRowClick, loading, showingCompletedCases } = props
  const { formatMessage } = useIntl()
  const { sortedData, requestSort, getClassNamesFor } = useSortAppealCases(
    'appealedDate',
    'descending',
    cases,
  )
  const activeCasesData = useMemo(
    () =>
      cases.sort(
        (a: AppealedCasesQueryResponse, b: AppealedCasesQueryResponse) =>
          a['appealedDate'].localeCompare(b['appealedDate']),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {activeCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.parentCaseId}>
          <MobileAppealCase
            theCase={theCase}
            onClick={() => onRowClick(theCase.id)}
          ></MobileAppealCase>
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
            />
          </th>
          <TableHeaderText title={formatMessage(tables.type)} />
          <TableHeaderText title={formatMessage(tables.state)} />
          {showingCompletedCases ? (
            <TableHeaderText title={formatMessage(tables.duration)} />
          ) : (
            <th className={cn(styles.th, styles.largeColumn)}>
              <SortButton
                title="Stofnað"
                onClick={() => requestSort('appealedDate')}
                sortAsc={getClassNamesFor('appealedDate') === 'ascending'}
                sortDes={getClassNamesFor('appealedDate') === 'descending'}
              />
            </th>
          )}
        </>
      }
    >
      {sortedData.map((column) => {
        return (
          <tr
            className={styles.row}
            onClick={() => onRowClick(column.parentCaseId)}
          >
            <td>
              {column.appealCaseNumber ? (
                <Box display="flex" flexDirection="column">
                  <Text as="span" variant="small">
                    {column.appealCaseNumber}
                  </Text>
                  <Text as="span" variant="small">
                    {column.courtCaseNumber}
                  </Text>
                  <Text as="span" variant="small">
                    {displayFirstPlusRemaining(column.policeCaseNumbers)}
                  </Text>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column">
                  <Text as="span">{column.courtCaseNumber}</Text>
                  <Text as="span" variant="small">
                    {displayFirstPlusRemaining(column.policeCaseNumbers)}
                  </Text>
                </Box>
              )}
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              {column.defendants && column.defendants.length > 0 ? (
                <>
                  <Text>
                    <Box component="span" className={styles.blockColumn}>
                      {column.defendants[0].name ?? '-'}
                    </Box>
                  </Text>
                  {column.defendants.length === 1 ? (
                    (!column.defendants[0].noNationalId ||
                      column.defendants[0].nationalId) && (
                      <Text>
                        <Text as="span" variant="small" color="dark400">
                          {formatDOB(
                            column.defendants[0].nationalId,
                            column.defendants[0].noNationalId,
                          )}
                        </Text>
                      </Text>
                    )
                  ) : (
                    <Text as="span" variant="small" color="dark400">
                      {`+ ${column.defendants.length - 1}`}
                    </Text>
                  )}
                </>
              ) : (
                <Text>-</Text>
              )}
            </td>
            <td>
              <Box component="span" display="flex" flexDirection="column">
                <Text as="span">
                  {displayCaseType(formatMessage, column.type, column.decision)}
                </Text>
                {column.parentCaseId && (
                  <Text as="span" variant="small" color="dark400">
                    Framlenging
                  </Text>
                )}
              </Box>
            </td>
            <td>
              <TagAppealState
                appealState={column.appealState}
                appealRulingDecision={column.appealRulingDecision}
              />
            </td>
            <td>
              {showingCompletedCases ? (
                <Text>
                  {isRestrictionCase(column.type)
                    ? `${formatDate(column.courtEndTime, 'd.M.y')} -
                      ${formatDate(column.validToDate, 'd.M.y')}`
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
          </tr>
        )
      })}
    </TableContainer>
  )
}

export default AppealCasesTable
