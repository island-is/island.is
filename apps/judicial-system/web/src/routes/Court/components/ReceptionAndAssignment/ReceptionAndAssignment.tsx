import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { ValueType } from 'react-select'

import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  SelectCourtOfficials,
} from '@island.is/judicial-system-web/src/components'
import {
  IndictmentsCourtSubsections,
  ReactSelectOption,
  RestrictionCaseCourtSubsections,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import {
  Case,
  CaseState,
  CaseTransition,
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
  NotificationType,
  User,
} from '@island.is/judicial-system/types'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import { titles } from '@island.is/judicial-system-web/messages'
import { isReceptionAndAssignmentStepValid } from '@island.is/judicial-system-web/src/utils/validate'
import * as constants from '@island.is/judicial-system/consts'

import { receptionAndAssignment as strings } from './ReceptionAndAssignment.strings'
import CourtCaseNumber from '../CourtCaseNumber/CourtCaseNumber'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type RegistrarSelectOption = ReactSelectOption & { registrar: User }

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
    setAndSendToServer,
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

  const setJudge = (judge: User) => {
    if (workingCase) {
      setAndSendToServer(
        [{ judgeId: judge.id, force: true }],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const setRegistrar = (registrar?: User) => {
    if (workingCase) {
      setAndSendToServer(
        [{ registrarId: registrar?.id ?? null, force: true }],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const getNextRoute = () => {
    return isRestrictionCase(workingCase.type)
      ? `${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`
      : isInvestigationCase(workingCase.type)
      ? `${constants.INVESTIGATION_CASE_OVERVIEW_ROUTE}/${id}`
      : `${constants.INDICTMENTS_SUBPOENA_ROUTE}/${id}`
  }

  const getActiveSubSection = () => {
    return isIndictmentCase(workingCase.type)
      ? IndictmentsCourtSubsections.RECEPTION_AND_ASSIGNMENT
      : // Restriction cases and investigation cases have the same subsections
        RestrictionCaseCourtSubsections.RECEPTION_AND_ASSIGNMENT
  }

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={Sections.JUDGE}
      activeSubSection={getActiveSubSection()}
      isLoading={isLoadingWorkingCase || userLoading}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.shared.receptionAndAssignment)}
      />
      <FormContentContainer>
        {isIndictmentCase(workingCase.type) && workingCase.comments && (
          <Box marginBottom={5}>
            <AlertMessage message={workingCase.comments} type="warning" />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={6}>
          <CourtCaseNumber
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            courtCaseNumberEM={courtCaseNumberEM}
            setCourtCaseNumberEM={setCourtCaseNumberEM}
            createCourtCaseSuccess={createCourtCaseSuccess}
            setCreateCourtCaseSuccess={setCreateCourtCaseSuccess}
            handleCreateCourtCase={handleCreateCourtCase}
            isCreatingCourtCase={isCreatingCourtCase}
            receiveCase={receiveCase}
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SelectCourtOfficials
            workingCase={workingCase}
            handleJudgeChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setJudge((selectedOption as JudgeSelectOption).judge)
            }
            handleRegistrarChange={(
              selectedOption: ValueType<ReactSelectOption>,
            ) =>
              setRegistrar((selectedOption as RegistrarSelectOption)?.registrar)
            }
            users={userData?.users}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`}
          nextUrl={getNextRoute()}
          nextIsDisabled={!isReceptionAndAssignmentStepValid(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default ReceptionAndAssignment
