import React, { useContext, useEffect } from 'react'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { SessionArrangements } from '@island.is/judicial-system/types'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

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

  const { autofill, autofillSessionArrangements } = useCase()

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (isCaseUpToDate) {
      const theCase = workingCase

      if (theCase.requestedCourtDate) {
        autofill('courtDate', theCase.requestedCourtDate, theCase)
      }

      if (theCase.defenderName) {
        autofillSessionArrangements(
          'sessionArrangements',
          SessionArrangements.ALL_PRESENT,
          theCase,
        )
      }

      setWorkingCase(theCase)
    }
  }, [
    autofill,
    autofillSessionArrangements,
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
