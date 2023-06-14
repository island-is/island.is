import React, { useContext, useMemo } from 'react'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'
import parseISO from 'date-fns/parseISO'

import * as styles from '../Table.css'
import { tables } from '@island.is/judicial-system-web/messages/Core/tables'
import { useIntl } from 'react-intl'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDOB,
  formatDate,
} from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages/Core'
import {
  Case,
  CaseListEntry,
  CaseState,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import {
  useSortCases,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { displayCaseType } from '@island.is/judicial-system-web/src/routes/Shared/Cases/utils'
import TagAppealState from '../../TagAppealState/TagAppealState'
import SortButton from '../SortButton/SortButton'
import TableHeaderText from '../TableHeaderText/TableHeaderText'
import TagCaseState from '@island.is/judicial-system-web/src/components/TagCaseState/TagCaseState'
import { UserContext } from '../../UserProvider/UserProvider'
import MobileCase from '../MobileCase/MobileCase'
import { theme } from '@island.is/island-ui/theme'
import TableContainer from '../TableContainer/TableContainer'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
}

export function getDurationDate(
  state: Case['state'],
  validToDate?: Case['validToDate'],
  initialRulingDate?: Case['initialRulingDate'],
  courtEndTime?: Case['courtEndTime'],
): string | null {
  if (
    [CaseState.REJECTED, CaseState.DISMISSED].includes(state) ||
    !validToDate
  ) {
    return null
  } else if (initialRulingDate) {
    return `${formatDate(parseISO(initialRulingDate), 'd.M.y')} - ${formatDate(
      parseISO(validToDate),
      'd.M.y',
    )}`
  } else if (courtEndTime) {
    return `${formatDate(parseISO(courtEndTime), 'd.M.y')} - ${formatDate(
      parseISO(validToDate),
      'd.M.y',
    )}`
  } else if (validToDate) {
    return formatDate(parseISO(validToDate), 'd.M.y') || null
  }
  return null
}

const DurationDate = ({ date }: { date: string | null }) => {
  const { formatMessage } = useIntl()
  if (!date) {
    return null
  }

  return (
    <Text fontWeight={'medium'} variant="small">
      {`${formatMessage(tables.duration)} ${date}`}
    </Text>
  )
}

const PastCasesTable: React.FC<Props> = (props) => {
  const { cases, onRowClick } = props
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { sortedData, requestSort, getClassNamesFor } = useSortCases(
    'createdAt',
    'descending',
    cases,
  )
  const pastCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        a['created'].localeCompare(b['created']),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {pastCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.id}>
          <MobileCase
            theCase={theCase}
            onClick={() => onRowClick(theCase.id)}
            isCourtRole={false}
          >
            <DurationDate
              key={`${theCase.id}-duration-date`}
              date={getDurationDate(
                theCase.state,
                theCase.validToDate,
                theCase.initialRulingDate,
                theCase.courtEndTime,
              )}
            />
          </MobileCase>
        </Box>
      ))}
    </>
  ) : (
    <TableContainer
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
          <TableHeaderText title={formatMessage(tables.duration)} />
        </>
      }
    >
      {sortedData.map((column) => {
        return (
          <tr className={styles.row} onClick={() => onRowClick(column.id)}>
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
              <Box marginRight={1} marginBottom={1}>
                <TagCaseState
                  caseState={column.state}
                  caseType={column.type}
                  isCourtRole={
                    user?.role ? isExtendedCourtRole(user.role) : false
                  }
                  isValidToDateInThePast={column.isValidToDateInThePast}
                />
              </Box>
              {column.appealState && (
                <TagAppealState appealState={column.appealState} />
              )}
            </td>
            <td>
              <Text fontWeight={'medium'} variant="small">
                {getDurationDate(
                  column.state,
                  column.validToDate,
                  column.initialRulingDate,
                  column.courtEndTime,
                )}
              </Text>
            </td>
          </tr>
        )
      })}
    </TableContainer>
  )
}

export default PastCasesTable
