import React, { useMemo } from 'react'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'

import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import { useIntl } from 'react-intl'
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages/Core'
import { useViewport } from '@island.is/judicial-system-web/src/utils/hooks'
import { theme } from '@island.is/island-ui/theme'
import useSortAppealCases from '@island.is/judicial-system-web/src/utils/hooks/useSort/useSortAppealCases'
import { AppealedCasesQueryResponse } from '@island.is/judicial-system-web/src/routes/CourtOfAppeal/Cases/Cases'
import { TagAppealState } from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  DefendantInfo,
  SortButton,
  TableContainer,
  TableHeaderText,
} from '@island.is/judicial-system-web/src/components/Table'

import * as styles from '../Table.css'
import { Defendant, isRestrictionCase } from '@island.is/judicial-system/types'
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
        <Box marginTop={2} key={theCase.id}>
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
                title={formatMessage(tables.appealDate)}
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
            key={column.id}
          >
            <td>
              <CourtCaseNumber
                courtCaseNumber={column.courtCaseNumber}
                policeCaseNumbers={column.policeCaseNumbers}
                appealCaseNumber={column.appealCaseNumber}
              />
            </td>
            <td className={cn(styles.td, styles.largeColumn)}>
              <DefendantInfo defendants={column.defendants as Defendant[]} />
            </td>
            <td>
              <ColumnCaseType
                type={column.type}
                decision={column.decision}
                parentCaseId={column.parentCaseId}
              />
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
