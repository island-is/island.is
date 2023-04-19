import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'

import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import {
  Logo,
  PageHeader,
  SectionHeading,
  Table,
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
  CaseDecision,
  CaseState,
} from '@island.is/judicial-system/types'
import { Box, Tag, TagVariant, Text } from '@island.is/island-ui/core'
import { AppealedCasesQueryResponse } from '@island.is/judicial-system-web/src/utils/hooks/useCase'

import { logoContainer } from '../../Shared/Cases/Cases.css'
import { displayCaseType, getAppealDate } from '../../Shared/Cases/utils'
import { courtOfAppealCases as strings } from './Cases.strings'
import DefendantInfo from '@island.is/judicial-system-web/src/components/CasesTableComponents/DefendantInfo/DefendantInfo'
import BigTextSmallText from '@island.is/judicial-system-web/src/components/BigTextSmallText/BigTextSmallText'

const CourtOfAppealCases = () => {
  const { formatMessage } = useIntl()
  const { appealedCases, getCaseToOpen } = useCase()

  const appealedCasesColumns = useMemo(() => {
    return [
      {
        Header: formatMessage(tables.caseNumber),
        accessor: 'courtCaseNumber' as keyof AppealedCasesQueryResponse,
        Cell: (row: {
          row: {
            original: { courtCaseNumber: string; policeCaseNumbers: string[] }
          }
        }) => {
          const thisRow = row.row.original

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
        accessor: 'accusedName' as keyof AppealedCasesQueryResponse,
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
                thisRow.parentCaseId
                  ? formatMessage(tables.extension)
                  : undefined
              }
            />
          )
        },
      },
      {
        Header: formatMessage(tables.state),
        accessor: 'state' as keyof AppealedCasesQueryResponse,
        Cell: (row: {
          row: {
            original: {
              state: CaseState
              appealState: CaseAppealState
            }
          }
        }) => {
          const thisRow = row.row.original
          const tagVariant: { color: TagVariant; text: string } =
            thisRow.appealState === CaseAppealState.Appealed
              ? {
                  color: 'purple',
                  text: formatMessage(tables.newTag),
                }
              : { color: 'darkerBlue', text: formatMessage(tables.receivedTag) }

          return (
            <Tag variant={tagVariant.color} outlined disabled>
              {tagVariant.text}
            </Tag>
          )
        },
      },
      {
        Header: formatMessage(tables.appealDate),
        accessor: 'appealDate' as keyof AppealedCasesQueryResponse,
        Cell: (row: {
          row: {
            original: {
              prosecutorAppealDecision: CaseAppealDecision
              accusedAppealDecision: CaseAppealDecision
              prosecutorPostponedAppealDate: string
              accusedPostponedAppealDate: string
              courtEndTime: string
            }
          }
        }) => {
          const thisRow = row.row.original
          const prosecutorAppealDecision = thisRow.prosecutorAppealDecision
          const accusedAppealDecision = thisRow.accusedAppealDecision
          const prosecutorPostponedAppealDate =
            thisRow.prosecutorPostponedAppealDate
          const accusedPostponedAppealDate = thisRow.accusedPostponedAppealDate
          const rulingDate = thisRow.courtEndTime

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
      },
    ]
  }, [formatMessage])

  const completedCasesColumns = useMemo(() => {
    return [
      ...appealedCasesColumns.slice(0, -1),
      {
        Header: formatMessage(tables.duration),
        accessor: 'duration' as keyof AppealedCasesQueryResponse,
        Cell: (row: {
          row: {
            original: { courtEndTime: string; validToDate: string }
          }
        }) => {
          const thisRow = row.row.original

          return `${formatDate(thisRow.courtEndTime, 'd.M.y')} - ${formatDate(
            thisRow.validToDate,
            'd.M.y',
          )}`
        },
      },
    ]
  }, [])

  const appealedCasesData = useMemo(() => appealedCases?.cases, [appealedCases])

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={formatMessage(strings.appealedCasesTitle)} />
      <Box marginBottom={7}>
        <Table
          handleRowClick={(id) =>
            getCaseToOpen({
              variables: { input: { id } },
            })
          }
          columns={appealedCasesColumns}
          data={
            appealedCasesData?.filter(
              (a) => a.appealState !== CaseAppealState.Completed,
            ) || []
          }
        />
      </Box>
      <SectionHeading title={formatMessage(tables.completedCasesTitle)} />
      <Table
        handleRowClick={(id) =>
          getCaseToOpen({
            variables: { input: { id } },
          })
        }
        columns={completedCasesColumns}
        data={
          appealedCasesData?.filter(
            (a) => a.appealState === CaseAppealState.Completed,
          ) || []
        }
      />
    </SharedPageLayout>
  )
}

export default CourtOfAppealCases
