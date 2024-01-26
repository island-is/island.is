import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, RadioButton, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
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
import {
  CaseState,
  CaseTransition,
  Institution,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
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
              title={formatMessage(strings.defendantPlea)}
              required
            />
            <BlueBox>
              <Text variant="h4" marginBottom={3}>
                {formatMessage(strings.defendantName, {
                  name: workingCase.defendants[0].name,
                })}
              </Text>
              <div className={styles.grid}>
                <RadioButton
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.pleaGuilty)}
                />
                <RadioButton
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.pleaNotGuilty)}
                />
                <RadioButton
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.pleaNoPlea)}
                />
              </div>
            </BlueBox>
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
