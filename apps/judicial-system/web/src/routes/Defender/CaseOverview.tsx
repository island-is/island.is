import React, { useContext } from 'react'

import { Sections } from '@island.is/judicial-system-web/src/types'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import CaseOverviewForm from './CaseOverviewForm'

export const CaseOverview: React.FC = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } = useContext(
    FormContext,
  )

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <CaseOverviewForm workingCase={workingCase} />
    </PageLayout>
  )
}

export default CaseOverview
