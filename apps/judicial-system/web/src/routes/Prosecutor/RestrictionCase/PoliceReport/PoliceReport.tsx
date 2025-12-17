import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { rcReportForm, titles } from '@island.is/judicial-system-web/messages'
import {
  CommentsInput,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
} from '@island.is/judicial-system-web/src/components'
import { useDebouncedInput } from '@island.is/judicial-system-web/src/utils/hooks'
import { isPoliceReportStepValidRC } from '@island.is/judicial-system-web/src/utils/validate'

export const PoliceReport = () => {
  const { workingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const router = useRouter()
  const demandsInput = useDebouncedInput('demands', ['empty'])
  const caseFactsInput = useDebouncedInput('caseFacts', ['empty'])
  const legalArgumentsInput = useDebouncedInput('legalArguments', ['empty'])
  const { formatMessage } = useIntl()
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
        <PageTitle>{formatMessage(rcReportForm.heading)}</PageTitle>
        <Box marginBottom={5}>
          <ProsecutorCaseInfo workingCase={workingCase} />
        </Box>
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
              placeholder={'Hverjar eru kröfur ákæruvaldsins?'}
              value={demandsInput.value || ''}
              errorMessage={demandsInput.errorMessage}
              hasError={demandsInput.hasError}
              onChange={(evt) => demandsInput.onChange(evt.target.value)}
              onBlur={(evt) => demandsInput.onBlur(evt.target.value)}
              rows={7}
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
              errorMessage={caseFactsInput.errorMessage}
              hasError={caseFactsInput.hasError}
              value={caseFactsInput.value || ''}
              onChange={(evt) => caseFactsInput.onChange(evt.target.value)}
              onBlur={(evt) => caseFactsInput.onBlur(evt.target.value)}
              required
              rows={14}
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
              value={legalArgumentsInput.value || ''}
              errorMessage={legalArgumentsInput.errorMessage}
              hasError={legalArgumentsInput.hasError}
              onChange={(evt) => legalArgumentsInput.onChange(evt.target.value)}
              onBlur={(evt) => legalArgumentsInput.onBlur(evt.target.value)}
              required
              textarea
              rows={14}
            />
          </Box>
          <Box component="section" marginBottom={7}>
            <CommentsInput />
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
