import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { CaseState } from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import DefendantForm from './DefendantForm'
import * as constants from '@island.is/judicial-system-web/src/utils/constants'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

const Defendant = () => {
  const router = useRouter()
  const id = router.query.id

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { createCase, isCreatingCase } = useCase()

  useEffect(() => {
    document.title = 'Rannsóknarheimild - Réttarvörslugátt'
  }, [])

  const handleNextButtonClick = async (theCase: Case) => {
    const caseId = theCase.id === '' ? await createCase(theCase) : theCase.id

    if (caseId) {
      router.push(`${constants.IC_HEARING_ARRANGEMENTS_ROUTE}/${caseId}`)
    }

    // TODO: Handle creation error
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_ONE}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isExtension={workingCase?.parentCase && true}
    >
      <DefendantForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        handleNextButtonClick={handleNextButtonClick}
        isLoading={isCreatingCase}
      />
    </PageLayout>
  )
}

export default Defendant
