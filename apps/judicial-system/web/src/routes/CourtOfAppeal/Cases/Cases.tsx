import React from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import {
  Logo,
  PageHeader,
  SectionHeading,
  Table,
  TagAppealState,
} from '@island.is/judicial-system-web/src/components'
import { titles, tables, core } from '@island.is/judicial-system-web/messages'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  CaseAppealState,
  CaseType,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  capitalize,
  displayFirstPlusRemaining,
  formatDate,
  formatDOB,
} from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseAppealRulingDecision,
  CaseDecision,
  CaseState,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { Box, Text } from '@island.is/island-ui/core'
import BigTextSmallText from '@island.is/judicial-system-web/src/components/BigTextSmallText/BigTextSmallText'
import { AppealedCasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'

import { logoContainer } from '../../Shared/Cases/Cases.css'
import { displayCaseType } from '../../Shared/Cases/utils'
import { courtOfAppealCases as strings } from './Cases.strings'
import TableV from '@island.is/judicial-system-web/src/components/TableV2/Table'
import { useFilter } from '../../Shared/Cases/useFilter'
import ActiveTable from './Tables/ActiveTable'
import PastCasesTable from './Tables/PastCasesTable'

export interface AppealedCasesQueryResponse {
  courtCaseNumber: string
  defendants: Defendant[]
  type: CaseType
  decision: CaseDecision
  state: CaseState
  appealState: CaseAppealState
  appealRulingDecision: CaseAppealRulingDecision
  accusedAppealDecision: CaseAppealDecision
  prosecutorAppealDecision: CaseAppealDecision
  courtEndTime: string
  accusedPostponedAppealDate: string
  prosecutorPostponedAppealDate: string
  validToDate: string
  policeCaseNumbers: string[]
  parentCaseId: string
  appealedDate: string
}

const CourtOfAppealCases = () => {
  const { formatMessage } = useIntl()
  const { getCaseToOpen } = useCase()

  const input = { appealState: ['RECEIVED', 'COMPLETED'] }

  const { data: appealedCases } = useQuery<{
    cases: AppealedCasesQueryResponse[]
  }>(AppealedCasesQuery, { variables: { input }, fetchPolicy: 'no-cache' })

  const appealedCasesColumns = [
    {
      Header: formatMessage(tables.caseNumber),
      accessor: 'courtCaseNumber' as keyof AppealedCasesQueryResponse,
      disableSortBy: true,
      Cell: (row: {
        row: {
          original: {
            courtCaseNumber: string
            policeCaseNumbers: string[]
            appealCaseNumber?: string
          }
        }
      }) => {
        const thisRow = row.row.original

        if (thisRow.appealCaseNumber) {
          return (
            <Box display="flex" flexDirection="column">
              <Text as="span" variant="small">
                {thisRow.appealCaseNumber}
              </Text>
              <Text as="span" variant="small">
                {thisRow.courtCaseNumber}
              </Text>
              <Text as="span" variant="small">
                {displayFirstPlusRemaining(thisRow.policeCaseNumbers)}
              </Text>
            </Box>
          )
        }

        return (
          <BigTextSmallText
            bigText={thisRow.courtCaseNumber}
            smallText={displayFirstPlusRemaining(thisRow.policeCaseNumbers)}
          />
        )
      },
    },
    {
      Header: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
      accessor: 'defendants' as keyof AppealedCasesQueryResponse,
      Cell: (row: {
        row: {
          original: { defendants: Defendant[] }
        }
      }) => {
        const thisRow = row.row.original
        return thisRow.defendants && thisRow.defendants.length > 0 ? (
          <BigTextSmallText
            bigText={thisRow.defendants[0].name || ''}
            smallText={
              thisRow.defendants.length === 1
                ? formatDOB(
                    thisRow.defendants[0].nationalId,
                    thisRow.defendants[0].noNationalId,
                  )
                : `+ ${thisRow.defendants.length - 1}`
            }
          />
        ) : (
          <Text as="span">-</Text>
        )
      },
    },
    {
      Header: formatMessage(tables.type),
      accessor: 'type' as keyof AppealedCasesQueryResponse,
      disableSortBy: true,
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
          <BigTextSmallText
            bigText={displayCaseType(
              formatMessage,
              thisRow.type,
              thisRow.decision,
            )}
            smallText={
              thisRow.parentCaseId ? formatMessage(tables.extension) : undefined
            }
          />
        )
      },
    },
    {
      Header: formatMessage(tables.state),
      accessor: 'state' as keyof AppealedCasesQueryResponse,
      disableSortBy: true,
      Cell: (row: {
        row: {
          original: {
            state: CaseState
            appealState: CaseAppealState
            appealRulingDecision: CaseAppealRulingDecision
          }
        }
      }) => {
        const thisRow = row.row.original

        return (
          <TagAppealState
            appealState={thisRow.appealState}
            appealRulingDecision={thisRow.appealRulingDecision}
          />
        )
      },
    },
    {
      Header: formatMessage(tables.appealDate),
      accessor: 'appealedDate' as keyof AppealedCasesQueryResponse,
      Cell: (row: {
        row: {
          original: {
            appealedDate: string
          }
        }
      }) => {
        const thisRow = row.row.original
        const appealedDate = thisRow.appealedDate

        return appealedDate ? formatDate(appealedDate, 'd.M.y') : '-'
      },
    },
  ]

  const completedCasesColumns = [
    ...appealedCasesColumns.slice(0, -1),
    {
      Header: formatMessage(tables.duration),
      accessor: 'duration' as keyof AppealedCasesQueryResponse,
      Cell: (row: {
        row: {
          original: {
            courtEndTime: string
            validToDate: string
            type: CaseType
          }
        }
      }) => {
        const thisRow = row.row.original

        if (!isRestrictionCase(thisRow.type)) {
          return null
        }

        return `${formatDate(thisRow.courtEndTime, 'd.M.y')} - ${formatDate(
          thisRow.validToDate,
          'd.M.y',
        )}`
      },
    },
  ]

  const appealedCasesData = appealedCases?.cases || []

  console.log(appealedCases)
  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={formatMessage(strings.appealedCasesTitle)} />
      <Box marginBottom={7}>
        <ActiveTable
          onRowClick={(id) => {
            getCaseToOpen({
              variables: { input: { id } },
            })
          }}
          data={
            appealedCasesData?.filter(
              (a) => a.appealState !== CaseAppealState.COMPLETED,
            ) || []
          }
        />
      </Box>
      <SectionHeading title={formatMessage(tables.completedCasesTitle)} />

      <PastCasesTable
        onRowClick={(id) =>
          getCaseToOpen({
            variables: { input: { id } },
          })
        }
        data={
          appealedCasesData?.filter(
            (a) => a.appealState === CaseAppealState.COMPLETED,
          ) || []
        }
      />
    </SharedPageLayout>
  )
}

export default CourtOfAppealCases
