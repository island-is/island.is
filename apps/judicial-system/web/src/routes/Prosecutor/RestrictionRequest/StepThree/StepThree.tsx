import React, { useContext, useEffect, useState } from 'react'
import type { Case } from '@island.is/judicial-system/types'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import StepThreeForm from './StepThreeForm'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

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

  useEffect(() => {
    setRequestedValidToDateIsValid(workingCase.requestedValidToDate != null)
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
