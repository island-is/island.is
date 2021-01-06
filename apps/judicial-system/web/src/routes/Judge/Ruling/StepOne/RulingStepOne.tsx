import {
  Accordion,
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridRow,
  Input,
  Text,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import { FormFooter } from '../../../../shared-components/FormFooter'
import {
  Case,
  CaseCustodyRestrictions,
  CaseDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import * as Constants from '../../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { parseArray, parseString } from '../../../../utils/formatters'
import { isNextDisabled } from '../../../../utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import PoliceRequestAccordionItem from '@island.is/judicial-system-web/src/shared-components/PoliceRequestAccordionItem/PoliceRequestAccordionItem'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  JudgeSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import TimeInputField from '@island.is/judicial-system-web/src/shared-components/TimeInputField/TimeInputField'
import {
  setAndSendDateToServer,
  validateAndSendTimeToServer,
  validateAndSendToServer,
  removeTabsValidateAndSet,
  validateAndSetTime,
} from '@island.is/judicial-system-web/src/utils/formHelper'

interface CaseData {
  case?: Case
}

export const RulingStepOne: React.FC = () => {
  const custodyEndTimeRef = useRef<HTMLInputElement>(null)
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [, setIsolationCheckbox] = useState<boolean>()
  const [rulingErrorMessage, setRulingErrorMessage] = useState('')
  const [custodyEndTimeErrorMessage, setCustodyEndTimeErrorMessage] = useState(
    '',
  )
  const { id } = useParams<{ id: string }>()
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

      setWorkingCase(theCase)
    }
  }, [workingCase, setWorkingCase, data, updateCase])

  useEffect(() => {
    let requiredFields: { value: string; validations: Validation[] }[] = [
      { value: workingCase?.ruling || '', validations: ['empty'] },
    ]
    if (workingCase?.decision !== CaseDecision.REJECTING) {
      requiredFields = requiredFields.concat([
        { value: workingCase?.custodyEndDate || '', validations: ['empty'] },
        {
          value: custodyEndTimeRef.current?.value || '',
          validations: ['empty', 'time-format'],
        },
      ])
    }

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, isStepIllegal])

  return (
    <PageLayout
      activeSection={Sections.JUDGE}
      activeSubSection={JudgeSubsections.RULING_STEP_ONE}
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Úrskurður
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Accordion>
              <PoliceRequestAccordionItem workingCase={workingCase} />
            </Accordion>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Niðurstaða úrskurðar
              </Text>
            </Box>
            <Box marginBottom={2}>
              <Input
                data-testid="ruling"
                name="ruling"
                label="Niðurstaða úrskurðar"
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
            <GridRow>
              <GridColumn span="6/12">
                <Checkbox
                  name="rejectRequest"
                  label="Hafna kröfu"
                  onChange={({ target }) => {
                    setWorkingCase({
                      ...workingCase,
                      decision: target.checked
                        ? CaseDecision.REJECTING
                        : CaseDecision.ACCEPTING,
                    })
                    updateCase(
                      workingCase.id,
                      parseString(
                        'decision',
                        target.checked
                          ? CaseDecision.REJECTING
                          : CaseDecision.ACCEPTING,
                      ),
                    )
                  }}
                  checked={workingCase.decision === CaseDecision.REJECTING}
                  large
                />
              </GridColumn>
            </GridRow>
          </Box>
          {workingCase.decision !== CaseDecision.REJECTING && (
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Gæsluvarðhaldstími
                </Text>
              </Box>
              <GridRow>
                <GridColumn span="6/12">
                  <DatePicker
                    id="custodyEndDate"
                    label="Gæsluvarðhald til"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    selected={
                      workingCase.custodyEndDate
                        ? new Date(workingCase.custodyEndDate)
                        : workingCase.requestedCustodyEndDate
                        ? new Date(workingCase.requestedCustodyEndDate)
                        : null
                    }
                    handleChange={(date) =>
                      setAndSendDateToServer(
                        'custodyEndDate',
                        workingCase.custodyEndDate,
                        date,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                    required
                  />
                </GridColumn>
                <GridColumn span="5/12">
                  <TimeInputField
                    onChange={(evt) =>
                      validateAndSetTime(
                        'custodyEndDate',
                        workingCase.custodyEndDate,
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        setWorkingCase,
                        custodyEndTimeErrorMessage,
                        setCustodyEndTimeErrorMessage,
                      )
                    }
                    onBlur={(evt) =>
                      validateAndSendTimeToServer(
                        'custodyEndDate',
                        workingCase.custodyEndDate,
                        evt.target.value,
                        ['empty', 'time-format'],
                        workingCase,
                        updateCase,
                        setCustodyEndTimeErrorMessage,
                      )
                    }
                  >
                    <Input
                      data-testid="custodyEndTime"
                      name="custodyEndTime"
                      label="Tímasetning"
                      ref={custodyEndTimeRef}
                      defaultValue={
                        workingCase.custodyEndDate?.includes('T')
                          ? formatDate(workingCase.custodyEndDate, TIME_FORMAT)
                          : workingCase.requestedCustodyEndDate?.includes('T')
                          ? formatDate(
                              workingCase.requestedCustodyEndDate,
                              TIME_FORMAT,
                            )
                          : undefined
                      }
                      hasError={custodyEndTimeErrorMessage !== ''}
                      errorMessage={custodyEndTimeErrorMessage}
                      required
                    />
                  </TimeInputField>
                </GridColumn>
              </GridRow>
            </Box>
          )}
          {workingCase.decision !== CaseDecision.REJECTING && (
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Takmarkanir á gæslu
                </Text>
              </Box>
              <Box marginBottom={1}>
                <GridRow>
                  <GridColumn span="6/12">
                    <Checkbox
                      name="B - Einangrun"
                      label="Kærði skal sæta einangrun"
                      tooltip="Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum."
                      value={CaseCustodyRestrictions.ISOLATION}
                      checked={workingCase.custodyRestrictions?.includes(
                        CaseCustodyRestrictions.ISOLATION,
                      )}
                      onChange={({ target }) => {
                        // Create a copy of the state
                        const copyOfState = Object.assign(workingCase, {})

                        const restrictionIsSelected = copyOfState.custodyRestrictions?.includes(
                          target.value as CaseCustodyRestrictions,
                        )

                        // Toggle the checkbox on or off
                        setIsolationCheckbox(!restrictionIsSelected)

                        // If the user is checking the box, add the restriction to the state
                        if (!restrictionIsSelected) {
                          if (copyOfState.custodyRestrictions === null) {
                            copyOfState.custodyRestrictions = []
                          }

                          copyOfState.custodyRestrictions &&
                            copyOfState.custodyRestrictions.push(
                              target.value as CaseCustodyRestrictions,
                            )
                        }
                        // If the user is unchecking the box, remove the restriction from the state
                        else {
                          copyOfState.custodyRestrictions &&
                            copyOfState.custodyRestrictions.splice(
                              copyOfState.custodyRestrictions.indexOf(
                                target.value as CaseCustodyRestrictions,
                              ),
                              1,
                            )
                        }

                        setWorkingCase({
                          ...workingCase,
                          custodyRestrictions: copyOfState.custodyRestrictions,
                        })

                        // Save case
                        updateCase(
                          workingCase.id,
                          parseArray(
                            'custodyRestrictions',
                            copyOfState.custodyRestrictions || [],
                          ),
                        )
                      }}
                      large
                    />
                  </GridColumn>
                </GridRow>
              </Box>
            </Box>
          )}
          <FormFooter
            nextUrl={`${Constants.RULING_STEP_TWO_ROUTE}/${id}`}
            nextIsDisabled={isStepIllegal}
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepOne
