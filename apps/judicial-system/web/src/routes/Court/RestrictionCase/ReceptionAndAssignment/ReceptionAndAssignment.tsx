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

  const judges = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.JUDGE &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((judge: User) => {
      return { label: judge.name, value: judge.id, judge }
    })

  const registrars = (userData?.users ?? [])
    .filter(
      (user: User) =>
        user.role === UserRole.REGISTRAR &&
        user.institution?.id === workingCase?.court?.id,
    )
    .map((registrar: User) => {
      return { label: registrar.name, value: registrar.id, registrar }
    })

  const defaultJudge = judges?.find(
    (judge: Option) => judge.value === workingCase?.judge?.id,
  )

  const defaultRegistrar = registrars?.find(
    (registrar: Option) => registrar.value === workingCase?.registrar?.id,
  )

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
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(strings.setJudgeTitle)} `}
              <Tooltip text={formatMessage(strings.setJudgeTooltip)} />
            </Text>
          </Box>
          <Select
            name="judge"
            label="Veldu dómara"
            placeholder="Velja héraðsdómara"
            value={defaultJudge}
            options={judges}
            onChange={(selectedOption: ValueType<ReactSelectOption>) =>
              setJudge((selectedOption as JudgeSelectOption).judge)
            }
            required
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(strings.setRegistrarTitle)} `}
              <Tooltip text={formatMessage(strings.setRegistrarTooltip)} />
            </Text>
          </Box>
          <Select
            name="registrar"
            label="Veldu dómritara"
            placeholder="Velja dómritara"
            value={defaultRegistrar}
            options={registrars}
            onChange={(selectedOption: ValueType<ReactSelectOption>) => {
              if (selectedOption) {
                setRegistrar(
                  (selectedOption as RegistrarSelectOption).registrar,
                )
              } else {
                setRegistrar(undefined)
              }
            }}
            isClearable
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
