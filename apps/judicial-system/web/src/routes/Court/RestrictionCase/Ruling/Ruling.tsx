import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import formatISO from 'date-fns/formatISO'
import { useRouter } from 'next/router'

import {
  Accordion,
  AccordionItem,
  Box,
  Input,
  Text,
  Tooltip,
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
  RestrictionLength,
  RulingInput,
} from '@island.is/judicial-system-web/src/components'
import { CaseDecision } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  useCase,
  useDeb,
  useOnceOn,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isRulingValidRC } from '@island.is/judicial-system-web/src/utils/validate'

import { getConclusionAutofill } from './Ruling.logic'
import { strings } from './Ruling.strings'

export const Ruling = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)

  const [introductionErrorMessage, setIntroductionErrorMessage] =
    useState<string>('')
  const [courtCaseFactsErrorMessage, setCourtCaseFactsErrorMessage] =
    useState<string>('')
  const [courtLegalArgumentsErrorMessage, setCourtLegalArgumentsErrorMessage] =
    useState<string>('')
  const [prosecutorDemandsErrorMessage, setProsecutorDemandsMessage] =
    useState<string>('')

  const router = useRouter()

  const { updateCase, setAndSendCaseToServer } = useCase()
  const { formatMessage } = useIntl()

  useDeb(workingCase, [
    'prosecutorDemands',
    'courtCaseFacts',
    'courtLegalArguments',
    'conclusion',
  ])

  const initialize = useCallback(() => {
    setAndSendCaseToServer(
      [
        {
          introduction: formatMessage(strings.sections.introduction.autofill, {
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
          conclusion:
            workingCase.decision &&
            workingCase.defendants &&
            workingCase.defendants.length > 0
              ? getConclusionAutofill(
                  formatMessage,
                  workingCase,
                  workingCase.decision,
                  workingCase.defendants[0],
                  workingCase.validToDate,
                  workingCase.isCustodyIsolation,
                  workingCase.isolationToDate,
                )
              : undefined,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [formatMessage, setAndSendCaseToServer, setWorkingCase, workingCase])

  useOnceOn(isCaseUpToDate, initialize)

  const handleNavigationTo = useCallback(
    async (destination: string) => {
      router.push(`${destination}/${workingCase.id}`)
    },
    [router, workingCase.id],
  )

  const stepIsValid = isRulingValidRC(workingCase)
  const caseFiles =
    workingCase.caseFiles?.filter((file) => !file.category) ?? []

  const handleIsolationChange = useCallback(() => {
    let conclusion = undefined

    if (
      workingCase.decision &&
      workingCase.defendants &&
      workingCase.defendants.length > 0 &&
      (isAcceptingCaseDecision(workingCase.decision) ||
        workingCase.decision === CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
    ) {
      conclusion = getConclusionAutofill(
        formatMessage,
        workingCase,
        workingCase.decision,
        workingCase.defendants[0],
        workingCase.validToDate,
        !workingCase.isCustodyIsolation,
        workingCase.isolationToDate,
      )
    }

    setAndSendCaseToServer(
      [
        {
          isCustodyIsolation: !workingCase.isCustodyIsolation,
          conclusion,
          force: true,
        },
      ],
      workingCase,
      setWorkingCase,
    )
  }, [formatMessage, setAndSendCaseToServer, setWorkingCase, workingCase])

  const handleIsolationDateChange = useCallback(
    (date: Date | undefined, valid: boolean) => {
      let isolationToDate = date && valid ? formatISO(date) : undefined
      if (
        isolationToDate &&
        workingCase.validToDate &&
        isolationToDate > workingCase.validToDate
      ) {
        // Make sure the time component does not make the isolation to date larger than the valid to date.
        isolationToDate = workingCase.validToDate
      }
      let conclusion = undefined

      if (
        workingCase.decision &&
        workingCase.defendants &&
        workingCase.defendants.length > 0 &&
        date &&
        valid &&
        (isAcceptingCaseDecision(workingCase.decision) ||
          workingCase.decision ===
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
      ) {
        conclusion = getConclusionAutofill(
          formatMessage,
          workingCase,
          workingCase.decision,
          workingCase.defendants[0],
          workingCase.validToDate,
          workingCase.isCustodyIsolation,
          formatISO(date),
        )
      }

      setAndSendCaseToServer(
        [
          {
            isolationToDate,
            conclusion,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    },
    [formatMessage, setAndSendCaseToServer, setWorkingCase, workingCase],
  )

  const handleValidToDateChange = useCallback(
    (date: Date | undefined, valid: boolean) => {
      const validToDate = date && valid ? formatISO(date) : undefined
      const isolationToDate =
        validToDate &&
        workingCase.isolationToDate &&
        validToDate < workingCase.isolationToDate
          ? validToDate
          : workingCase.isolationToDate
      let conclusion = undefined

      if (
        workingCase.decision &&
        workingCase.defendants &&
        workingCase.defendants.length > 0 &&
        date &&
        valid &&
        (isAcceptingCaseDecision(workingCase.decision) ||
          workingCase.decision ===
            CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN)
      ) {
        conclusion = getConclusionAutofill(
          formatMessage,
          workingCase,
          workingCase.decision,
          workingCase.defendants[0],
          validToDate,
          workingCase.isCustodyIsolation,
          isolationToDate,
        )
      }

      setAndSendCaseToServer(
        [
          {
            validToDate,
            isolationToDate,
            conclusion,
            force: true,
          },
        ],
        workingCase,
        setWorkingCase,
      )
    },
    [formatMessage, setAndSendCaseToServer, setWorkingCase, workingCase],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.restrictionCases.ruling)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
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
          <Box component="section" marginBottom={5}></Box>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.sections.introduction.title)}
            </Text>
          </Box>
          <Input
            data-testid="introduction"
            name="introduction"
            label={formatMessage(strings.sections.introduction.label)}
            value={workingCase.introduction || ''}
            placeholder={formatMessage(
              strings.sections.introduction.placeholder,
            )}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'introduction',
                event.target.value,
                ['empty'],
                setWorkingCase,
                introductionErrorMessage,
                setIntroductionErrorMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'introduction',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setIntroductionErrorMessage,
              )
            }
            errorMessage={introductionErrorMessage}
            hasError={introductionErrorMessage !== ''}
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.sections.prosecutorDemands.title)}
            </Text>
          </Box>
          <Input
            data-testid="prosecutorDemands"
            name="prosecutorDemands"
            label={formatMessage(strings.sections.prosecutorDemands.label)}
            value={workingCase.prosecutorDemands || ''}
            placeholder={formatMessage(
              strings.sections.prosecutorDemands.placeholder,
            )}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'prosecutorDemands',
                event.target.value,
                ['empty'],
                setWorkingCase,
                prosecutorDemandsErrorMessage,
                setProsecutorDemandsMessage,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'prosecutorDemands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setProsecutorDemandsMessage,
              )
            }
            errorMessage={prosecutorDemandsErrorMessage}
            hasError={prosecutorDemandsErrorMessage !== ''}
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
            required
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(strings.sections.courtCaseFacts.title)} `}
              <Tooltip
                text={formatMessage(strings.sections.courtCaseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtCaseFacts"
              name="courtCaseFacts"
              label={formatMessage(strings.sections.courtCaseFacts.label)}
              value={workingCase.courtCaseFacts || ''}
              placeholder={formatMessage(
                strings.sections.courtCaseFacts.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtCaseFacts',
                  event.target.value,
                  ['empty'],
                  setWorkingCase,
                  courtCaseFactsErrorMessage,
                  setCourtCaseFactsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtCaseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtCaseFactsErrorMessage,
                )
              }
              errorMessage={courtCaseFactsErrorMessage}
              hasError={courtCaseFactsErrorMessage !== ''}
              textarea
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(strings.sections.courtLegalArguments.title)} `}
              <Tooltip
                text={formatMessage(
                  strings.sections.courtLegalArguments.tooltip,
                )}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtLegalArguments"
              name="courtLegalArguments"
              label={formatMessage(strings.sections.courtLegalArguments.label)}
              value={workingCase.courtLegalArguments || ''}
              placeholder={formatMessage(
                strings.sections.courtLegalArguments.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLegalArguments',
                  event.target.value,
                  ['empty'],
                  setWorkingCase,
                  courtLegalArgumentsErrorMessage,
                  setCourtLegalArgumentsErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLegalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLegalArgumentsErrorMessage,
                )
              }
              errorMessage={courtLegalArgumentsErrorMessage}
              hasError={courtLegalArgumentsErrorMessage !== ''}
              textarea
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              required
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.sections.ruling.title)}
            </Text>
          </Box>
          <RulingInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.sections.decision.title)}
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Decision
              workingCase={workingCase}
              acceptedLabelText={formatMessage(
                ruling.restrictionCases.sections.decision.acceptLabel,
                {
                  caseType: formatMessage(
                    ruling.restrictionCases.sections.decision.caseType,
                    {
                      caseType: workingCase.type,
                    },
                  ),
                },
              )}
              rejectedLabelText={formatMessage(
                ruling.restrictionCases.sections.decision.rejectLabel,
                {
                  caseType: formatMessage(
                    ruling.restrictionCases.sections.decision.caseType,
                    {
                      caseType: workingCase.type,
                    },
                  ),
                },
              )}
              partiallyAcceptedLabelText={formatMessage(
                ruling.restrictionCases.sections.decision.partiallyAcceptLabel,
                {
                  caseType: formatMessage(
                    ruling.restrictionCases.sections.decision.caseType,
                    {
                      caseType: workingCase.type,
                    },
                  ),
                },
              )}
              dismissLabelText={formatMessage(
                ruling.restrictionCases.sections.decision.dismissLabel,
                {
                  caseType: formatMessage(
                    ruling.restrictionCases.sections.decision.caseType,
                    {
                      caseType: workingCase.type,
                    },
                  ),
                },
              )}
              acceptingAlternativeTravelBanLabelText={formatMessage(
                ruling.restrictionCases.sections.decision
                  .acceptingAlternativeTravelBanLabel,
                {
                  caseType: formatMessage(
                    ruling.restrictionCases.sections.decision.caseType,
                    {
                      caseType: workingCase.type,
                    },
                  ),
                },
              )}
              onChange={(decision) => {
                let conclusion = undefined
                let ruling = undefined

                if (
                  workingCase.defendants &&
                  workingCase.defendants.length > 0
                ) {
                  conclusion = getConclusionAutofill(
                    formatMessage,
                    workingCase,
                    decision,
                    workingCase.defendants[0],
                    workingCase.validToDate,
                    workingCase.isCustodyIsolation,
                    workingCase.isolationToDate,
                  )
                }

                if (
                  isAcceptingCaseDecision(decision) &&
                  workingCase.parentCase &&
                  !workingCase.ruling
                ) {
                  ruling = workingCase.parentCase.ruling
                }

                setAndSendCaseToServer(
                  [{ conclusion, decision, ruling, force: true }],
                  workingCase,
                  setWorkingCase,
                )
              }}
            />
          </Box>
        </Box>
        {workingCase.decision &&
          workingCase.decision !== CaseDecision.REJECTING &&
          workingCase.decision !== CaseDecision.DISMISSING && (
            <RestrictionLength
              workingCase={workingCase}
              handleIsolationChange={handleIsolationChange}
              handleIsolationDateChange={handleIsolationDateChange}
              handleValidToDateChange={handleValidToDateChange}
            />
          )}

        <Box component="section" marginBottom={5}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              {formatMessage(strings.sections.conclusion.title)}
            </Text>
          </Box>
          <Input
            name="conclusion"
            data-testid="conclusion"
            label={formatMessage(strings.sections.conclusion.label)}
            value={workingCase.conclusion || ''}
            placeholder={formatMessage(strings.sections.conclusion.placeholder)}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'conclusion',
                event.target.value,
                [],
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'conclusion',
                event.target.value,
                [],
                workingCase,
                updateCase,
              )
            }
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
          />
        </Box>
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling"
            elementId={formatMessage(core.pdfButtonRuling)}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(constants.RESTRICTION_CASE_COURT_RECORD_ROUTE)
          }
          nextIsDisabled={!stepIsValid}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Ruling
