import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'

import { AlertMessage, Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  isIndictmentCase,
  isInvestigationCase,
  isRestrictionCase,
} from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  SelectCourtOfficials,
} from '@island.is/judicial-system-web/src/components'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import { User } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  ReactSelectOption,
  UserData,
} from '@island.is/judicial-system-web/src/types'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UsersQuery } from '@island.is/judicial-system-web/src/utils/mutations'
import { isReceptionAndAssignmentStepValid } from '@island.is/judicial-system-web/src/utils/validate'

import CourtCaseNumber from '../CourtCaseNumber/CourtCaseNumber'
import { receptionAndAssignment as strings } from './ReceptionAndAssignment.strings'

type JudgeSelectOption = ReactSelectOption & { judge: User }
type RegistrarSelectOption = ReactSelectOption & { registrar: User }

const ReceptionAndAssignment = () => {
  const router = useRouter()
  const id = router.query.id
  const { formatMessage } = useIntl()
  const [courtCaseNumberEM, setCourtCaseNumberEM] = useState('')
  const [createCourtCaseSuccess, setCreateCourtCaseSuccess] =
    useState<boolean>(false)

  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)

  const { createCourtCase, isCreatingCourtCase, setAndSendCaseToServer } =
    useCase()

  const { data: userData, loading: userLoading } = useQuery<UserData>(
    UsersQuery,
    {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  )

  const handleCreateCourtCase = async (workingCase: Case) => {
    const courtCaseNumber = await createCourtCase(
      workingCase,
      setWorkingCase,
      setCourtCaseNumberEM,
    )

    if (courtCaseNumber !== '') {
      setCreateCourtCaseSuccess(true)
    }
  }

  const setJudge = (judge: User) => {
    if (workingCase) {
      setAndSendCaseToServer(
        [{ judgeId: judge.id, force: true }],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const setRegistrar = (registrar?: User) => {
    if (workingCase) {
      setAndSendCaseToServer(
        [{ registrarId: registrar?.id ?? null, force: true }],
        workingCase,
        setWorkingCase,
      )
    }
  }

  const getNextRoute = () => {
    return isRestrictionCase(workingCase.type)
      ? constants.RESTRICTION_CASE_COURT_OVERVIEW_ROUTE
      : isInvestigationCase(workingCase.type)
      ? constants.INVESTIGATION_CASE_OVERVIEW_ROUTE
      : constants.INDICTMENTS_SUBPOENA_ROUTE
  }

  const stepIsValid = isReceptionAndAssignmentStepValid(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [router, workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase || userLoading}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
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
          />
        </Box>
        <Box component="section" marginBottom={10}>
          <SelectCourtOfficials
            workingCase={workingCase}
            handleJudgeChange={(selectedOption) =>
              setJudge((selectedOption as JudgeSelectOption).judge)
            }
            handleRegistrarChange={(selectedOption) =>
              setRegistrar((selectedOption as RegistrarSelectOption)?.registrar)
            }
            users={userData?.users}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={
            isIndictmentCase(workingCase.type)
              ? `${constants.INDICTMENTS_COURT_OVERVIEW_ROUTE}/${id}`
              : constants.CASES_ROUTE
          }
          onNextButtonClick={() => handleNavigationTo(getNextRoute())}
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default ReceptionAndAssignment
