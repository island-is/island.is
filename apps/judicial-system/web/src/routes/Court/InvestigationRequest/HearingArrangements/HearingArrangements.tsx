import React, { useContext, useEffect, useState } from 'react'
import { PageLayout } from '@island.is/judicial-system-web/src/components'
import { Case, SessionArrangements } from '@island.is/judicial-system/types'
import {
  CaseData,
  JudgeSubsections,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import { useRouter } from 'next/router'
import HearingArrangementsForm from './HearingArrangementsForm'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'

const HearingArrangements = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)

  const { autofill } = useCase()

  const { data: users, loading: userLoading } = useQuery<UserData>(UsersQuery, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  useEffect(() => {
    document.title = 'Fyrirtaka - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const theCase = workingCase

    if (theCase.requestedCourtDate) {
      autofill('courtDate', theCase.requestedCourtDate, theCase)
    }

    if (theCase.defenderName) {
      autofill('sessionArrangements', SessionArrangements.ALL_PRESENT, theCase)
    }

    setWorkingCase(theCase)
  }, [])

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
          isLoading={userLoading}
          users={users}
          user={user}
        />
      )}
    </PageLayout>
  )
}

export default HearingArrangements
