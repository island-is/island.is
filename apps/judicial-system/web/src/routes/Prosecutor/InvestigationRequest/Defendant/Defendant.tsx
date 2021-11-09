import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
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

const Defendant = () => {
  const router = useRouter()
  const id = router.query.id

  const [workingCase, setWorkingCase] = useState<Case>()
  const { createCase, isCreatingCase } = useCase()
  const { defaultCourt } = useInstitution()

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
    skip: !id,
  })

  useEffect(() => {
    document.title = 'Rannsóknarheimild - Réttarvörslugátt'
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
        state: CaseState.NEW,
        description: '',
        policeCaseNumber: '',
        accusedNationalId: '',
        accusedName: '',
        accusedAddress: '',
        defenderName: '',
        defenderEmail: '',
        sendRequestToDefender: false,
        accusedGender: undefined,
      } as Case)
    }
  }, [id, workingCase, setWorkingCase, data])

  const handleNextButtonClick = async (theCase: Case) => {
    const caseId =
      theCase.id === ''
        ? await createCase({ ...theCase, court: defaultCourt })
        : theCase.id

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
      isLoading={loading || isCreatingCase}
      notFound={id !== undefined && data?.case === undefined}
      isExtension={workingCase?.parentCase && true}
    >
      {workingCase && (
        <DefendantForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          handleNextButtonClick={handleNextButtonClick}
          isLoading={isCreatingCase || loading}
        />
      )}
    </PageLayout>
  )
}

export default Defendant
