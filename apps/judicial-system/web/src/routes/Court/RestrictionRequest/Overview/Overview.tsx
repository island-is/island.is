import React, { useEffect, useState } from 'react'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import {
  FormFooter,
  PageLayout,
  Modal,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  Case,
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import ConclusionDraft from './Components/ConclusionDraft'
import { AnimatePresence } from 'framer-motion'
import OverviewForm from './OverviewForm'

export const JudgeOverview: React.FC = () => {
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState('')
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] = useState<boolean>(
    false,
  )

  const router = useRouter()
  const id = router.query.id

  const { createCourtCase, transitionCase, isTransitioningCase } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  if (workingCase?.state === CaseState.SUBMITTED && !isTransitioningCase) {
    transitionCase(workingCase, CaseTransition.RECEIVE, setWorkingCase)
  }

  useEffect(() => {
    document.title = 'Yfirlit kröfu - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      setWorkingCase(data.case)
    }
  }, [workingCase, setWorkingCase, data])

  const handleCreateCourtCase = (workingCase: Case) => {
    createCourtCase(workingCase, setWorkingCase, setCourtCaseNumberEM)

    if (courtCaseNumberEM === '') {
      setCreateCourtCaseSuccess(true)
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
          <AnimatePresence>
            {isDraftingConclusion && (
              <Modal
                title="Skrifa drög að niðurstöðu"
                text={
                  <ConclusionDraft
                    workingCase={workingCase}
                    setWorkingCase={setWorkingCase}
                  />
                }
                primaryButtonText="Loka glugga"
                handlePrimaryButtonClick={() => setIsDraftingConclusion(false)}
              />
            )}
          </AnimatePresence>
        </>
      ) : null}
    </PageLayout>
  )
}

export default JudgeOverview
