import React, { useContext, useEffect, useState } from 'react'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { PoliceCaseFile } from '@island.is/judicial-system/types'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { PoliceCaseFilesQuery } from '@island.is/judicial-system-web/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

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
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const [policeCaseFiles, setPoliceCaseFiles] = useState<PoliceCaseFilesData>()

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
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <CaseFilesForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
        policeCaseFiles={policeCaseFiles}
      />
    </PageLayout>
  )
}

export default CaseFiles
