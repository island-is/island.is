import React, { useContext, useEffect, useState } from 'react'
import { Case, Feature, PoliceCaseFile } from '@island.is/judicial-system/types'
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

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
}

export const StepFive: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()

  const router = useRouter()
  const id = router.query.id

  const { data, loading } = useQuery(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const { features } = useContext(FeatureContext)

  const { data: policeData, loading: policeDataLoading } = useQuery(
    PoliceCaseFilesQuery,
    {
      variables: { input: { caseId: id } },
      fetchPolicy: 'no-cache',
      skip: !features.includes(Feature.POLICE_CASE_FILES),
    },
  )

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Rannsóknargögn - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && resCase) {
      setWorkingCase(resCase)
    }
  }, [id, workingCase, setWorkingCase, resCase])

  useEffect(() => {
    if (policeData && policeData.policeCaseFiles) {
      setPoliceCaseFiles({
        files: policeData.policeCaseFiles,
        isLoading: false,
        hasError: false,
      })
    } else if (policeDataLoading) {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: true,
        hasError: false,
      })
    } else {
      setPoliceCaseFiles({
        files: policeData ? policeData.policeCaseFiles : [],
        isLoading: false,
        hasError: true,
      })
    }
  }, [policeData, policeDataLoading])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_FIVE}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <StepFiveForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          policeCaseFiles={policeCaseFiles}
        />
      ) : null}
    </PageLayout>
  )
}

export default StepFive
