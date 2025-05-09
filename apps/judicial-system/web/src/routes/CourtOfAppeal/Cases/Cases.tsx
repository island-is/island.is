import { useIntl } from 'react-intl'

import { Box } from '@island.is/island-ui/core'
import { tables, titles } from '@island.is/judicial-system-web/messages'
import {
  CasesLayout,
  Logo,
  PageHeader,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { AppealCasesTable } from '@island.is/judicial-system-web/src/components/Table'
import { CaseAppealState } from '@island.is/judicial-system-web/src/graphql/schema'

import { useAppealedCasesQuery } from './appealdCases.generated'
import { courtOfAppealCases as strings } from './Cases.strings'
import { logoContainer } from '../../Shared/Cases/Cases.css'

const CourtOfAppealCases = () => {
  const { formatMessage } = useIntl()

  const input = {
    appealState: [
      CaseAppealState.RECEIVED,
      CaseAppealState.COMPLETED,
      CaseAppealState.WITHDRAWN,
    ],
  }

  const { data: appealedCases, loading } = useAppealedCasesQuery({
    variables: { input },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  const appealedCasesData = appealedCases?.cases || []

  return (
    <CasesLayout>
      <PageHeader title={formatMessage(titles.shared.cases)} />
      <div className={logoContainer}>
        <Logo />
      </div>
      <SectionHeading title={formatMessage(strings.appealedCasesTitle)} />
      <Box marginBottom={7}>
        <AppealCasesTable
          loading={loading}
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
        cases={
          appealedCasesData?.filter(
            (a) => a.appealState === CaseAppealState.COMPLETED,
          ) || []
        }
        showingCompletedCases={true}
      />
    </CasesLayout>
  )
}

export default CourtOfAppealCases
