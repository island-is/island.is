import React, { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'

import { PageLayout } from '@island.is/judicial-system-web/src/components'
import {
  JudgeSubsections,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

import HearingArrangementsForm from './HearingArrangementsForm'

const HearingArrangements = () => {
  const { autofill } = useCase()

  const { user } = useContext(UserContext)
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const { data: users, loading: userLoading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (workingCase.id !== '') {
      const theCase = workingCase

      if (theCase.requestedCourtDate) {
        autofill('courtDate', theCase.requestedCourtDate, theCase)
      }

      setWorkingCase(theCase)
    }
  }, [workingCase, setWorkingCase, autofill])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.HEARING_ARRANGEMENTS}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      {user && users && (
        <HearingArrangementsForm
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          isLoading={isLoadingWorkingCase || userLoading}
          users={users}
          user={user}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
