import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  Case,
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isOverviewStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import ReceptionAndAssignmentForm from './ReceptionAndAssignmentForm'

const ReceptionAndAssignment = () => {
  const router = useRouter()
  const id = router.query.id

  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] = useState<boolean>(
    false,
  )

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const {
    createCourtCase,
    isCreatingCourtCase,
    transitionCase,
    isTransitioningCase,
    sendNotification,
  } = useCase()

  useEffect(() => {
    document.title = 'Móttaka - Réttarvörslugátt'
  }, [])

  const receiveCase = async (workingCase: Case, courtCaseNumber: string) => {
    if (workingCase.state === CaseState.SUBMITTED && !isTransitioningCase) {
      // Transition case from SUBMITTED to RECEIVED when courtCaseNumber is set
      const received = await transitionCase(
        { ...workingCase, courtCaseNumber },
        CaseTransition.RECEIVE,
        setWorkingCase,
      )

      if (received) {
        sendNotification(workingCase.id, NotificationType.RECEIVED_BY_COURT)
      }
    }
  }

  const handleCreateCourtCase = async (workingCase: Case) => {
    const courtCaseNumber = await createCourtCase(
      workingCase,
      setWorkingCase,
      setCourtCaseNumberEM,
    )

    if (courtCaseNumber !== '') {
      setCreateCourtCaseSuccess(true)
      receiveCase(workingCase, courtCaseNumber)
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.JUDGE_OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <ReceptionAndAssignmentForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        handleCreateCourtCase={handleCreateCourtCase}
        createCourtCaseSuccess={createCourtCaseSuccess}
        setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
        courtCaseNumberEM={courtCaseNumberEM}
        setCourtCaseNumberEM={setCourtCaseNumberEM}
        isCreatingCourtCase={isCreatingCourtCase}
        receiveCase={receiveCase}
      />
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={Constants.REQUEST_LIST_ROUTE}
          nextUrl={`${Constants.HEARING_ARRANGEMENTS_ROUTE}/${id}`}
          nextIsDisabled={!isOverviewStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default ReceptionAndAssignment
