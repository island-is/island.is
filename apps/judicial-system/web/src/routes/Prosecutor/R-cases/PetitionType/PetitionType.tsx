import React, { useEffect, useState } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { Case, CaseState, CaseType } from '@island.is/judicial-system/types'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { CaseQuery } from '@island.is/judicial-system-web/graphql/sharedGql'

const PetitionType = () => {
  const router = useRouter()
  const id = router.query.id

  const [workingCase, setWorkingCase] = useState<Case>()
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
    skip: !id,
  })

  useEffect(() => {
    document.title = 'Sakborningur - Réttarvörslugátt'
  }, [])

  // Run this if id is in url, i.e. if user is opening an existing request.
  useEffect(() => {
    if (id && !workingCase && data?.case) {
      setWorkingCase(data?.case)
    } else if (!id && !workingCase) {
      setWorkingCase({
        id: '',
        created: '',
        modified: '',
        type: CaseType.CUSTODY,
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
  }, [id, workingCase, setWorkingCase, data])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_PETITION_STEP_ONE}
      isLoading={loading}
      notFound={id !== undefined && data?.case === undefined}
      isExtension={workingCase?.parentCase && true}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase && <p>Hello</p>}
    </PageLayout>
  )
}

export default PetitionType
