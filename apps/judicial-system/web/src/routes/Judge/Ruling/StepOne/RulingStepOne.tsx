import React, { useEffect, useState, useCallback } from 'react'
import {
  Accordion,
  Box,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  FormFooter,
  PageLayout,
  PoliceRequestAccordionItem,
  BlueBox,
  CaseNumbers,
  FormContentContainer,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Case,
  CaseCustodyRestrictions,
  CaseDecision,
  CaseType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  parseArray,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/graphql'
import {
  CaseData,
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setAndSendToServer,
  setCheckboxAndSendToServer,
  newSetAndSendDateToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { isolation } from '@island.is/judicial-system-web/src/utils/Restrictions'
import CheckboxList from '@island.is/judicial-system-web/src/shared-components/CheckboxList/CheckboxList'
import { useRouter } from 'next/router'
import DateTime from '@island.is/judicial-system-web/src/shared-components/DateTime/DateTime'

export const RulingStepOne: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [rulingErrorMessage, setRulingErrorMessage] = useState('')

  const [custodyEndDateIsValid, setCustodyEndDateIsValid] = useState(true)
  const [isolationToIsValid, setIsolationToIsValid] = useState(true)

  const router = useRouter()
  const id = router.query.id
  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)
  const updateCase = useCallback(
    async (id: string, updateCase: UpdateCase) => {
      const { data } = await updateCaseMutation({
        variables: { input: { id, ...updateCase } },
      })
      const resCase = data?.updateCase
      if (resCase) {
        // Do something with the result. In particular, we want th modified timestamp passed between
        // the client and the backend so that we can handle multiple simultanious updates.
      }
      return resCase
    },
    [updateCaseMutation],
  )

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
            theCase.requestedCustodyRestrictions || [],
          ),
        )
      }

      if (!theCase.custodyEndDate) {
        theCase = {
          ...theCase,
          custodyEndDate: theCase.requestedCustodyEndDate,
        }

        updateCase(
          theCase.id,
          parseString('custodyEndDate', theCase.requestedCustodyEndDate || ''),
        )
      }

      if (!theCase.isolationTo) {
        theCase = {
          ...theCase,
          isolationTo: theCase.custodyEndDate,
        }

        updateCase(
          theCase.id,
          parseString('isolationTo', theCase.custodyEndDate || ''),
        )
      }

      setWorkingCase(theCase)
    }
  }, [workingCase, setWorkingCase, data, updateCase])

  /**
   * Prefills the ruling of extention cases with the parent case ruling
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
        parseString('ruling', workingCase.parentCase.ruling || ''),
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
              </Accordion>
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
                <BlueBox>
                  <Box marginBottom={2}>
                    <RadioButton
                      name="case-decision"
                      id="case-decision-accepting"
                      label={`Krafa um ${
                        workingCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhald'
                          : 'farbann'
                      } samþykkt`}
                      checked={workingCase.decision === CaseDecision.ACCEPTING}
                      onChange={() => {
                        setAndSendToServer(
                          'decision',
                          CaseDecision.ACCEPTING,
                          workingCase,
                          setWorkingCase,
                          updateCase,
                        )
                      }}
                      large
                      filled
                    />
                  </Box>
                  <Box
                    marginBottom={workingCase.type === CaseType.CUSTODY ? 2 : 0}
                  >
                    <RadioButton
                      name="case-decision"
                      id="case-decision-rejecting"
                      label={`Kröfu um ${
                        workingCase.type === CaseType.CUSTODY
                          ? 'gæsluvarðhald'
                          : 'farbann'
                      } hafnað`}
                      checked={workingCase.decision === CaseDecision.REJECTING}
                      onChange={() => {
                        setAndSendToServer(
                          'decision',
                          CaseDecision.REJECTING,
                          workingCase,
                          setWorkingCase,
                          updateCase,
                        )
                      }}
                      large
                      filled
                    />
                  </Box>
                  {workingCase.type === CaseType.CUSTODY && (
                    <RadioButton
                      name="case-decision"
                      id="case-decision-accepting-alternative-travel-ban"
                      label="Kröfu um gæsluvarðhald hafnað en úrskurðað í farbann"
                      checked={
                        workingCase.decision ===
                        CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN
                      }
                      onChange={() => {
                        setAndSendToServer(
                          'decision',
                          CaseDecision.ACCEPTING_ALTERNATIVE_TRAVEL_BAN,
                          workingCase,
                          setWorkingCase,
                          updateCase,
                        )
                      }}
                      large
                      filled
                    />
                  )}
                </BlueBox>
              </Box>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Niðurstaða
                </Text>
              </Box>
              <Input
                data-testid="ruling"
                name="ruling"
                label="Efni úrskurðar"
                placeholder="Hver er niðurstaðan að mati dómara?"
                defaultValue={workingCase.ruling}
                rows={16}
                errorMessage={rulingErrorMessage}
                hasError={rulingErrorMessage !== ''}
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'ruling',
                    event,
                    ['empty'],
                    workingCase,
                    setWorkingCase,
                    rulingErrorMessage,
                    setRulingErrorMessage,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'ruling',
                    event.target.value,
                    ['empty'],
                    workingCase,
                    updateCase,
                    setRulingErrorMessage,
                  )
                }
                textarea
                required
              />
            </Box>
            {workingCase.decision !== CaseDecision.REJECTING && (
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
                  name="custodyEndDate"
                  datepickerLabel={
                    workingCase.type === CaseType.CUSTODY &&
                    workingCase.decision === CaseDecision.ACCEPTING
                      ? 'Gæsluvarðhald til'
                      : 'Farbann til'
                  }
                  selectedDate={
                    workingCase.custodyEndDate
                      ? new Date(workingCase.custodyEndDate)
                      : undefined
                  }
                  minDate={new Date()}
                  onChange={(date: Date | undefined, valid: boolean) => {
                    newSetAndSendDateToServer(
                      'custodyEndDate',
                      date,
                      valid,
                      workingCase,
                      setWorkingCase,
                      setCustodyEndDateIsValid,
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
                        checkboxes={isolation}
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
                      name="isolationTo"
                      datepickerLabel="Einangrun til"
                      selectedDate={
                        workingCase.isolationTo
                          ? new Date(workingCase.isolationTo)
                          : workingCase.custodyEndDate
                          ? new Date(workingCase.custodyEndDate)
                          : undefined
                      }
                      // Isolation can never be set in the past.
                      minDate={new Date()}
                      maxDate={
                        workingCase.custodyEndDate
                          ? new Date(workingCase.custodyEndDate)
                          : undefined
                      }
                      onChange={(date: Date | undefined, valid: boolean) => {
                        newSetAndSendDateToServer(
                          'isolationTo',
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
                !workingCase.decision ||
                !validate(workingCase.ruling || '', 'empty').isValid ||
                (workingCase.decision !== CaseDecision.REJECTING &&
                  (!custodyEndDateIsValid || !isolationToIsValid))
              }
            />
          </FormContentContainer>
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepOne
