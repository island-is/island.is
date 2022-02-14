import React, { useContext, useEffect } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'

import RulingStepTwoForm from './RulingStepTwoForm'

const RulingStepTwo = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const { autofill } = useCase()

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (isCaseUpToDate) {
      if (
        isAcceptingCaseDecision(workingCase.decision) &&
        workingCase.demands
      ) {
        autofill('conclusion', workingCase.demands, workingCase)
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
      activeSubSection={JudgeSubsections.RULING_STEP_TWO}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <RulingStepTwoForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
        user={user}
      />
    </PageLayout>
  )
}

export default RulingStepTwo
