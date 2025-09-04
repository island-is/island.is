import { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Accordion,
  AccordionItem,
  Box,
  Checkbox,
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
  const { setAndSendCaseToServer, updateCase } = useCase()
  const { formatMessage } = useIntl()

  const [courtCaseFactsEM, setCourtCaseFactsEM] = useState<string>('')
  const [courtLegalArgumentsEM, setCourtLegalArgumentsEM] = useState<string>('')
  const [prosecutorDemandsEM, setProsecutorDemandsEM] = useState<string>('')
  const [introductionEM, setIntroductionEM] = useState<string>('')

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
        </Box>
        <Box component="section" marginBottom={5}>
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
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.introduction.title)}
            </Text>
          </Box>
          <Input
            data-testid="introduction"
            name="introduction"
            label={formatMessage(m.sections.introduction.label)}
            value={workingCase.introduction || ''}
            placeholder={formatMessage(m.sections.introduction.placeholder)}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'introduction',
                event.target.value,
                ['empty'],
                setWorkingCase,
                introductionEM,
                setIntroductionEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'introduction',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setIntroductionEM,
              )
            }
            errorMessage={introductionEM}
            hasError={introductionEM !== ''}
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
            required={isRulingRequired}
            disabled={!isRulingRequired}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.prosecutorDemands.title)}
            </Text>
          </Box>
          <Input
            data-testid="prosecutorDemands"
            name="prosecutorDemands"
            label={formatMessage(m.sections.prosecutorDemands.label)}
            value={workingCase.prosecutorDemands || ''}
            placeholder={formatMessage(
              m.sections.prosecutorDemands.placeholder,
            )}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'prosecutorDemands',
                event.target.value,
                ['empty'],
                setWorkingCase,
                prosecutorDemandsEM,
                setProsecutorDemandsEM,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'prosecutorDemands',
                event.target.value,
                ['empty'],
                workingCase,
                updateCase,
                setProsecutorDemandsEM,
              )
            }
            errorMessage={prosecutorDemandsEM}
            hasError={prosecutorDemandsEM !== ''}
            textarea
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
            required={isRulingRequired}
            disabled={!isRulingRequired}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.courtCaseFacts.title)} `}
              <Tooltip
                text={formatMessage(m.sections.courtCaseFacts.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtCaseFacts"
              name="courtCaseFacts"
              label={formatMessage(m.sections.courtCaseFacts.label)}
              value={workingCase.courtCaseFacts || ''}
              placeholder={formatMessage(m.sections.courtCaseFacts.placeholder)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtCaseFacts',
                  event.target.value,
                  ['empty'],
                  setWorkingCase,
                  courtCaseFactsEM,
                  setCourtCaseFactsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtCaseFacts',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtCaseFactsEM,
                )
              }
              errorMessage={courtCaseFactsEM}
              hasError={courtCaseFactsEM !== ''}
              textarea
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              required={isRulingRequired}
              disabled={!isRulingRequired}
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {`${formatMessage(m.sections.courtLegalArguments.title)} `}
              <Tooltip
                text={formatMessage(m.sections.courtLegalArguments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={5}>
            <Input
              data-testid="courtLegalArguments"
              name="courtLegalArguments"
              label={formatMessage(m.sections.courtLegalArguments.label)}
              value={workingCase.courtLegalArguments || ''}
              placeholder={formatMessage(
                m.sections.courtLegalArguments.placeholder,
              )}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'courtLegalArguments',
                  event.target.value,
                  ['empty'],
                  setWorkingCase,
                  courtLegalArgumentsEM,
                  setCourtLegalArgumentsEM,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'courtLegalArguments',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setCourtLegalArgumentsEM,
                )
              }
              errorMessage={courtLegalArgumentsEM}
              hasError={courtLegalArgumentsEM !== ''}
              textarea
              rows={16}
              autoExpand={{ on: true, maxHeight: 600 }}
              required={isRulingRequired}
              disabled={!isRulingRequired}
            />
          </Box>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.ruling.title)}
            </Text>
          </Box>
          <RulingInput
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            disabled={!isRulingRequired}
          />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.decision.title)}
            </Text>
          </Box>
          <Box marginBottom={5}>
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
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.conclusion.title)}
            </Text>
          </Box>
          <Input
            name="conclusion"
            label={formatMessage(m.sections.conclusion.label)}
            placeholder={formatMessage(m.sections.conclusion.placeholder)}
            value={workingCase.conclusion || ''}
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
            rows={7}
            autoExpand={{ on: true, maxHeight: 300 }}
            textarea
            disabled={!isRulingRequired}
          />
        </Box>
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling"
            disabled={!isRulingRequired}
          />
        </Box>
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
