import React, { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  processing as m,
  titles,
} from '@island.is/judicial-system-web/messages'
import {
  CommentsInput,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseState,
  CaseTransition,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isTrafficViolationCase } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { isProcessingStepValidIndictments } from '@island.is/judicial-system-web/src/utils/validate'

import { ProsecutorSection, SelectCourt } from '../../components'

const Processing: React.FC = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { transitionCase } = useCase()
  const { formatMessage } = useIntl()
  const router = useRouter()

  const isTrafficViolationCaseCheck = isTrafficViolationCase(workingCase)

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
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} hideCourt />
        <ProsecutorSection />
        <Box component="section" marginBottom={5}>
          <SelectCourt />
        </Box>
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
