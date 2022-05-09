import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import { icRuling as m, ruling } from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'

import RulingForm from './RulingForm'

const Ruling = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const { autofill } = useCase()
  const { formatMessage } = useIntl()

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      autofill(
        [
          {
            key: 'introduction',
            value: formatMessage(m.sections.introduction.autofill, {
              date: formatDate(workingCase.courtDate, 'PPP'),
            }),
          },
          {
            key: 'prosecutorDemands',
            value: workingCase.demands,
          },
          {
            key: 'courtCaseFacts',
            value: workingCase.caseFacts,
          },
          {
            key: 'courtLegalArguments',
            value: workingCase.legalArguments,
          },
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

      setInitialAutoFillDone(true)
    }

    if (
      (workingCase.conclusion === undefined ||
        workingCase.conclusion === null) &&
      isAcceptingCaseDecision(workingCase.decision) &&
      workingCase.demands
    ) {
      autofill(
        [{ key: 'conclusion', value: workingCase.demands }],
        workingCase,
        setWorkingCase,
      )
    }
  }, [
    isCaseUpToDate,
    autofill,
    workingCase,
    formatMessage,
    setWorkingCase,
    initialAutoFillDone,
    setInitialAutoFillDone,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.RULING}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.ruling)}
      />
      <RulingForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        isLoading={isLoadingWorkingCase}
      />
    </PageLayout>
  )
}

export default Ruling
