import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

import { CaseState } from '@island.is/judicial-system/types'
import type { Case, CaseType } from '@island.is/judicial-system/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'

import { StepOneForm } from './StepOneForm'
import {
  useCase,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  type?: CaseType
}

export const StepOne: React.FC<Props> = ({ type }: Props) => {
  const router = useRouter()
  const id = router.query.id
  const [workingCase, setWorkingCase] = useState<Case>()
  const { createCase, isCreatingCase } = useCase()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
    skip: !id,
  })

  const { defaultCourt, loading: institutionLoading } = useInstitution()

  const handleNextButtonClick = async (theCase: Case) => {
    const caseId =
      theCase.id === ''
        ? await createCase({ ...theCase, court: defaultCourt })
        : theCase.id

    router.push(`${Constants.STEP_TWO_ROUTE}/${caseId}`)
  }

  useEffect(() => {
    document.title = 'Sakborningur - Réttarvörslugátt'
  }, [])

  // Run this if id is in url, i.e. if user is opening an existing request.
  useEffect(() => {
    if (id && !workingCase && data?.case) {
      setWorkingCase(data?.case)
    } else if (!id && !workingCase && type !== undefined) {
      setWorkingCase({
        id: '',
        created: '',
        modified: '',
        type,
        state: CaseState.NEW,
        policeCaseNumber: '',
        accusedNationalId: '',
        accusedName: '',
        accusedAddress: '',
        defenderName: '',
        defenderEmail: '',
        sendRequestToDefender: false,
        accusedGender: undefined,
      })
    }
  }, [id, workingCase, setWorkingCase, data, type])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_ONE}
      isLoading={loading}
      notFound={id !== undefined && data?.case === undefined}
      isExtension={workingCase?.parentCase && true}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase && !institutionLoading && (
        <StepOneForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          loading={isCreatingCase}
          handleNextButtonClick={handleNextButtonClick}
        />
      )}
    </PageLayout>
  )
}

export default StepOne
