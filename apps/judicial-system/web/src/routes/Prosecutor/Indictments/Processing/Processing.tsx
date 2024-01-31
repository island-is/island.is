import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { DefendantPlea } from '@island.is/judicial-system/types'
import { titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CommentsInput,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import RequiredStar from '@island.is/judicial-system-web/src/components/RequiredStar/RequiredStar'
import {
  CaseState,
  CaseTransition,
  Institution,
  UpdateDefendantInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDefendants,
  useInstitution,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isTrafficViolationCase } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { ProsecutorSection, SelectCourt } from '../../components'
import { strings } from './processing.strings'
import * as styles from './Processing.css'

const Processing: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { setAndSendCaseToServer, transitionCase } = useCase()
  const { formatMessage } = useIntl()
  const { districtCourts } = useInstitution()
  const { updateDefendant, updateDefendantState } = useDefendants()
  const router = useRouter()
  const isTrafficViolationCaseCheck = isTrafficViolationCase(workingCase)

  const handleCourtChange = (court: Institution) => {
    if (workingCase) {
      setAndSendCaseToServer(
        [
          {
            courtId: court.id,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      return true
    }

    return false
  }

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      if (workingCase.state === CaseState.NEW) {
        await transitionCase(
          workingCase.id,
          CaseTransition.OPEN,
          setWorkingCase,
        )
      }

      router.push(`${destination}/${workingCase.id}`)
    },
    [router, setWorkingCase, transitionCase, workingCase],
  )
  const stepIsValid = isProcessingStepValidIndictments(workingCase)

  const handleUpdateDefendant = useCallback(
    (updatedDefendant: UpdateDefendantInput) => {
      updateDefendantState(updatedDefendant, setWorkingCase)

      if (workingCase.id) {
        updateDefendant(updatedDefendant)
      }
    },
    [updateDefendantState, setWorkingCase, workingCase.id, updateDefendant],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      onNavigationTo={handleNavigationTo}
      isValid={stepIsValid}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.indictments.processing)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(strings.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
        <ProsecutorSection />
        <Box component="section" marginBottom={5}>
          <SelectCourt
            workingCase={workingCase}
            courts={districtCourts}
            onChange={handleCourtChange}
          />
        </Box>
        {workingCase.defendants && (
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.defendantPlea, {
                defendantCount: workingCase.defendants.length,
              })}
            />
            {workingCase.defendants.map((defendant) => (
              <Box marginBottom={2}>
                <BlueBox>
                  <Text variant="h4" marginBottom={3}>
                    {`${formatMessage(strings.defendantName, {
                      name: defendant.name,
                    })} `}
                    <RequiredStar />
                  </Text>
                  <div className={styles.grid}>
                    <RadioButton
                      id={`defendant-${defendant.id}-plea-decision-guilty`}
                      name={`defendant-${defendant.id}-plea-decision`}
                      checked={defendant.defendantPlea === DefendantPlea.GUILTY}
                      onChange={() => {
                        handleUpdateDefendant({
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          defendantPlea: DefendantPlea.GUILTY,
                        })
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.pleaGuilty)}
                    />
                    <RadioButton
                      id={`defendant-${defendant.id}-plea-decision-not-guilty`}
                      name={`defendant-${defendant.id}-plea-decision`}
                      checked={
                        defendant.defendantPlea === DefendantPlea.NOT_GUILTY
                      }
                      onChange={() => {
                        handleUpdateDefendant({
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          defendantPlea: DefendantPlea.NOT_GUILTY,
                        })
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.pleaNotGuilty)}
                    />
                    <RadioButton
                      id={`defendant-${defendant.id}-plea-decision-no-plea`}
                      name={`defendant-${defendant.id}-plea-decision`}
                      checked={
                        defendant.defendantPlea === DefendantPlea.NO_PLEA
                      }
                      onChange={() => {
                        handleUpdateDefendant({
                          defendantId: defendant.id,
                          caseId: workingCase.id,
                          defendantPlea: DefendantPlea.NO_PLEA,
                        })
                      }}
                      large
                      backgroundColor="white"
                      label={formatMessage(strings.pleaNoPlea)}
                    />
                  </div>
                </BlueBox>
              </Box>
            ))}
          </Box>
        )}
        <Box component="section" marginBottom={10}>
          <CommentsInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_CASE_FILE_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          onNextButtonClick={() =>
            handleNavigationTo(
              isTrafficViolationCaseCheck
                ? constants.INDICTMENTS_TRAFFIC_VIOLATION_ROUTE
                : constants.INDICTMENTS_CASE_FILES_ROUTE,
            )
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Processing
