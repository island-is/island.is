import React, { useEffect, useState } from 'react'
import { Case, PoliceCaseFile } from '@island.is/judicial-system/types'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components'
import { useQuery } from '@apollo/client'
import {
  CaseQuery,
  PoliceCaseFilesQuery,
} from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useRouter } from 'next/router'
import CaseFilesForm from './CaseFilesForm'

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorMessage?: string
}

export const CaseFiles: React.FC = () => {
  const router = useRouter()
  const id = router.query.id
  const [workingCase, setWorkingCase] = useState<Case>()
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })
  const {
    data: policeData,
    loading: policeDataLoading,
    error: policeDataError,
  } = useQuery(PoliceCaseFilesQuery, {
    variables: { input: { caseId: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Rannsóknargögn - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (id && !workingCase && data) {
      setWorkingCase(data.case)
    }
  }, [id, workingCase, setWorkingCase, data])

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
        errorMessage: policeDataError?.message,
      })
    }
  }, [policeData, policeDataLoading, policeDataError])

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
        <CaseFilesForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          isLoading={loading}
          policeCaseFiles={policeCaseFiles}
        />
      ) : null}
    </PageLayout>
  )
}

export default CaseFiles
