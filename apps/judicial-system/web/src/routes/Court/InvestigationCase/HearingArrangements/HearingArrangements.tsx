import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { SessionArrangements } from '@island.is/judicial-system/types'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages'

import HearingArrangementsForm from './HearingArrangementsForm'
const HearingArrangements = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { formatMessage } = useIntl()
  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)

  const { autofill } = useCase()

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      autofill(
        [
          {
            key: 'sessionArrangements',
            value: workingCase.defenderName
              ? SessionArrangements.ALL_PRESENT
              : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      setInitialAutoFillDone(true)
    }
  }, [
    autofill,
    initialAutoFillDone,
    isCaseUpToDate,
    setWorkingCase,
    workingCase,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(
          titles.court.investigationCases.hearingArrangements,
        )}
      />
      {user && (
        <HearingArrangementsForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          user={user}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
