import React, { useEffect, useState } from 'react'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  Input,
  DatePicker,
  RadioButton,
  Tooltip,
} from '@island.is/island-ui/core'
import {
  Case,
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CaseType,
  UpdateCase,
} from '@island.is/judicial-system/types'
import { isNextDisabled } from '@island.is/judicial-system-web/src/utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import {
  FormFooter,
  PageLayout,
  BlueBox,
  TimeInputField,
} from '@island.is/judicial-system-web/src/shared-components'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import {
  CaseQuery,
  UpdateCaseMutation,
} from '@island.is/judicial-system-web/src/graphql'
import {
  ProsecutorSubsections,
  Sections,
} from '@island.is/judicial-system-web/src/types'
import {
  validateAndSendToServer,
  removeTabsValidateAndSet,
  setCheckboxAndSendToServer,
  setAndSendDateToServer,
  validateAndSetTime,
  validateAndSendTimeToServer,
  getTimeFromDate,
  setAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import parseISO from 'date-fns/parseISO'
import { formatDate } from '@island.is/judicial-system/formatters'
import CheckboxList from 'apps/judicial-system/web/src/shared-components/CheckboxList/CheckboxList'
import {
  custodyProvisions,
  travelBanProvisions,
} from 'apps/judicial-system/web/src/utils/laws'
import {
  alternativeTravelBanRestrictions,
  restrictions,
} from 'apps/judicial-system/web/src/utils/Restrictions'

interface CaseData {
  case?: Case
}

export const StepThree: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const { id } = useParams<{ id: string }>()

  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )

  const [requestedCustodyEndTime, setRequestedCustodyEndTime] = useState<
    string
  >()

  const [
    requestedCustodyEndDateErrorMessage,
    setRequestedCustodyEndDateErrorMessage,
  ] = useState<string>('')

  const [
    requestedCustodyEndTimeErrorMessage,
    setRequestedCustodyEndTimeErrorMessage,
  ] = useState<string>('')

  const { data, loading } = useQuery<CaseData>(CaseQuery, {
    variables: { input: { id: id } },
    fetchPolicy: 'no-cache',
  })

  const resCase = data?.case

  useEffect(() => {
    document.title = 'Dómkröfur og lagagrundvöllur - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    if (!workingCase && resCase) {
      setRequestedCustodyEndTime(
        getTimeFromDate(resCase.requestedCustodyEndDate),
      )

      setWorkingCase(resCase)
    }
  }, [workingCase, setWorkingCase, resCase])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.lawsBroken || '',
        validations: ['empty'],
      },
      {
        value: workingCase?.requestedCustodyEndDate || '',
        validations: ['empty'],
      },
      {
        value: requestedCustodyEndTime || '',
        validations: ['empty', 'time-format'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, setIsStepIllegal, requestedCustodyEndTime])

  const [updateCaseMutation] = useMutation(UpdateCaseMutation)

  const updateCase = async (id: string, updateCase: UpdateCase) => {
    const { data } = await updateCaseMutation({
      variables: { input: { id, ...updateCase } },
    })

    const resCase = data?.updateCase

    if (resCase) {
      // Do smoething with the result. In particular, we want th modified timestamp passed between
      // the client and the backend so that we can handle multiple simultanious updates.
    }

    return resCase
  }

  return (
    <PageLayout
      activeSection={
        workingCase?.parentCase ? Sections.EXTENSION : Sections.PROSECUTOR
      }
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_THREE
      }
      isLoading={loading}
      notFound={data?.case === undefined}
      decision={workingCase?.decision}
      parentCaseDecision={workingCase?.parentCase?.decision}
      // TODO: UNCOMMENT
      caseType={CaseType.TRAVEL_BAN} // {workingCase.caseType}
    >
      {workingCase ? (
        <>
          <Box marginBottom={7}>
            <Text as="h1" variant="h1">
              Dómkröfur og lagagrundvöllur
            </Text>
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Dómkröfur{' '}
                {
                  // TODO: UNCOMMENT
                  /*workingCase.caseType*/ workingCase.comments ===
                  CaseType.CUSTODY ? (
                    <Tooltip text="Hér er hægt að velja um gæsluvarðhald eða gæsluvarðhald með farbanni til vara. Sé farbann til vara valið, endurspeglar valið dómkröfurnar á næstu síðu." />
                  ) : null
                }
              </Text>
              {workingCase.parentCase && (
                <Box marginTop={1}>
                  <Text>
                    Fyrri gæsla var/er til{' '}
                    <Text as="span" fontWeight="semiBold">
                      {formatDate(
                        workingCase.parentCase.custodyEndDate,
                        'PPPPp',
                      )?.replace('dagur,', 'dagsins')}
                    </Text>
                  </Text>
                </Box>
              )}
            </Box>
            {
              // TODO: UNCOMMENT
              // TODO: THIS IS DUPLICATE CODE, REFACTOR!!
              /*workingCase.caseType*/ workingCase.comments ===
              CaseType.CUSTODY ? (
                <BlueBox>
                  <Box marginBottom={2}>
                    <GridRow>
                      <GridColumn span="5/12">
                        <RadioButton
                          name="alternativeTravelBan"
                          id="alternativeTravelBanOff"
                          label="Gæsluvarðhald"
                          checked={!workingCase.alternativeTravelBan}
                          onChange={() =>
                            setAndSendToServer(
                              'alternativeTravelBan',
                              false,
                              workingCase,
                              setWorkingCase,
                              updateCase,
                            )
                          }
                          large
                          filled
                        />
                      </GridColumn>
                      <GridColumn span="7/12">
                        <RadioButton
                          name="alternativeTravelBan"
                          id="alternativeTravelBanOn"
                          label="Gæsluvarðhald, farbann til vara"
                          checked={workingCase.alternativeTravelBan}
                          onChange={() =>
                            setAndSendToServer(
                              'alternativeTravelBan',
                              true,
                              workingCase,
                              setWorkingCase,
                              updateCase,
                            )
                          }
                          large
                          filled
                        />
                      </GridColumn>
                    </GridRow>
                  </Box>
                  <GridRow>
                    <GridColumn span="5/8">
                      <DatePicker
                        id="reqCustodyEndDate"
                        label="Gæsluvarðhald til"
                        placeholderText="Veldu dagsetningu"
                        selected={
                          workingCase.requestedCustodyEndDate
                            ? parseISO(
                                workingCase.requestedCustodyEndDate?.toString(),
                              )
                            : null
                        }
                        locale="is"
                        minDate={new Date()}
                        hasError={requestedCustodyEndDateErrorMessage !== ''}
                        errorMessage={requestedCustodyEndDateErrorMessage}
                        handleCloseCalendar={(date) =>
                          setAndSendDateToServer(
                            'requestedCustodyEndDate',
                            workingCase.requestedCustodyEndDate,
                            date,
                            workingCase,
                            true,
                            setWorkingCase,
                            updateCase,
                            setRequestedCustodyEndDateErrorMessage,
                          )
                        }
                        required
                      />
                    </GridColumn>
                    <GridColumn span="3/8">
                      <TimeInputField
                        disabled={!workingCase?.requestedCustodyEndDate}
                        onChange={(evt) =>
                          validateAndSetTime(
                            'requestedCustodyEndDate',
                            workingCase.requestedCustodyEndDate,
                            evt.target.value,
                            ['empty', 'time-format'],
                            workingCase,
                            setWorkingCase,
                            requestedCustodyEndTimeErrorMessage,
                            setRequestedCustodyEndTimeErrorMessage,
                            setRequestedCustodyEndTime,
                          )
                        }
                        onBlur={(evt) =>
                          validateAndSendTimeToServer(
                            'requestedCustodyEndDate',
                            workingCase.requestedCustodyEndDate,
                            evt.target.value,
                            ['empty', 'time-format'],
                            workingCase,
                            updateCase,
                            setRequestedCustodyEndTimeErrorMessage,
                          )
                        }
                      >
                        <Input
                          data-testid="requestedCustodyEndTime"
                          name="requestedCustodyEndTime"
                          label="Tímasetning (kk:mm)"
                          placeholder="Settu inn tíma"
                          defaultValue={requestedCustodyEndTime}
                          errorMessage={requestedCustodyEndTimeErrorMessage}
                          hasError={requestedCustodyEndTimeErrorMessage !== ''}
                          required
                        />
                      </TimeInputField>
                    </GridColumn>
                  </GridRow>
                </BlueBox>
              ) : (
                <GridRow>
                  <GridColumn span="5/8">
                    <DatePicker
                      id="reqCustodyEndDate"
                      label="Farbann til"
                      placeholderText="Veldu dagsetningu"
                      selected={
                        workingCase.requestedCustodyEndDate
                          ? parseISO(
                              workingCase.requestedCustodyEndDate?.toString(),
                            )
                          : null
                      }
                      locale="is"
                      minDate={new Date()}
                      hasError={requestedCustodyEndDateErrorMessage !== ''}
                      errorMessage={requestedCustodyEndDateErrorMessage}
                      handleCloseCalendar={(date) =>
                        setAndSendDateToServer(
                          'requestedCustodyEndDate',
                          workingCase.requestedCustodyEndDate,
                          date,
                          workingCase,
                          true,
                          setWorkingCase,
                          updateCase,
                          setRequestedCustodyEndDateErrorMessage,
                        )
                      }
                      required
                    />
                  </GridColumn>
                  <GridColumn span="3/8">
                    <TimeInputField
                      disabled={!workingCase?.requestedCustodyEndDate}
                      onChange={(evt) =>
                        validateAndSetTime(
                          'requestedCustodyEndDate',
                          workingCase.requestedCustodyEndDate,
                          evt.target.value,
                          ['empty', 'time-format'],
                          workingCase,
                          setWorkingCase,
                          requestedCustodyEndTimeErrorMessage,
                          setRequestedCustodyEndTimeErrorMessage,
                          setRequestedCustodyEndTime,
                        )
                      }
                      onBlur={(evt) =>
                        validateAndSendTimeToServer(
                          'requestedCustodyEndDate',
                          workingCase.requestedCustodyEndDate,
                          evt.target.value,
                          ['empty', 'time-format'],
                          workingCase,
                          updateCase,
                          setRequestedCustodyEndTimeErrorMessage,
                        )
                      }
                    >
                      <Input
                        data-testid="requestedCustodyEndTime"
                        name="requestedCustodyEndTime"
                        label="Tímasetning (kk:mm)"
                        placeholder="Settu inn tíma"
                        defaultValue={requestedCustodyEndTime}
                        errorMessage={requestedCustodyEndTimeErrorMessage}
                        hasError={requestedCustodyEndTimeErrorMessage !== ''}
                        required
                      />
                    </TimeInputField>
                  </GridColumn>
                </GridRow>
              )
            }
          </Box>
          <Box component="section" marginBottom={7}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Lagaákvæði sem brot varða við
              </Text>
            </Box>
            <Input
              data-testid="lawsBroken"
              name="lawsBroken"
              label="Lagaákvæði sem ætluð brot kærða þykja varða við"
              placeholder="Skrá inn þau lagaákvæði sem brotið varðar við, til dæmis 1. mgr. 244 gr. almennra hegningarlaga nr. 19/1940..."
              defaultValue={workingCase?.lawsBroken}
              errorMessage={lawsBrokenErrorMessage}
              hasError={lawsBrokenErrorMessage !== ''}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'lawsBroken',
                  event,
                  ['empty'],
                  workingCase,
                  setWorkingCase,
                  lawsBrokenErrorMessage,
                  setLawsBrokenErrorMessage,
                )
              }
              onBlur={(event) =>
                validateAndSendToServer(
                  'lawsBroken',
                  event.target.value,
                  ['empty'],
                  workingCase,
                  updateCase,
                  setLawsBrokenErrorMessage,
                )
              }
              required
              textarea
              rows={7}
            />
          </Box>
          <Box component="section" marginBottom={5}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Lagaákvæði sem krafan er byggð á{' '}
                <Text as="span" color={'red600'} fontWeight="semiBold">
                  *
                </Text>
              </Text>
            </Box>
            <BlueBox>
              <CheckboxList
                checkboxes={
                  workingCase.comments === CaseType.CUSTODY // TODO: PUT TYPE NOT COMMENT!!!
                    ? custodyProvisions
                    : travelBanProvisions
                }
                selected={workingCase.custodyProvisions}
                onChange={(id) =>
                  setCheckboxAndSendToServer(
                    'custodyProvisions',
                    id,
                    workingCase,
                    setWorkingCase,
                    updateCase,
                  )
                }
              />
            </BlueBox>
          </Box>
          {workingCase.type === CaseType.TRAVEL_BAN && ( // TODO LAGA IF
            <Box component="section" marginBottom={10}>
              <Box marginBottom={3}>
                <Box marginBottom={1}>
                  <Text as="h3" variant="h3">
                    Takmarkanir á gæslu
                  </Text>
                </Box>
                <Text>Ef ekkert er valið er gæsla án takmarkana</Text>
              </Box>
              <BlueBox>
                <CheckboxList
                  checkboxes={restrictions}
                  selected={workingCase.requestedCustodyRestrictions}
                  onChange={(id) =>
                    setCheckboxAndSendToServer(
                      'requestedCustodyRestrictions',
                      id,
                      workingCase,
                      setWorkingCase,
                      updateCase,
                    )
                  }
                />
              </BlueBox>
            </Box>
          )}
          {workingCase.type !== CaseType.TRAVEL_BAN && ( // TODO LAGA IF
            <Box component="section" marginBottom={4}>
              <Box marginBottom={3}>
                <Text as="h3" variant="h3">
                  Takmarkanir og tilhögun farbanns
                </Text>
                <Text>Ef ekkert er valið er farbann án takmarkana.</Text>
              </Box>
              <BlueBox>
                <Box marginBottom={3}>
                  <CheckboxList
                    checkboxes={alternativeTravelBanRestrictions}
                    selected={workingCase.custodyRestrictions} // REQUESTED !!!!
                    onChange={(id) =>
                      setCheckboxAndSendToServer(
                        'custodyRestrictions', // REQUESTED !!!!
                        id,
                        workingCase,
                        setWorkingCase,
                        updateCase,
                      )
                    }
                  />
                </Box>
                <Input
                  name="otherRestrictions"
                  data-testid="otherRestrictions"
                  label="Nánari útlistun eða aðrar takmarkanir"
                  defaultValue={workingCase.otherRestrictions} // REQUESTED !!!!
                  placeholder="Til dæmis hvernig tilkynningarskyldu sé háttað..."
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'otherRestrictions', // REQUESTED !!!!
                      event,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'otherRestrictions', // REQUESTED !!!!
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                    )
                  }
                  rows={10}
                  textarea
                />
              </BlueBox>
            </Box>
          )}
          <FormFooter
            nextUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
            nextIsDisabled={
              isStepIllegal || workingCase.custodyProvisions?.length === 0
            }
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default StepThree
