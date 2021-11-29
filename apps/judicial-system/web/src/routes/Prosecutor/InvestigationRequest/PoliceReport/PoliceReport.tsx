import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CaseData,
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import type { Case } from '@island.is/judicial-system/types'
import PoliceReportForm from './PoliceReportForm'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

const PoliceReport = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  useEffect(() => {
    document.title = 'Greinargerð - Réttarvörslugátt'
  }, [])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={ProsecutorSubsections.CUSTODY_REQUEST_STEP_FOUR}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PoliceReportForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default PoliceReport
