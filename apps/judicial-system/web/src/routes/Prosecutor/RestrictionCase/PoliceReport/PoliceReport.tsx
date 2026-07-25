import { useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import { Box, Input } from '@island.is/island-ui/core'
import {
  PROSECUTION_RESTRICTION_CASE_CASE_FILES_ROUTE,
  PROSECUTION_RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
} from '@island.is/judicial-system/consts'
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
  SectionHeading,
  TinyMCE,
} from '@island.is/judicial-system-web/src/components'
import { getTextContentFromHtml } from '@island.is/judicial-system-web/src/utils/formatters'
import { useDebouncedInput } from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
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
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <ProsecutorCaseInfo workingCase={workingCase} />
          <Box component="section">
            <SectionHeading
              title={formatMessage(rcReportForm.sections.demands.heading)}
            />
            <Input
              name="demands"
              label={formatMessage(rcReportForm.sections.demands.label)}
              placeholder={'Hverjar eru kröfur ákæruvaldsins?'}
              value={demandsInput.value}
              errorMessage={demandsInput.errorMessage}
              hasError={demandsInput.hasError}
              onChange={(evt) => demandsInput.onChange(evt.target.value)}
              onBlur={(evt) => demandsInput.onBlur(evt.target.value)}
              rows={7}
              textarea
              required
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(rcReportForm.sections.caseFacts.heading)}
              tooltip={formatMessage(rcReportForm.sections.caseFacts.tooltip)}
            />
            <TinyMCE
              data-testid="caseFacts"
              label={formatMessage(rcReportForm.sections.caseFacts.label)}
              placeholder={formatMessage(
                rcReportForm.sections.caseFacts.placeholder,
              )}
              defaultValue={caseFactsInput.value}
              errorMessage={caseFactsInput.errorMessage}
              onChange={(html) => caseFactsInput.onChange(html)}
              onBlur={(html) =>
                caseFactsInput.onBlur(getTextContentFromHtml(html))
              }
              required
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(
                rcReportForm.sections.legalArguments.heading,
              )}
              tooltip={formatMessage(
                rcReportForm.sections.legalArguments.tooltip,
              )}
            />
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label={formatMessage(rcReportForm.sections.legalArguments.label)}
              placeholder={formatMessage(
                rcReportForm.sections.legalArguments.placeholder,
              )}
              value={legalArgumentsInput.value}
              errorMessage={legalArgumentsInput.errorMessage}
              hasError={legalArgumentsInput.hasError}
              onChange={(evt) => legalArgumentsInput.onChange(evt.target.value)}
              onBlur={(evt) => legalArgumentsInput.onBlur(evt.target.value)}
              required
              textarea
              rows={14}
            />
          </Box>
          <Box component="section">
            <CommentsInput />
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${PROSECUTION_RESTRICTION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() => {
            handleNavigationTo(PROSECUTION_RESTRICTION_CASE_CASE_FILES_ROUTE)
          }}
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceReport
