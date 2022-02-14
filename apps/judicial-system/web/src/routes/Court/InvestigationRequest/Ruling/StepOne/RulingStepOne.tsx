import React, { useContext, useEffect } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import RulingStepOneForm from './RulingStepOneForm'

const RulingStepOne = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const { autofill } = useCase()

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (isCaseUpToDate) {
      if (workingCase.caseFacts) {
        autofill('courtCaseFacts', workingCase.caseFacts, workingCase)
      }

      if (workingCase.legalArguments) {
        autofill('courtLegalArguments', workingCase.legalArguments, workingCase)
      }

      setWorkingCase(workingCase)
    }
  }, [autofill, isCaseUpToDate, setWorkingCase, workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <RulingStepOneForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
        isCaseUpToDate={isCaseUpToDate}
      />
    </PageLayout>
  )
}

export default RulingStepOne
