import React, { useContext } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { useRulingAutofill } from '@island.is/judicial-system-web/src/components/RulingInput/RulingInput'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'

import OverviewForm from './OverviewForm'

const Overview = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  useRulingAutofill(isCaseUpToDate, workingCase)

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.JUDGE_OVERVIEW}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader title={titles.court.investigationCases.overview} />
      <OverviewForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default Overview
