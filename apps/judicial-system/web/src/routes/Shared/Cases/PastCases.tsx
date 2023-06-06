import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import parseISO from 'date-fns/parseISO'
import { Row } from 'react-table'

import { theme } from '@island.is/island-ui/theme'
import { Box, Text } from '@island.is/island-ui/core'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseDecision,
  CaseState,
  Defendant,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import {
  TempCase as Case,
  TempCaseListEntry as CaseListEntry,
} from '@island.is/judicial-system-web/src/types'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDate,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import { useViewport } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  Table,
  TagAppealState,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import TagCaseState from '@island.is/judicial-system-web/src/components/TagCaseState/TagCaseState'
import BigTextSmallText from '@island.is/judicial-system-web/src/components/BigTextSmallText/BigTextSmallText'

import { displayCaseType } from './utils'
import * as styles from './Cases.css'
import MobileCase from './MobileCase'
import { cases as m } from './Cases.strings'

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

const sortDefendants = (rowA: Row<Case>, rowB: Row<Case>) => {
  const a =
    (rowA.original.defendants && rowA.original.defendants[0]?.name) || ''
  const b =
    (rowB.original.defendants && rowB.original.defendants[0]?.name) || ''

  return a.localeCompare(b, 'is', { ignorePunctuation: true })
}

const PastCases: React.FC<Props> = (props) => {
  const { cases, onRowClick } = props

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const pastCasesColumns = useMemo(() => {
    return [
      {
        Header: formatMessage(m.pastRequests.table.headers.caseNumber),
        accessor: 'courtCaseNumber' as keyof CaseListEntry,
        Cell: (row: {
          row: {
            original: {
              courtCaseNumber: string
              policeCaseNumbers: string[]
              appealCaseNumber?: string
            }
          }
        }) => {
          const theRow = row.row.original

          if (theRow.appealCaseNumber) {
            return (
              <Box display="flex" flexDirection="column">
                <Text as="span" variant="small">
                  {theRow.appealCaseNumber}
                </Text>
                <Text as="span" variant="small">
                  {theRow.courtCaseNumber}
                </Text>
                <Text as="span" variant="small">
                  {displayFirstPlusRemaining(theRow.policeCaseNumbers)}
                </Text>
              </Box>
            )
          }

          return (
            <BigTextSmallText
              bigText={theRow.courtCaseNumber}
              smallText={displayFirstPlusRemaining(theRow.policeCaseNumbers)}
            />
          )
        },
      },
      {
        Header: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
        accessor: 'accusedName' as keyof CaseListEntry,
        sortType: sortDefendants,
        Cell: (row: { row: { original: { defendants: Defendant[] } } }) => {
          const theCase = row.row.original

          return theCase.defendants && theCase.defendants.length > 0 ? (
            <BigTextSmallText
              bigText={theCase.defendants[0].name || ''}
              smallText={
                theCase.defendants.length === 1
                  ? formatDOB(
                      theCase.defendants[0].nationalId,
                      theCase.defendants[0].noNationalId,
                    )
                  : `+ ${theCase.defendants.length - 1}`
              }
            />
          ) : (
            <Text as="span">-</Text>
          )
        },
      },

      {
        Header: formatMessage(m.pastRequests.table.headers.type),
        accessor: 'type' as keyof CaseListEntry,
        Cell: (row: {
          row: {
            original: {
              type: CaseType
              decision: CaseDecision
              parentCaseId: string
            }
          }
        }) => {
          const thisRow = row.row.original

          return (
            <>
              <Box component="span" display="block">
                {displayCaseType(formatMessage, thisRow.type, thisRow.decision)}
              </Box>
              {row.row.original.parentCaseId && (
                <Text as="span" variant="small">
                  Framlenging
                </Text>
              )}
            </>
          )
        },
      },

      {
        Header: formatMessage(m.pastRequests.table.headers.state),
        accessor: 'state' as keyof CaseListEntry,
        disableSortBy: true,

        Cell: (row: {
          row: {
            original: {
              state: CaseState
              isValidToDateInThePast: boolean
              type: CaseType
              appealState?: CaseAppealState
              appealRulingDecision?: CaseAppealRulingDecision
            }
          }
        }) => {
          return (
            <>
              <Box marginRight={1} marginBottom={1}>
                <TagCaseState
                  caseState={row.row.original.state}
                  caseType={row.row.original.type}
                  isCourtRole={
                    user?.role ? isExtendedCourtRole(user.role) : false
                  }
                  isValidToDateInThePast={
                    row.row.original.isValidToDateInThePast
                  }
                />
              </Box>
              {row.row.original.appealState && (
                <TagAppealState
                  appealState={row.row.original.appealState}
                  appealRulingDecision={row.row.original.appealRulingDecision}
                />
              )}
            </>
          )
        },
      },
      {
        Header: formatMessage(tables.duration),
        accessor: 'rulingDate' as keyof CaseListEntry,
        disableSortBy: true,
        Cell: (row: {
          row: {
            original: {
              initialRulingDate: string
              rulingDate: string
              validToDate: string
              courtEndTime: string
              state: CaseState
            }
          }
        }) => {
          const initialRulingDate = row.row.original.initialRulingDate
          const validToDate = row.row.original.validToDate
          const courtEndTime = row.row.original.courtEndTime
          const state = row.row.original.state

          return getDurationDate(
            state,
            validToDate,
            initialRulingDate,
            courtEndTime,
          )
        },
      },
    ]
  }, [formatMessage, user?.role])

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
    <Table
      testid="pastCasesTable"
      columns={pastCasesColumns}
      data={pastCasesData ?? []}
      handleRowClick={onRowClick}
      className={styles.table}
    />
  )
}

export default PastCases
