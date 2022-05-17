import React, { useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { ruling, titles } from '@island.is/judicial-system-web/messages'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'

import OverviewForm from './OverviewForm'

const Overview = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { autofill } = useCase()

  useEffect(() => {
    if (isCaseUpToDate) {
      autofill(
        [
          {
            key: 'ruling',
            value: !workingCase.parentCase
              ? `\n${formatMessage(ruling.autofill, {
                  judgeName: workingCase.judge?.name,
                })}`
              : isAcceptingCaseDecision(workingCase.decision)
              ? workingCase.parentCase.ruling
              : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [autofill, formatMessage, isCaseUpToDate, setWorkingCase, workingCase])

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
      <PageHeader
        title={formatMessage(titles.court.investigationCases.overview)}
      />
      <OverviewForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default Overview
