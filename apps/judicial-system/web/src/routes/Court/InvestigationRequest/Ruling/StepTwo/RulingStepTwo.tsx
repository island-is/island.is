import React, { useContext, useEffect } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import RulingStepTwoForm from './RulingStepTwoForm'

const RulingStepTwo = () => {
  const { autofill } = useCase()
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const theCase = workingCase
    if (workingCase.id !== '') {
      if (isAcceptingCaseDecision(theCase.decision) && theCase.demands) {
        autofill('conclusion', theCase.demands, theCase)
      }
      setWorkingCase(theCase)
    }
  }, [workingCase, setWorkingCase, autofill])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <RulingStepTwoForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default RulingStepTwo
