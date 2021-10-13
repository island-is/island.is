import React, { useContext, useEffect, useState } from 'react'
import { Case, Feature } from '@island.is/judicial-system/types'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { useQuery } from '@apollo/client'
import {
  CaseQuery,
  PoliceCaseFilesQuery,
} from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import { StepFiveForm } from './StepFiveForm'
import { FeatureContext } from '@island.is/judicial-system-web/src/shared-components/FeatureProvider/FeatureProvider'

export const StepFive: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  const router = useRouter()
  const id = router.query.id

  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { features } = useContext(FeatureContext)

  const { data: policeData } = useQuery(PoliceCaseFilesQuery, {
    variables: { input: { caseId: id } },
    fetchPolicy: 'no-cache',
    skip: !features.includes(Feature.POLICE_CASE_FILES),
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Rannsóknargögn - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && resCase) {
      setWorkingCase(resCase)
    }
  }, [id, workingCase, setWorkingCase, resCase])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_FIVE}
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <StepFiveForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          policeCaseFiles={policeData?.policeCaseFiles}
        />
      ) : null}
    </PageLayout>
  )
}

export default StepFive
