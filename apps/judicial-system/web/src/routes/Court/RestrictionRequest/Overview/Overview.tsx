import React, { useEffect, useState } from 'react'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  FormFooter,
  PageLayout,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import OverviewForm from './OverviewForm'
import DraftConclusionModal from '../../SharedComponents/DraftConclusionModal/DraftConclusionModal'

export const JudgeOverview: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState('')
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] = useState<boolean>(
    false,
  )

  const router = useRouter()
  const id = router.query.id

  const {
    createCourtCase,
    isCreatingCourtCase,
    transitionCase,
    isTransitioningCase,
    sendNotification,
  } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

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
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.JUDGE_OVERVIEW}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
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
              nextIsDisabled={isNextDisabled([
                {
                  value: workingCase.courtCaseNumber ?? '',
                  validations: ['empty'],
                },
              ])}
            />
          </FormContentContainer>
          <DraftConclusionModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isDraftingConclusion={isDraftingConclusion}
            setIsDraftingConclusion={setIsDraftingConclusion}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default JudgeOverview
