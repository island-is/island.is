import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import parseISO from 'date-fns/parseISO'

import { theme } from '@island.is/island-ui/theme'
import { Box, Text, Tag } from '@island.is/island-ui/core'
import {
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
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { CaseType } from '@island.is/judicial-system-web/src/graphql/schema'
import BigTextSmallText from '@island.is/judicial-system-web/src/components/BigTextSmallText/BigTextSmallText'

import { displayCaseType, mapCaseStateToTagVariant } from './utils'
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

const PastCases: React.FC<Props> = (props) => {
  const { cases, onRowClick } = props

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const sortableColumnIds = ['courtCaseNumber', 'accusedName', 'type']

  const pastCasesColumns = useMemo(() => {
    return [
      {
        Header: formatMessage(m.pastRequests.table.headers.caseNumber),
        accessor: 'courtCaseNumber' as keyof CaseListEntry,
        Cell: (row: {
          row: {
            original: { courtCaseNumber: string; policeCaseNumbers: string[] }
          }
        }) => {
          const theRow = row.row.original
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
            }
          }
        }) => {
          const tagVariant = mapCaseStateToTagVariant(
            formatMessage,
            row.row.original.state,
            user?.role ? isExtendedCourtRole(user.role) : false,
            row.row.original.type,
            row.row.original.isValidToDateInThePast,
          )

          return (
            <Tag variant={tagVariant.color} outlined disabled>
              {tagVariant.text}
            </Tag>
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
      sortableColumnIds={sortableColumnIds}
    />
  )
}

export default PastCases
