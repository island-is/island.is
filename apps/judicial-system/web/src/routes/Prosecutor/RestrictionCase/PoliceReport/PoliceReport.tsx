import React, { useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { rcReportForm, titles } from '@island.is/judicial-system-web/messages'
import {
  FormContentContainer,
  FormContext,
  FormFooter,
  PageLayout,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import CommentsInput from '@island.is/judicial-system-web/src/components/CommentsInput/CommentsInput'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import useDeb from '@island.is/judicial-system-web/src/utils/hooks/useDeb'
import { isPoliceReportStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'

export const PoliceReport: React.FC<React.PropsWithChildren<unknown>> = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const router = useRouter()
  const [demandsErrorMessage, setDemandsErrorMessage] = useState<string>('')
  const [caseFactsErrorMessage, setCaseFactsErrorMessage] = useState<string>('')
  const [legalArgumentsErrorMessage, setLegalArgumentsErrorMessage] =
    useState<string>('')

  const { formatMessage } = useIntl()

  const { updateCase } = useCase()

  useDeb(workingCase, ['demands', 'caseFacts', 'legalArguments'])

  const stepIsValid = isPoliceReportStepValidRC(workingCase)
  const handleNavigationTo = (destination: string) =>
    router.push(`${destination}/${workingCase.id}`)

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.prosecutor.restrictionCases.policeReport)}
      />
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(rcReportForm.heading)}
          </Text>
        </Box>
        <ProsecutorCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={7}>
          <Box marginBottom={4}>
            <Text as="h3" variant="h3">
              {formatMessage(rcReportForm.sections.demands.heading)}{' '}
              <Tooltip
                text={formatMessage(rcReportForm.sections.demands.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              name="demands"
              label={formatMessage(rcReportForm.sections.demands.label)}
              placeholder={formatMessage(
                rcReportForm.sections.demands.placeholder,
              )}
              value={workingCase.demands || ''}
              errorMessage={demandsErrorMessage}
              hasError={demandsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'demands',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  demandsErrorMessage,
                  setDemandsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'demands',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setDemandsErrorMessage,
                )
              }
              rows={7}
              autoExpand={{ on: true, maxHeight: 300 }}
              textarea
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(rcReportForm.sections.caseFacts.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(rcReportForm.sections.caseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={3}>
            <Input
              data-testid="caseFacts"
              name="caseFacts"
              label={formatMessage(rcReportForm.sections.caseFacts.label)}
              placeholder={formatMessage(
                rcReportForm.sections.caseFacts.placeholder,
              )}
              errorMessage={caseFactsErrorMessage}
              hasError={caseFactsErrorMessage !== ''}
              value={workingCase.caseFacts || ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  caseFactsErrorMessage,
                  setCaseFactsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'caseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCaseFactsErrorMessage,
                )
              }
              required
              rows={14}
              autoExpand={{ on: true, maxHeight: 600 }}
              textarea
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={7}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(rcReportForm.sections.legalArguments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(
                  rcReportForm.sections.legalArguments.tooltip,
                )}
              />
            </Text>
          </Box>
          <Box marginBottom={7}>
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label={formatMessage(rcReportForm.sections.legalArguments.label)}
              placeholder={formatMessage(
                rcReportForm.sections.legalArguments.placeholder,
              )}
              value={workingCase.legalArguments || ''}
              errorMessage={legalArgumentsErrorMessage}
              hasError={legalArgumentsErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'legalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  legalArgumentsErrorMessage,
                  setLegalArgumentsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'legalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLegalArgumentsErrorMessage,
                )
              }
              required
              textarea
              rows={14}
              autoExpand={{ on: true, maxHeight: 600 }}
            />
          </Box>
          <Box component="section" marginBottom={7}>
            <CommentsInput
              workingCase={workingCase}
              setWorkingCase={setWorkingCase}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() => {
            handleNavigationTo(constants.RESTRICTION_CASE_CASE_FILES_ROUTE)
          }}
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceReport
