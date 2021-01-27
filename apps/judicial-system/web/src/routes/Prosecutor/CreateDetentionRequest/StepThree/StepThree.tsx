import React, { useEffect, useState } from 'react'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  Input,
  Checkbox,
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
  CustodyProvisionsSection,
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

  const restrictions = [
    {
      restriction: 'B - Einangrun',
      value: CaseCustodyRestrictions.ISOLATION,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      restriction: 'C - Heimsóknarbann',
      value: CaseCustodyRestrictions.VISITAION,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      value: CaseCustodyRestrictions.COMMUNICATION,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabann',
      value: CaseCustodyRestrictions.MEDIA,
      explination:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    },
  ]

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
                <Tooltip text="Hér er hægt að velja um gæsluvarðhald eða gæsluvarðhald með farbanni til vara. Sé farbann til vara valið, endurspeglar valið dómkröfurnar á næstu síðu." />
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
                    label="Gæsluvarðhald / farbann til"
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
          <CustodyProvisionsSection
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            updateCase={updateCase}
          />
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
              <GridContainer>
                <GridRow>
                  {restrictions.map((restriction, index) => (
                    <GridColumn span="6/12" key={index}>
                      <Box
                        // Do not add margins to the last two checkboxes
                        marginBottom={index < restrictions.length - 2 ? 3 : 0}
                      >
                        <Checkbox
                          name={restriction.restriction}
                          label={restriction.restriction}
                          value={restriction.value}
                          checked={
                            workingCase.requestedCustodyRestrictions &&
                            workingCase.requestedCustodyRestrictions.indexOf(
                              restriction.value,
                            ) > -1
                          }
                          tooltip={restriction.explination}
                          onChange={({ target }) =>
                            setCheckboxAndSendToServer(
                              'requestedCustodyRestrictions',
                              target.value,
                              workingCase,
                              setWorkingCase,
                              updateCase,
                            )
                          }
                          large
                          filled
                        />
                      </Box>
                    </GridColumn>
                  ))}
                </GridRow>
              </GridContainer>
            </BlueBox>
          </Box>
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
