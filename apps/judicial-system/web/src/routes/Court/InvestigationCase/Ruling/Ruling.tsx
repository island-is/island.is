import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  CaseFileList,
  CaseInfo,
  Decision,
  FormContentContainer,
  FormFooter,
  PageLayout,
  PdfButton,
  PoliceRequestAccordionItem,
  RulingInput,
} from '@island.is/judicial-system-web/src/components'
import {
  CourtSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import { useCase, useDeb } from '@island.is/judicial-system-web/src/utils/hooks'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  isAcceptingCaseDecision,
  completedCaseStates,
  CaseDecision,
} from '@island.is/judicial-system/types'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  core,
  icRuling as m,
  ruling,
  titles,
} from '@island.is/judicial-system-web/messages'
import PageHeader from '@island.is/judicial-system-web/src/components/PageHeader/PageHeader'
import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Input,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isRulingValidIC } from '@island.is/judicial-system-web/src/utils/validate'
import {
  SIGNED_VERDICT_OVERVIEW,
  IC_MODIFY_RULING_ROUTE,
  IC_COURT_RECORD_ROUTE,
  IC_COURT_HEARING_ARRANGEMENTS_ROUTE,
} from '@island.is/judicial-system/consts'
import SigningModal, {
  useRequestRulingSignature,
} from '@island.is/judicial-system-web/src/components/SigningModal/SigningModal'

const Ruling = () => {
  const {
    workingCase,
    setWorkingCase,
    isLoadingWorkingCase,
    caseNotFound,
    isCaseUpToDate,
  } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { autofill, updateCase } = useCase()
  const { formatMessage } = useIntl()

  const [initialAutoFillDone, setInitialAutoFillDone] = useState(false)
  const [courtCaseFactsEM, setCourtCaseFactsEM] = useState<string>('')
  const [courtLegalArgumentsEM, setCourtLegalArgumentsEM] = useState<string>('')
  const [prosecutorDemandsEM, setProsecutorDemandsEM] = useState<string>('')
  const [introductionEM, setIntroductionEM] = useState<string>('')

  const [modalVisible, setModalVisible] = useState<'NoModal' | 'SigningModal'>(
    'NoModal',
  )

  const {
    requestRulingSignature,
    requestRulingSignatureResponse,
    isRequestingRulingSignature,
  } = useRequestRulingSignature(workingCase.id, () =>
    setModalVisible('SigningModal'),
  )
  const isModifyingRuling = router.pathname.includes(IC_MODIFY_RULING_ROUTE)

  useDeb(workingCase, 'prosecutorDemands')
  useDeb(workingCase, 'courtCaseFacts')
  useDeb(workingCase, 'courtLegalArguments')
  useDeb(workingCase, 'conclusion')

  useEffect(() => {
    if (isCaseUpToDate && !initialAutoFillDone) {
      autofill(
        [
          {
            key: 'introduction',
            value: formatMessage(m.sections.introduction.autofill, {
              date: formatDate(workingCase.courtDate, 'PPP'),
            }),
          },
          {
            key: 'prosecutorDemands',
            value: workingCase.demands,
          },
          {
            key: 'courtCaseFacts',
            value: workingCase.caseFacts,
          },
          {
            key: 'courtLegalArguments',
            value: workingCase.legalArguments,
          },
          {
            key: 'ruling',
            value: !workingCase.parentCase
              ? `\n${formatMessage(ruling.autofill, {
                  judgeName: workingCase.judge?.name,
                })}`
              : isAcceptingCaseDecision(workingCase.decision)
              ? workingCase.parentCase.ruling
              : undefined,
          },
          {
            key: 'conclusion',
            value: isAcceptingCaseDecision(workingCase.decision)
              ? workingCase.demands
              : undefined,
          },
        ],
        workingCase,
        setWorkingCase,
      )

      setInitialAutoFillDone(true)
    }
  }, [
    isCaseUpToDate,
    autofill,
    workingCase,
    formatMessage,
    setWorkingCase,
    initialAutoFillDone,
    setInitialAutoFillDone,
  ])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={CourtSubsections.RULING}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.ruling)}
      />
      <FormContentContainer>
        {isModifyingRuling && (
          <Box marginBottom={3}>
            <AlertMessage
              type="warning"
              title={formatMessage(m.sections.alertMessage.title)}
              message={formatMessage(m.sections.alertMessage.message)}
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.title)}
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseInfo workingCase={workingCase} userRole={user?.role} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Accordion>
            <PoliceRequestAccordionItem workingCase={workingCase} />
            <AccordionItem
              id="caseFileList"
              label={`Rannsóknargögn (${workingCase.caseFiles?.length ?? 0})`}
              labelVariant="h3"
            >
              <CaseFileList
                caseId={workingCase.id}
                files={workingCase.caseFiles ?? []}
                canOpenFiles={
                  (workingCase.judge !== null &&
                    workingCase.judge?.id === user?.id) ||
                  (workingCase.registrar !== null &&
                    workingCase.registrar?.id === user?.id)
                }
                isCaseCompleted={completedCaseStates.includes(
                  workingCase.state,
                )}
              />
            </AccordionItem>
          </Accordion>
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
                workingCase,
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
            required
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
                workingCase,
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
            required
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
                  workingCase,
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
              required
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
                  workingCase,
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
              required
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
              acceptedLabelText={formatMessage(m.sections.decision.acceptLabel)}
              rejectedLabelText={formatMessage(m.sections.decision.rejectLabel)}
              partiallyAcceptedLabelText={formatMessage(
                m.sections.decision.partiallyAcceptLabel,
              )}
              dismissLabelText={formatMessage(m.sections.decision.dismissLabel)}
              disabled={isModifyingRuling}
              onChange={(decision) => {
                autofill(
                  [
                    {
                      key: 'conclusion',
                      value:
                        decision === CaseDecision.ACCEPTING
                          ? workingCase.demands
                          : '',
                      force: true,
                    },
                    {
                      key: 'decision',
                      value: decision,
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
                workingCase,
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
            disabled={isModifyingRuling}
          />
        </Box>
        <Box marginBottom={10}>
          <PdfButton
            caseId={workingCase.id}
            title={formatMessage(core.pdfButtonRuling)}
            pdfType="ruling"
            useSigned={!isModifyingRuling}
          />
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={
            isModifyingRuling
              ? `${SIGNED_VERDICT_OVERVIEW}/${workingCase.id}`
              : `${IC_COURT_HEARING_ARRANGEMENTS_ROUTE}/${workingCase.id}`
          }
          nextButtonText={
            isModifyingRuling
              ? formatMessage(m.sections.formFooter.modifyRulingButtonLabel)
              : undefined
          }
          nextIsLoading={
            isModifyingRuling
              ? isRequestingRulingSignature || isLoadingWorkingCase
              : isLoadingWorkingCase
          }
          nextUrl={`${IC_COURT_RECORD_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isRulingValidIC(workingCase)}
          onNextButtonClick={() => {
            if (isModifyingRuling) {
              requestRulingSignature()
            } else {
              router.push(`${IC_COURT_RECORD_ROUTE}/${workingCase.id}`)
            }
          }}
        />
      </FormContentContainer>
      {modalVisible === 'SigningModal' && (
        <SigningModal
          workingCase={workingCase}
          setWorkingCase={setWorkingCase}
          requestRulingSignatureResponse={requestRulingSignatureResponse}
          onClose={() => setModalVisible('NoModal')}
        />
      )}
    </PageLayout>
  )
}

export default Ruling
