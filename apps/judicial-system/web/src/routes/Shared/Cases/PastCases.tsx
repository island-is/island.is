import React, { useContext, useMemo } from 'react'
import { useIntl } from 'react-intl'
import parseISO from 'date-fns/parseISO'

import { theme } from '@island.is/island-ui/theme'
import { Box, Text, Tag } from '@island.is/island-ui/core'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseListEntry,
  CaseState,
  CaseType,
  Defendant,
  isExtendedCourtRole,
} from '@island.is/judicial-system/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
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
import { core } from '@island.is/judicial-system-web/messages'

import {
  displayCaseType,
  getAppealDate,
  mapCaseStateToTagVariant,
} from './utils'
import * as styles from './Cases.css'
import MobileCase from './MobileCase'
import { cases as m } from './Cases.strings'

interface Props {
  cases: CaseListEntry[]
  onRowClick: (id: string) => void
  isHighCourtUser: boolean
}

export function getDurationDate(
  state: Case['state'],
  validToDate?: Case['validToDate'],
  initialRulingDate?: Case['initialRulingDate'],
  rulingDate?: Case['rulingDate'],
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
  } else if (rulingDate) {
    return `${formatDate(parseISO(rulingDate), 'd.M.y')} - ${formatDate(
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
      {`${formatMessage(m.pastRequests.table.headers.duration)} ${date}`}
    </Text>
  )
}

const PastCases: React.FC<Props> = (props) => {
  const { cases, onRowClick, isHighCourtUser } = props

  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()

  const sortableColumnIds = ['courtCaseNumber', 'accusedName', 'type']

  const pastCasesColumns = useMemo(() => {
    const prColumns = [
      {
        Header: formatMessage(m.pastRequests.table.headers.caseNumber),
        accessor: 'courtCaseNumber' as keyof CaseListEntry,
        Cell: (row: {
          row: {
            original: { courtCaseNumber: string; policeCaseNumbers: string[] }
          }
        }) => {
          return (
            <>
              <Box component="span" display="block">
                {row.row.original.courtCaseNumber}
              </Box>
              <Text
                as="span"
                variant="small"
                title={row.row.original.policeCaseNumbers.join(', ')}
              >
                {displayFirstPlusRemaining(row.row.original.policeCaseNumbers)}
              </Text>
            </>
          )
        },
      },
      {
        Header: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
        accessor: 'accusedName' as keyof CaseListEntry,
        Cell: (row: {
          row: { original: { accusedName: string; defendants: Defendant[] } }
        }) => {
          const theCase = row.row.original

          return theCase.defendants && theCase.defendants.length > 0 ? (
            <>
              <Box component="span" display="block">
                {theCase.defendants[0].name}
              </Box>
              <Text as="span" variant="small">
                {theCase.defendants.length === 1
                  ? formatDOB(
                      theCase.defendants[0].nationalId,
                      theCase.defendants[0].noNationalId,
                    )
                  : `+ ${theCase.defendants.length - 1}`}
              </Text>
            </>
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
        Header: formatMessage(m.pastRequests.table.headers.duration),
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
          const rulingDate = row.row.original.rulingDate
          const validToDate = row.row.original.validToDate
          const courtEndTime = row.row.original.courtEndTime
          const state = row.row.original.state

          return getDurationDate(
            state,
            validToDate,
            initialRulingDate,
            rulingDate,
            courtEndTime,
          )
        },
      },
    ]

    const highCourtPrColumns = {
      Header: 'Kært',
      accessor: 'accusedAppeal' as keyof CaseListEntry,
      disableSortBy: true,
      Cell: (row: {
        row: {
          original: {
            prosecutorAppealDecision: CaseAppealDecision
            accusedAppealDecision: CaseAppealDecision
            prosecutorPostponedAppealDate: string
            accusedPostponedAppealDate: string
            rulingDate: string
          }
        }
      }) => {
        const prosecutorAppealDecision =
          row.row.original.prosecutorAppealDecision
        const accusedAppealDecision = row.row.original.accusedAppealDecision

        const prosecutorPostponedAppealDate =
          row.row.original.prosecutorPostponedAppealDate
        const accusedPostponedAppealDate =
          row.row.original.accusedPostponedAppealDate
        const rulingDate = row.row.original.rulingDate

        return formatDate(
          getAppealDate(
            prosecutorAppealDecision,
            accusedAppealDecision,
            prosecutorPostponedAppealDate,
            accusedPostponedAppealDate,
            rulingDate,
          ),
          'd.M.y',
        )
      },
    }

    return isHighCourtUser
      ? [...prColumns.slice(0, -1), { ...highCourtPrColumns }]
      : prColumns
  }, [formatMessage, isHighCourtUser, user?.role])

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
                theCase.rulingDate,
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
