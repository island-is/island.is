import React from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from '@apollo/client'

import { Box } from '@island.is/island-ui/core'
import { tables, titles } from '@island.is/judicial-system-web/messages'
import {
  AppealCasesTable,
  Logo,
  PageHeader,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import SharedPageLayout from '@island.is/judicial-system-web/src/components/SharedPageLayout/SharedPageLayout'
import {
  CaseAppealState,
  CaseListEntry,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { AppealedCasesQuery } from '@island.is/judicial-system-web/src/utils/mutations'

import { courtOfAppealCases as strings } from './Cases.strings'
import { logoContainer } from '../../Shared/Cases/Cases.css'

const CourtOfAppealCases = () => {
  const { formatMessage } = useIntl()
  const { getCaseToOpen } = useCase()

  const input = { appealState: ['RECEIVED', 'COMPLETED'] }

  const { data: appealedCases, loading } = useQuery<{
    cases: CaseListEntry[]
  }>(AppealedCasesQuery, {
    variables: { input },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const appealedCasesData = appealedCases?.cases || []

  return (
    <SharedPageLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={formatMessage(strings.appealedCasesTitle)} />
      <Box marginBottom={7}>
        <AppealCasesTable
          loading={loading}
          onRowClick={(id) => {
            getCaseToOpen(id)
          }}
          cases={
            appealedCasesData?.filter(
              (a) => a.appealState !== CaseAppealState.COMPLETED,
            ) || []
          }
        />
      </Box>
      <SectionHeading title={formatMessage(tables.completedCasesTitle)} />
      <AppealCasesTable
        loading={loading}
        onRowClick={(id) => {
          getCaseToOpen(id)
        }}
        cases={
          appealedCasesData?.filter(
            (a) => a.appealState === CaseAppealState.COMPLETED,
          ) || []
        }
        showingCompletedCases={true}
      />
    </SharedPageLayout>
  )
}

export default CourtOfAppealCases
