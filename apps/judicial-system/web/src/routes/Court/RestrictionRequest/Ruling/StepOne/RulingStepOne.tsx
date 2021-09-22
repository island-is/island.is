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
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  parseArray,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
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
import { rcRulingStepOne } from '@island.is/judicial-system-web/messages'

export const RulingStepOne: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [validToDateIsValid, setValidToDateIsValid] = useState<boolean>(true)
  const [isolationToIsValid, setIsolationToIsValid] = useState<boolean>(true)
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

  /**
   * Prefills the ruling of extension cases with the parent case ruling
   * if this case descition is ACCEPTING.
   */
  useEffect(() => {
    if (
      workingCase?.parentCase &&
      workingCase?.decision === CaseDecision.ACCEPTING &&
      !workingCase.ruling
    ) {
      updateCase(
        workingCase.id,
        parseString('ruling', workingCase.parentCase.ruling ?? ''),
      )
      setWorkingCase({
        ...workingCase,
        ruling: workingCase.parentCase.ruling,
      })
    }
  }, [workingCase, updateCase, setWorkingCase])

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.JUDGE_EXTENSION : Sections.JUDGE
      }
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={loading}
      notFound={data?.case === undefined}
      parentCaseDecision={workingCase?.parentCase?.decision}
      caseType={workingCase?.type}
      caseId={workingCase?.id}
    >
      {workingCase ? (
        <>
          <FormContentContainer>
            <Box marginBottom={7}>
              <Text as="h1" variant="h1">
                Úrskurður
              </Text>
            </Box>
            <Box component="section" marginBottom={5}>
              <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
              <CaseNumbers workingCase={workingCase} />
            </Box>
            <Box component="section" marginBottom={5}>
              <Accordion>
                <PoliceRequestAccordionItem workingCase={workingCase} />
                <AccordionItem
                  id="caseFileList"
                  label={`Rannsóknargögn (${workingCase.files?.length ?? 0})`}
                  labelVariant="h3"
                >
                  <CaseFileList
                    caseId={workingCase.id}
                    files={workingCase.files ?? []}
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
                  Greinargerð um málsatvik{' '}
                  <Tooltip
                    text={formatMessage(
                      rcRulingStepOne.sections.courtCaseFacts.tooltip,
                    )}
                  />
                </Text>
              </Box>
              <Box marginBottom={5}>
                <Input
                  data-testid="courtCaseFacts"
                  name="courtCaseFacts"
                  label="Málsatvik"
                  defaultValue={workingCase.courtCaseFacts}
                  placeholder="Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?"
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
                  Greinargerð um lagarök{' '}
                  <Tooltip
                    text={formatMessage(
                      rcRulingStepOne.sections.courtLegalArguments.tooltip,
                    )}
                  />
                </Text>
              </Box>
              <Box marginBottom={5}>
                <Input
                  data-testid="courtLegalArguments"
                  name="courtLegalArguments"
                  label="Lagarök"
                  defaultValue={workingCase.courtLegalArguments}
                  placeholder="Hvað hefur átt sér stað hingað til? Hver er framburður sakborninga og vitna? Hver er staða rannsóknar og næstu skref?"
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
                  Úrskurður{' '}
                  <Text as="span" fontWeight="semiBold" color="red600">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={5}>
                <Decision
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  acceptedLabelText={`Krafa um ${
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann'
                  } samþykkt`}
                  rejectedLabelText={`Kröfu um ${
                    workingCase.type === CaseType.CUSTODY
                      ? 'gæsluvarðhald'
                      : 'farbann'
                  } hafnað`}
                  partiallyAcceptedLabelText="Kröfu um gæsluvarðhald hafnað en úrskurðað í farbann"
                  dismissLabelText={formatMessage(
                    rcRulingStepOne.sections.decision.dismissLabel,
                    {
                      caseType:
                        workingCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhald'
                          : 'farbann',
                    },
                  )}
                />
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Niðurstaða
                </Text>
              </Box>
              <RulingInput
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
                isRequired
              />
            </Box>
            {workingCase.decision &&
              workingCase.decision !== CaseDecision.REJECTING && (
                <Box
                  component="section"
                  marginBottom={7}
                  data-testid="caseDecisionSection"
                >
                  <Box marginBottom={2}>
                    <Text as="h3" variant="h3">
                      {workingCase.type === CaseType.CUSTODY &&
                      workingCase.decision === CaseDecision.ACCEPTING
                        ? 'Gæsluvarðhald'
                        : 'Farbann'}
                    </Text>
                  </Box>
                  <DateTime
                    name="validToDate"
                    datepickerLabel={
                      workingCase.type === CaseType.CUSTODY &&
                      workingCase.decision === CaseDecision.ACCEPTING
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
              workingCase.decision === CaseDecision.ACCEPTING && (
                <Box component="section" marginBottom={8}>
                  <Box marginBottom={2}>
                    <Text as="h3" variant="h3">
                      Takmarkanir á gæslu
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
              nextIsDisabled={
                !workingCase.courtCaseFacts ||
                !workingCase.courtLegalArguments ||
                !workingCase.decision ||
                !validate(workingCase.ruling ?? '', 'empty').isValid ||
                (workingCase.decision !== CaseDecision.REJECTING &&
                  (!validToDateIsValid || !isolationToIsValid))
              }
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepOne
