import { useCallback, useContext } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Accordion,
  AccordionItem,
  Box,
  Checkbox,
  Input,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import { isAcceptingCaseDecision } from '@island.is/judicial-system/types'
import { core, ruling, titles } from '@island.is/judicial-system-web/messages'
import {
  CaseFileList,
  CourtCaseInfo,
  Decision,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  PdfButton,
  PoliceRequestAccordionItem,
  RulingInput,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import { CaseDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  useCase,
  useDebouncedInput,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { isRulingValidIC } from '@island.is/judicial-system-web/src/utils/validate'

import { icRuling as m } from './Ruling.strings'

const Ruling = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()

  const courtCaseFactsInput = useDebouncedInput('courtCaseFacts', ['empty'])
  const courtLegalArgumentsInput = useDebouncedInput('courtLegalArguments', [
    'empty',
  ])
  const prosecutorDemandsInput = useDebouncedInput('prosecutorDemands', [
    'empty',
  ])
  const introductionInput = useDebouncedInput('introduction', ['empty'])
  const conclusionInput = useDebouncedInput('conclusion', [])

  const initialize = useCallback(() => {
    setAndSendCaseToServer(
      [
        {
          introduction: formatMessage(m.sections.introduction.autofill, {
            date: formatDate(workingCase.arraignmentDate?.date, 'PPP'),
          }),
          prosecutorDemands: workingCase.demands,
          courtCaseFacts: formatMessage(
            ruling.sections.courtCaseFacts.prefill,
            {
              caseFacts: workingCase.caseFacts,
            },
          ),
          courtLegalArguments: formatMessage(
            ruling.sections.courtLegalArguments.prefill,
            { legalArguments: workingCase.legalArguments },
          ),
          ruling: !workingCase.parentCase
            ? `\n${formatMessage(ruling.autofill, {
                judgeName: workingCase.judge?.name,
              })}`
            : isAcceptingCaseDecision(workingCase.decision)
            ? workingCase.parentCase.ruling
            : undefined,
          conclusion: isAcceptingCaseDecision(workingCase.decision)
            ? workingCase.demands
            : undefined,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [setAndSendCaseToServer, workingCase, formatMessage, setWorkingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      router.push(`${destination}/${workingCase.id}`)
    },
    [workingCase.id],
  )
  const stepIsValid = isRulingValidIC(workingCase)
  const caseFiles =
    workingCase.caseFiles?.filter((file) => !file.category) ?? []

  const isRulingRequired = !workingCase.isCompletedWithoutRuling

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.ruling)}
      />
      <FormContentContainer>
        <PageTitle>{formatMessage(m.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <div className={grid({ gap: 5, marginBottom: 10 })}>
          <Box component="section">
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
              <AccordionItem
                id="caseFileList"
                label={`Rannsóknargögn (${caseFiles.length})`}
                labelVariant="h3"
              >
                <CaseFileList caseId={workingCase.id} files={caseFiles} />
              </AccordionItem>
            </Accordion>
          </Box>
          <Box component="section">
            <Checkbox
              name={formatMessage(m.sections.completedWithoutRuling.label)}
              label={formatMessage(m.sections.completedWithoutRuling.label)}
              checked={!isRulingRequired}
              onChange={({ target }) => {
                setAndSendCaseToServer(
                  [
                    {
                      isCompletedWithoutRuling: target.checked,
                      conclusion: formatMessage(
                        m.sections.completedWithoutRuling.conclusion,
                      ),
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              tooltip={formatMessage(m.sections.completedWithoutRuling.tooltip)}
              backgroundColor="blue"
              large
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <SectionHeading
              title={formatMessage(m.sections.introduction.title)}
            />
            <Input
              data-testid="introduction"
              name="introduction"
              label={formatMessage(m.sections.introduction.label)}
              placeholder={formatMessage(m.sections.introduction.placeholder)}
              value={introductionInput.value || ''}
              onChange={(evt) => introductionInput.onChange(evt.target.value)}
              onBlur={(evt) => introductionInput.onBlur(evt.target.value)}
              errorMessage={introductionInput.errorMessage}
              hasError={introductionInput.hasError}
              textarea
              rows={7}
              required={isRulingRequired}
              disabled={!isRulingRequired}
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.prosecutorDemands.title)}
            />
            <Input
              data-testid="prosecutorDemands"
              name="prosecutorDemands"
              label={formatMessage(m.sections.prosecutorDemands.label)}
              placeholder={formatMessage(
                m.sections.prosecutorDemands.placeholder,
              )}
              value={prosecutorDemandsInput.value || ''}
              onChange={(evt) =>
                prosecutorDemandsInput.onChange(evt.target.value)
              }
              onBlur={(evt) => prosecutorDemandsInput.onBlur(evt.target.value)}
              errorMessage={prosecutorDemandsInput.errorMessage}
              hasError={prosecutorDemandsInput.hasError}
              textarea
              rows={7}
              required={isRulingRequired}
              disabled={!isRulingRequired}
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.courtCaseFacts.title)}
              tooltip={formatMessage(m.sections.courtCaseFacts.tooltip)}
            />

            <Input
              data-testid="courtCaseFacts"
              name="courtCaseFacts"
              label={formatMessage(m.sections.courtCaseFacts.label)}
              placeholder={formatMessage(m.sections.courtCaseFacts.placeholder)}
              value={courtCaseFactsInput.value || ''}
              onChange={(evt) => courtCaseFactsInput.onChange(evt.target.value)}
              onBlur={(evt) => courtCaseFactsInput.onBlur(evt.target.value)}
              errorMessage={courtCaseFactsInput.errorMessage}
              hasError={courtCaseFactsInput.hasError}
              textarea
              rows={16}
              required={isRulingRequired}
              disabled={!isRulingRequired}
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.courtLegalArguments.title)}
              tooltip={formatMessage(m.sections.courtLegalArguments.tooltip)}
            />
            <Input
              data-testid="courtLegalArguments"
              name="courtLegalArguments"
              label={formatMessage(m.sections.courtLegalArguments.label)}
              value={courtLegalArgumentsInput.value || ''}
              placeholder={formatMessage(
                m.sections.courtLegalArguments.placeholder,
              )}
              onChange={(evt) =>
                courtLegalArgumentsInput.onChange(evt.target.value)
              }
              onBlur={(evt) =>
                courtLegalArgumentsInput.onBlur(evt.target.value)
              }
              errorMessage={courtLegalArgumentsInput.errorMessage}
              hasError={courtLegalArgumentsInput.hasError}
              textarea
              rows={16}
              required={isRulingRequired}
              disabled={!isRulingRequired}
            />
          </Box>
          <Box component="section">
            <SectionHeading title={formatMessage(m.sections.ruling.title)} />
            <RulingInput disabled={!isRulingRequired} />
          </Box>
          <Box component="section">
            <SectionHeading title={formatMessage(m.sections.decision.title)} />
            <Decision
              workingCase={workingCase}
              acceptedLabelText={formatMessage(
                ruling.investigationCases.sections.decision.acceptLabel,
              )}
              rejectedLabelText={formatMessage(
                ruling.investigationCases.sections.decision.rejectLabel,
              )}
              partiallyAcceptedLabelText={formatMessage(
                ruling.investigationCases.sections.decision
                  .partiallyAcceptLabel,
              )}
              dismissLabelText={formatMessage(
                ruling.investigationCases.sections.decision.dismissLabel,
              )}
              onChange={(decision) => {
                let ruling = undefined

                if (
                  isAcceptingCaseDecision(decision) &&
                  workingCase.parentCase &&
                  !workingCase.ruling
                ) {
                  ruling = workingCase.parentCase.ruling
                }

                setAndSendCaseToServer(
                  [
                    {
                      conclusion:
                        decision === CaseDecision.ACCEPTING && isRulingRequired
                          ? workingCase.demands
                          : workingCase.conclusion,
                      ruling,
                      decision,
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
            />
          </Box>
          <Box component="section">
            <SectionHeading
              title={formatMessage(m.sections.conclusion.title)}
            />
            <Input
              name="conclusion"
              label={formatMessage(m.sections.conclusion.label)}
              placeholder={formatMessage(m.sections.conclusion.placeholder)}
              value={conclusionInput.value || ''}
              onChange={(evt) => conclusionInput.onChange(evt.target.value)}
              rows={7}
              textarea
              disabled={!isRulingRequired}
            />
          </Box>
          <Box>
            <PdfButton
              caseId={workingCase.id}
              title={formatMessage(core.pdfButtonRuling)}
              pdfType="ruling"
              elementId={formatMessage(core.pdfButtonRuling)}
              disabled={!isRulingRequired}
            />
          </Box>
        </div>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!stepIsValid}
          onNextButtonClick={() =>
            handleNavigationTo(constants.INVESTIGATION_CASE_COURT_RECORD_ROUTE)
          }
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Ruling
