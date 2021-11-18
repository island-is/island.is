import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import {
  FormFooter,
  PageLayout,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isOverviewStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'
import OverviewForm from './OverviewForm'

export const JudgeOverview: React.FC = () => {
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState('')
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] = useState<boolean>(
    false,
  )

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const router = useRouter()
  const id = router.query.id

  const {
    createCourtCase,
    isCreatingCourtCase,
    transitionCase,
    isTransitioningCase,
    sendNotification,
  } = useCase()

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
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
      <OverviewForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        handleCreateCourtCase={handleCreateCourtCase}
        createCourtCaseSuccess={createCourtCaseSuccess}
        setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
        courtCaseNumberEM={courtCaseNumberEM}
        setCourtCaseNumberEM={setCourtCaseNumberEM}
        setIsDraftingConclusion={setIsDraftingConclusion}
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
      <DraftConclusionModal
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isDraftingConclusion={isDraftingConclusion}
        setIsDraftingConclusion={setIsDraftingConclusion}
      />
    </PageLayout>
  )
}

export default JudgeOverview
