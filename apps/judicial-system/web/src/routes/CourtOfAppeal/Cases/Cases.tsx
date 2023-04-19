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
import { capitalize, formatDate } from '@island.is/judicial-system/formatters'
import {
  CaseAppealDecision,
  CaseDecision,
  CaseState,
} from '@island.is/judicial-system/types'
import { Tag, TagVariant } from '@island.is/island-ui/core'

import { logoContainer } from '../../Shared/Cases/Cases.css'
import { displayCaseType, getAppealDate } from '../../Shared/Cases/utils'
import { courtOfAppealCases as strings } from './Cases.strings'

const CourtOfAppealCases = () => {
  const { formatMessage } = useIntl()
  const { appealedCases } = useCase()

  const appealedCasesColumns = useMemo(() => {
    return [
      {
        Header: formatMessage(tables.caseNumber),
        accessor: 'courtCaseNumber',
        Cell: (row: {
          row: {
            original: { courtCaseNumber: string }
          }
        }) => {
          return row.row.original.courtCaseNumber
        },
      },
      {
        Header: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
        accessor: 'accusedName',
        Cell: (row: {
          row: {
            original: { defendants: Defendant[] }
          }
        }) => {
          return row.row.original.defendants[0].name
        },
      },
      {
        Header: formatMessage(tables.type),
        accessor: 'type',
        Cell: (row: {
          row: {
            original: {
              type: CaseType
              decision: CaseDecision
            }
          }
        }) => {
          const thisRow = row.row.original

          return displayCaseType(formatMessage, thisRow.type, thisRow.decision)
        },
      },
      {
        Header: formatMessage(tables.state),
        accessor: 'state',
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
        accessor: 'appealDate',
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
    return []
  }, [])

  const appealedCasesData = useMemo(() => appealedCases?.cases || ([] as any), [
    appealedCases,
  ])

  const completedCasesData = useMemo(
    () => appealedCases?.cases || ([] as any),
    [appealedCases],
  )

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={formatMessage(strings.appealedCasesTitle)} />
      <Table
        handleRowClick={() => console.log('asd')}
        columns={appealedCasesColumns}
        data={appealedCasesData ?? []}
      />
    </SharedPageLayout>
  )
}

export default CourtOfAppealCases
