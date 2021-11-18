import React, { useContext, useEffect, useState } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import StepThreeForm from './StepThreeForm'

export const StepThree: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const [
    requestedValidToDateIsValid,
    setRequestedValidToDateIsValid,
  ] = useState(false)

  useEffect(() => {
    document.title = 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt'
  }, [])

  // TODO: Remove? This does not make sense to me
  useEffect(() => {
    if (workingCase.id !== '') {
      setRequestedValidToDateIsValid(workingCase.requestedValidToDate != null)
    }
  }, [workingCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_THREE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <StepThreeForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        requestedValidToDateIsValid={requestedValidToDateIsValid}
        setRequestedValidToDateIsValid={setRequestedValidToDateIsValid}
      />
    </PageLayout>
  )
}

export default StepThree
