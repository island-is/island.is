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

    if (theCase.id !== '') {
      if (theCase.caseFacts) {
        autofill('courtCaseFacts', theCase.caseFacts, theCase)
      }

      if (theCase.legalArguments) {
        autofill('courtLegalArguments', theCase.legalArguments, theCase)
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
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <RulingStepOneForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default RulingStepOne
