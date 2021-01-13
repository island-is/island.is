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
  UpdateCase,
} from '@island.is/judicial-system/types'
import { isNextDisabled } from '../../../../utils/stepHelper'
import { Validation } from '@island.is/judicial-system-web/src/utils/validate'
import { FormFooter } from '../../../../shared-components/FormFooter'
import * as Constants from '../../../../utils/constants'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
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
import BlueBox from '../../../../shared-components/BlueBox/BlueBox'
import parseISO from 'date-fns/parseISO'
import isNull from 'lodash/isNull'
import isValid from 'date-fns/isValid'
import TimeInputField from '../../../../shared-components/TimeInputField/TimeInputField'

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

  const caseCustodyProvisions = [
    {
      brokenLaw: 'a-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_A,
      explination:
        'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_B,
      explination:
        'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
    },
    {
      brokenLaw: 'c-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_C,
      explination:
        'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
    },
    {
      brokenLaw: 'd-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_D,
      explination:
        'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
    },
    {
      brokenLaw: '2. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_2,
      explination:
        'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 99. gr.',
      value: CaseCustodyProvisions._99_1_B,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      brokenLaw: '1. mgr. 100. gr. sml.',
      value: CaseCustodyProvisions._100_1,
      explination:
        'Nú eru skilyrði gæsluvarðhalds skv. 1. eða 2. mgr. 95. gr. fyrir hendi og getur dómari þá, í stað þess að úrskurða sakborning í gæsluvarðhald, mælt fyrir um vistun hans á sjúkrahúsi eða viðeigandi stofnun, bannað honum brottför af landinu ellegar lagt fyrir hann að halda sig á ákveðnum stað eða innan ákveðins svæðis.',
    },
  ]

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
    document.title = 'Lagagrundvöllur og dómkröfur - Réttarvörslugátt'
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
      activeSection={Sections.PROSECUTOR}
      activeSubSection={
        ProsecutorSubsections.CREATE_DETENTION_REQUEST_STEP_THREE
      }
      isLoading={loading}
      notFound={data?.case === undefined}
    >
      {workingCase ? (
        <>
          <Box marginBottom={7}>
            <Text as="h1" variant="h1">
              Lagagrundvöllur og dómkröfur
            </Text>
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
              <GridContainer>
                <GridRow>
                  {caseCustodyProvisions.map((provision, index) => {
                    return (
                      <GridColumn span="6/12" key={index}>
                        <Box
                          marginBottom={
                            // Do not add margins to the last two items
                            index < caseCustodyProvisions.length - 2 ? 3 : 0
                          }
                        >
                          <Checkbox
                            name={provision.brokenLaw}
                            label={provision.brokenLaw}
                            value={provision.value}
                            checked={
                              workingCase.custodyProvisions &&
                              workingCase.custodyProvisions.indexOf(
                                provision.value,
                              ) > -1
                            }
                            tooltip={provision.explination}
                            onChange={({ target }) =>
                              setCheckboxAndSendToServer(
                                'custodyProvisions',
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
                    )
                  })}
                </GridRow>
              </GridContainer>
            </BlueBox>
          </Box>
          <Box component="section" marginBottom={7}>
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
          <Box component="section" marginBottom={10}>
            <Box marginBottom={3}>
              <Text as="h3" variant="h3">
                Tegund og gildistími{' '}
                <Tooltip text="Hér er hægt að velja um gæsluvarðhald eða gæsluvarðhald með farbanni til vara. Sé farbann til vara valið, endurspeglar valið dómkröfurnar á næstu síðu." />
              </Text>
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
