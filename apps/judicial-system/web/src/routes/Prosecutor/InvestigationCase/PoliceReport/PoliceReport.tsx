import { useCallback, useContext, useEffect } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import { Box, Checkbox, Input, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { icReportForm, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CommentsInput,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  ProsecutorCaseInfo,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  useCase,
  useDebouncedInput,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { isPoliceReportStepValidIC } from '@island.is/judicial-system-web/src/utils/validate'

const PoliceReport = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()
  const { updateCase, setAndSendCaseToServer } = useCase()

  const caseFactsInput = useDebouncedInput('caseFacts', ['empty'])
  const legalArgumentsInput = useDebouncedInput('legalArguments', ['empty'])
  const prosecutorOnlySessionRequestInput = useDebouncedInput(
    'prosecutorOnlySessionRequest',
    [],
  )

  useEffect(() => {
    if (
      !workingCase.prosecutorOnlySessionRequest &&
      workingCase.requestProsecutorOnlySession
    ) {
      setAndSendCaseToServer(
        [
          {
            prosecutorOnlySessionRequest: formatMessage(
              icReportForm.prosecutorOnly.input.defaultValue,
            ),
          },
        ],
        workingCase,
        setWorkingCase,
      )
    }
  }, [formatMessage, setAndSendCaseToServer, setWorkingCase, workingCase])

  const stepIsValid = isPoliceReportStepValidIC(workingCase)
  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
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
        title={formatMessage(titles.prosecutor.investigationCases.policeReport)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(icReportForm.heading)}</PageTitle>
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <ProsecutorCaseInfo workingCase={workingCase} />
          <BlueBox>
            <Text whiteSpace="preLine">{workingCase.demands}</Text>
          </BlueBox>
          <Box component="section">
            <SectionHeading
              title={formatMessage(icReportForm.caseFacts.heading)}
              tooltip={formatMessage(icReportForm.caseFacts.tooltip)}
            />
            <Input
              data-testid="caseFacts"
              name="caseFacts"
              label={formatMessage(icReportForm.caseFacts.label)}
              placeholder={formatMessage(icReportForm.caseFacts.placeholder)}
              errorMessage={caseFactsInput.errorMessage}
              hasError={caseFactsInput.hasError}
              value={caseFactsInput.value}
              onChange={(evt) => caseFactsInput.onChange(evt.target.value)}
              onBlur={(evt) => caseFactsInput.onBlur(evt.target.value)}
              required
              rows={14}
              textarea
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(icReportForm.legalArguments.heading)}
              tooltip={formatMessage(icReportForm.legalArguments.tooltip)}
            />
            <Input
              data-testid="legalArguments"
              name="legalArguments"
              label={formatMessage(icReportForm.legalArguments.label)}
              placeholder={formatMessage(
                icReportForm.legalArguments.placeholder,
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
            <BlueBox className={grid({ gap: 2 })}>
              <Checkbox
                name="request-prosecutor-only-session"
                label={formatMessage(
                  icReportForm.prosecutorOnly.checkbox.label,
                )}
                tooltip={formatMessage(
                  icReportForm.prosecutorOnly.checkbox.tooltip,
                )}
                checked={Boolean(workingCase.requestProsecutorOnlySession)}
                onChange={(evt) => {
                  setWorkingCase((prevWorkingCase) => ({
                    ...prevWorkingCase,
                    requestProsecutorOnlySession: evt.target.checked,
                  }))
                  updateCase(workingCase.id, {
                    requestProsecutorOnlySession: evt.target.checked,
                  })
                }}
                filled
                large
              />
              <Input
                name="prosecutor-only-session-request"
                label={formatMessage(icReportForm.prosecutorOnly.input.label)}
                placeholder={formatMessage(
                  icReportForm.prosecutorOnly.input.placeholder,
                )}
                disabled={workingCase.requestProsecutorOnlySession === false}
                value={prosecutorOnlySessionRequestInput.value}
                onChange={(evt) =>
                  prosecutorOnlySessionRequestInput.onChange(evt.target.value)
                }
                textarea
                rows={7}
              />
            </BlueBox>
          </Box>
          <section>
            <CommentsInput />
          </section>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INVESTIGATION_CASE_CASE_FILES_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
          nextIsLoading={isLoadingWorkingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default PoliceReport
