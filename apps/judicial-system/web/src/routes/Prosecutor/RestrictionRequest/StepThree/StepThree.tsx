import React, { useContext, useEffect } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'

import StepThreeForm from './StepThreeForm'

export const StepThree: React.FC = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  useEffect(() => {
    document.title = 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt'
  }, [])

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
        user={user}
      />
    </PageLayout>
  )
}

export default StepThree
