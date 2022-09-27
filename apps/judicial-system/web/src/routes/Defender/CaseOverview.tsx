import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { Sections } from '@island.is/judicial-system-web/src/types'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages'
import { completedCaseStates } from '@island.is/judicial-system/types'

import CaseOverviewForm from './CaseOverviewForm'

export const CaseOverview: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  const { formatMessage } = useIntl()

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        completedCaseStates.includes(workingCase.state)
          ? 2
          : workingCase.parentCase
          ? Sections.JUDGE_EXTENSION
          : Sections.JUDGE
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={formatMessage(titles.defender.caseOverview)} />
      <CaseOverviewForm workingCase={workingCase} />
    </PageLayout>
  )
}

export default CaseOverview
