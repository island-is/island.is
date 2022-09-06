import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { ValueType } from 'react-select'

import {
  FormContentContainer,
  FormFooter,
  PageLayout,
} from '@island.is/judicial-system-web/src/components'
import {
  ReactSelectOption,
  RestrictionCaseCourtSubsections,
  Sections,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  Case,
  CaseState,
  CaseTransition,
  NotificationType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isReceptionAndAssignmentStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { titles } from '@island.is/judicial-system-web/messages'
import { Box, Select, Text, Tooltip, Option } from '@island.is/island-ui/core'
import CourtCaseNumber from '../../SharedComponents/CourtCaseNumber/CourtCaseNumber'
import * as constants from '@island.is/judicial-system/consts'

import { rcReceptionAndAssignment as strings } from './ReceptionAndAssignment.strings'
import SelectCourtOfficials from '@island.is/judicial-system-web/src/components/SelectCourtOfficials/SelectCourtOfficials'

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

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={
        RestrictionCaseCourtSubsections.RECEPTION_AND_ASSIGNMENT
      }
      isLoading={isLoadingWorkingCase || userLoading}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(
          titles.court.restrictionCases.receptionAndAssignment,
        )}
      />
      <FormContentContainer>
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
          previousUrl={constants.CASES_ROUTE}
          nextUrl={`${constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE}/${id}`}
          nextIsDisabled={!isReceptionAndAssignmentStepValidRC(workingCase)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default ReceptionAndAssignment
