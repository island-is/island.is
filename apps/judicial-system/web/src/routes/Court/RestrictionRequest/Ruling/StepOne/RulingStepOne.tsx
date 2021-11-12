import React, { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import {
  Accordion,
  AccordionItem,
  Box,
  Input,
  Text,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  PoliceRequestAccordionItem,
  BlueBox,
  CaseNumbers,
  FormContentContainer,
  CaseFileList,
  Decision,
  RulingInput,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  isAcceptingCaseDecision,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  parseArray,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { isRulingStepOneValidRC } from '@island.is/judicial-system-web/src/utils/validate'
import { useQuery } from '@apollo/client'
import { CaseQuery } from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  setCheckboxAndSendToServer,
  newSetAndSendDateToServer,
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isolation } from '@island.is/judicial-system-web/src/utils/Restrictions'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import { useRouter } from 'next/router'
import DateTime from '@island.is/judicial-system-web/src/shared-components/DateTime/DateTime'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { UserContext } from '@island.is/judicial-system-web/src/shared-components/UserProvider/UserProvider'
import { rcRulingStepOne as m } from '@island.is/judicial-system-web/messages'

export const RulingStepOne: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [, setValidToDateIsValid] = useState<boolean>(true)
  const [, setIsolationToIsValid] = useState<boolean>(true)
  const [
    courtCaseFactsErrorMessage,
    setCourtCaseFactsErrorMessage,
  ] = useState<string>('')
  const [
    courtLegalArgumentsErrorMessage,
    setCourtLegalArgumentsErrorMessage,
  ] = useState<string>('')

  const router = useRouter()
  const id = router.query.id

  const { user } = useContext(UserContext)
  const { updateCase, autofill } = useCase()
  const { formatMessage } = useIntl()
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    document.title = 'Úrskurður - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && data?.case) {
      let theCase = data.case

      if (!theCase.custodyRestrictions) {
        theCase = {
          ...theCase,
          custodyRestrictions: theCase.requestedCustodyRestrictions,
        }

        updateCase(
          theCase.id,
          parseArray(
            'custodyRestrictions',
            theCase.requestedCustodyRestrictions ?? [],
          ),
        )
      }

      if (theCase.requestedValidToDate) {
        autofill('validToDate', theCase.requestedValidToDate, theCase)
      }

      if (theCase.validToDate) {
        autofill('isolationToDate', theCase.validToDate, theCase)
      }

      if (theCase.caseFacts) {
        autofill('courtCaseFacts', theCase.caseFacts, theCase)
      }

      if (theCase.legalArguments) {
        autofill('courtLegalArguments', theCase.legalArguments, theCase)
      }

      setWorkingCase(theCase)
    }
  }, [workingCase, setWorkingCase, data, updateCase, autofill])

  return (
    <PageLayout
      workingCase={workingCase}
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                {formatMessage(m.title)}
              </Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={5}>
              <Accordion>
                <PoliceRequestAccordionItem workingCase={workingCase} />
                <AccordionItem
                  id="caseFileList"
                  label={`Rannsóknargögn (${
                    workingCase.caseFiles?.length ?? 0
                  })`}
                  labelVariant="h3"
                >
                  <CaseFileList
                    caseId={workingCase.id}
                    files={workingCase.caseFiles ?? []}
                    canOpenFiles={
                      workingCase.judge !== null &&
                      workingCase.judge?.id === user?.id
                    }
                  />
                </AccordionItem>
              </Accordion>
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
                  defaultValue={workingCase.courtCaseFacts}
                  placeholder={formatMessage(
                    m.sections.courtCaseFacts.placeholder,
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'courtCaseFacts',
                      event,
                      ['empty'],
                      workingCase,
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
                  defaultValue={workingCase.courtLegalArguments}
                  placeholder={formatMessage(
                    m.sections.courtLegalArguments.placeholder,
                  )}
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'courtLegalArguments',
                      event,
                      ['empty'],
                      workingCase,
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
                  required
                />
              </Box>
            </Box>
            <Box component="section" marginBottom={5}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  {`${formatMessage(m.sections.decision.title)} `}
                  <Text as="span" fontWeight="semiBold" color="red600">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={5}>
                <Decision
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  acceptedLabelText={formatMessage(
                    m.sections.decision.acceptLabel,
                    {
                      caseType:
                        workingCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhald'
                          : 'farbann',
                    },
                  )}
                  rejectedLabelText={formatMessage(
                    m.sections.decision.rejectLabel,
                    {
                      caseType:
                        workingCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhald'
                          : 'farbann',
                    },
                  )}
                  partiallyAcceptedLabelText={formatMessage(
                    m.sections.decision.partiallyAcceptLabel,
                  )}
                  dismissLabelText={formatMessage(
                    m.sections.decision.dismissLabel,
                    {
                      caseType:
                        workingCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhald'
                          : 'farbann',
                    },
                  )}
                  acceptingAlternativeTravelBanLabelText={formatMessage(
                    m.sections.decision.acceptingAlternativeTravelBanLabel,
                  )}
                />
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  {formatMessage(m.sections.ruling.title)}
                </Text>
              </Box>
              <RulingInput
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                isRequired
              />
            </Box>
            {workingCase.decision &&
              workingCase.decision !== CaseDecision.REJECTING &&
              workingCase.decision !== CaseDecision.DISMISSING && (
                <Box
                  component="section"
                  marginBottom={7}
                  data-testid="caseDecisionSection"
                >
                  <Box marginBottom={2}>
                    <Text as="h3" variant="h3">
                      {workingCase.type === CaseType.CUSTODY &&
                      isAcceptingCaseDecision(workingCase.decision)
                        ? 'Gæsluvarðhald'
                        : 'Farbann'}
                    </Text>
                  </Box>
                  <DateTime
                    name="validToDate"
                    datepickerLabel={
                      workingCase.type === CaseType.CUSTODY &&
                      isAcceptingCaseDecision(workingCase.decision)
                        ? 'Gæsluvarðhald til'
                        : 'Farbann til'
                    }
                    selectedDate={
                      workingCase.validToDate
                        ? new Date(workingCase.validToDate)
                        : undefined
                    }
                    minDate={new Date()}
                    onChange={(date: Date | undefined, valid: boolean) => {
                      newSetAndSendDateToServer(
                        'validToDate',
                        date,
                        valid,
                        workingCase,
                        setWorkingCase,
                        setValidToDateIsValid,
                        updateCase,
                      )
                    }}
                    required
                  />
                </Box>
              )}
            {workingCase.type === CaseType.CUSTODY &&
              isAcceptingCaseDecision(workingCase.decision) && (
                <Box component="section" marginBottom={8}>
                  <Box marginBottom={2}>
                    <Text as="h3" variant="h3">
                      {formatMessage(m.sections.custodyRestrictions.title)}
                    </Text>
                  </Box>
                  <BlueBox>
                    <Box marginBottom={3}>
                      <CheckboxList
                        checkboxes={isolation(workingCase.accusedGender)}
                        selected={workingCase.custodyRestrictions}
                        onChange={(id) =>
                          setCheckboxAndSendToServer(
                            'custodyRestrictions',
                            id,
                            workingCase,
                            setWorkingCase,
                            updateCase,
                          )
                        }
                        fullWidth
                      />
                    </Box>
                    <DateTime
                      name="isolationToDate"
                      datepickerLabel="Einangrun til"
                      disabled={
                        !workingCase.custodyRestrictions?.includes(
                          CaseCustodyRestrictions.ISOLATION,
                        )
                      }
                      selectedDate={
                        workingCase.isolationToDate
                          ? new Date(workingCase.isolationToDate)
                          : workingCase.validToDate
                          ? new Date(workingCase.validToDate)
                          : undefined
                      }
                      // Isolation can never be set in the past.
                      minDate={new Date()}
                      maxDate={
                        workingCase.validToDate
                          ? new Date(workingCase.validToDate)
                          : undefined
                      }
                      onChange={(date: Date | undefined, valid: boolean) => {
                        newSetAndSendDateToServer(
                          'isolationToDate',
                          date,
                          valid,
                          workingCase,
                          setWorkingCase,
                          setIsolationToIsValid,
                          updateCase,
                        )
                      }}
                      blueBox={false}
                      backgroundColor={
                        workingCase.custodyRestrictions?.includes(
                          CaseCustodyRestrictions.ISOLATION,
                        )
                          ? 'white'
                          : 'blue'
                      }
                    />
                  </BlueBox>
                </Box>
              )}
          </FormContentContainer>
          <FormContentContainer isFooter>
            <FormFooter
              previousUrl={`${Constants.COURT_RECORD_ROUTE}/${workingCase.id}`}
              nextUrl={`${Constants.RULING_STEP_TWO_ROUTE}/${id}`}
              nextIsDisabled={!isRulingStepOneValidRC(workingCase)}
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepOne
