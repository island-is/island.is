import React, { useEffect, useState } from 'react'
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

export const StepThree: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const router = useRouter()
  const id = router.query.id

  const [
    requestedValidToDateIsValid,
    setRequestedValidToDateIsValid,
  ] = useState(false)

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && resCase) {
      setRequestedValidToDateIsValid(resCase.requestedValidToDate != null)

      setWorkingCase(resCase)
    }
  }, [workingCase, setWorkingCase, resCase])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_THREE}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <StepThreeForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          requestedValidToDateIsValid={requestedValidToDateIsValid}
          setRequestedValidToDateIsValid={setRequestedValidToDateIsValid}
        />
      ) : null}
    </PageLayout>
  )
}

export default StepThree
