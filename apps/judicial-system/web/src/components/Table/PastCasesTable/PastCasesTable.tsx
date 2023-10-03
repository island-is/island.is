import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import cn from 'classnames'

import { Box, Text } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  CaseListEntry,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import { core, tables } from '@island.is/judicial-system-web/messages'
import {
  TagAppealState,
  TagCaseState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CreatedDate,
  DefendantInfo,
  DurationDate,
  getDurationDate,
  SortButton,
  TableContainer,
  TableHeaderText,
} from '@island.is/judicial-system-web/src/components/Table'
import {
  useSortCases,
  useViewport,
} from '@island.is/judicial-system-web/src/utils/hooks'

import MobilePastCase from './MobilePastCase'
import * as styles from '../Table.css'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
  loading?: boolean
  testid?: string
}

const PastCasesTable: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { cases, onRowClick, loading = false, testid } = props
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  const { sortedData, requestSort, getClassNamesFor, isActiveColumn } =
    useSortCases('createdAt', 'descending', cases)

  const pastCasesData = useMemo(
    () =>
      cases.sort((a: CaseListEntry, b: CaseListEntry) =>
        b['created'].localeCompare(a['created']),
      ),
    [cases],
  )

  const { width } = useViewport()

  return width < theme.breakpoints.md ? (
    <>
      {pastCasesData.map((theCase) => (
        <Box marginTop={2} key={theCase.id}>
          <MobilePastCase
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
                theCase.rulingDate,
              )}
            />
          </MobilePastCase>
        </Box>
      ))}
    </>
  ) : (
    <TableContainer
      loading={loading}
      testid={testid}
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
          <th className={cn(styles.th, styles.largeColumn)}>
            <SortButton
              title={capitalize(formatMessage(tables.created, { suffix: 'i' }))}
              onClick={() => requestSort('createdAt')}
              sortAsc={getClassNamesFor('createdAt') === 'ascending'}
              sortDes={getClassNamesFor('createdAt') === 'descending'}
              isActive={isActiveColumn('createdAt')}
            />
          </th>
          <TableHeaderText title={formatMessage(tables.state)} />
          <TableHeaderText title={formatMessage(tables.duration)} />
        </>
      }
    >
      {sortedData.map((column) => {
        return (
          <tr
            className={styles.row}
            onClick={() => onRowClick(column.id)}
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
              <DefendantInfo defendants={column.defendants} />
            </td>
            <td>
              <ColumnCaseType
                type={column.type}
                decision={column?.decision}
                parentCaseId={column.parentCaseId}
              />
            </td>
            <td>
              <CreatedDate created={column.created} />
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
                <TagAppealState
                  appealState={column.appealState}
                  appealRulingDecision={column.appealRulingDecision}
                />
              )}
            </td>
            <td>
              <Text>
                {getDurationDate(
                  column.state,
                  column.validToDate,
                  column.initialRulingDate,
                  column.rulingDate,
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
