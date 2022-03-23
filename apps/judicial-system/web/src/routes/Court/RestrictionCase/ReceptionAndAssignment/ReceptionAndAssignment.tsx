import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  Case,
  CaseState,
  CaseTransition,
  NotificationType,
} from '@island.is/judicial-system/types'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isReceptionAndAssignmentStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages/Core/titles'
import * as Constants from '@island.is/judicial-system/consts'

import ReceptionAndAssignmentForm from './ReceptionAndAssignmentForm'

const ReceptionAndAssignment = () => {
  const router = useRouter()
  const id = router.query.id
  const { formatMessage } = useIntl()
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] = useState<boolean>(
    false,
  )

  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
  } = useContext(FormContext)

  const {
    createCourtCase,
    isCreatingCourtCase,
    transitionCase,
    isTransitioningCase,
    sendNotification,
  } = useCase()

  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UsersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const receiveCase = async (workingCase: Case, courtCaseNumber: string) => {
    if (workingCase.state === CaseState.SUBMITTED && !isTransitioningCase) {
      // Transition case from SUBMITTED to RECEIVED when courtCaseNumber is set
      const received = await transitionCase(
        { ...workingCase, courtCaseNumber },
        CaseTransition.RECEIVE,
        setWorkingCase,
      )

      if (received) {
        sendNotification(workingCase.id, NotificationType.RECEIVED_BY_COURT)
      }
    }
  }

  const handleCreateCourtCase = async (workingCase: Case) => {
    const courtCaseNumber = await createCourtCase(
      workingCase,
      setWorkingCase,
      setCourtCaseNumberEM,
    )

    if (courtCaseNumber !== '') {
      setCreateCourtCaseSuccess(true)
      receiveCase(workingCase, courtCaseNumber)
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.RECEPTION_AND_ASSIGNMENT}
      isLoading={isLoadingWorkingCase || userLoading}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(
          titles.court.restrictionCases.receptionAndAssignment,
        )}
      />
      <ReceptionAndAssignmentForm
        workingCase={workingCase}
        setWorkingCase={setWorkingCase}
        handleCreateCourtCase={handleCreateCourtCase}
        createCourtCaseSuccess={createCourtCaseSuccess}
        setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
        courtCaseNumberEM={courtCaseNumberEM}
        setCourtCaseNumberEM={setCourtCaseNumberEM}
        isCreatingCourtCase={isCreatingCourtCase}
        receiveCase={receiveCase}
        users={userData?.users}
      />
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={Constants.CASE_LIST_ROUTE}
          nextUrl={`${Constants.OVERVIEW_ROUTE}/${id}`}
          nextIsDisabled={!isReceptionAndAssignmentStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default ReceptionAndAssignment
