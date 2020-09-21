import React, { useState, useEffect } from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  DatePicker,
  Input,
  Checkbox,
} from '@island.is/island-ui/core'
import {
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
  CreateDetentionReqStepOneCase,
  CaseState,
} from '@island.is/judicial-system-web/src/types'
import { updateState, autoSave } from '../../../utils/stepHelper'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import { setHours, setMinutes, isValid, parseISO } from 'date-fns'
import { isNull } from 'lodash'
import { FormFooter } from '../../../shared-components/FormFooter'
import * as api from '../../../api'
import {
  parseArray,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'

export const StepTwo: React.FC = () => {
  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)

  const [workingCase, setWorkingCase] = useState<CreateDetentionReqStepOneCase>(
    {
      id: caseDraftJSON.id,
      case: {
        policeCaseNumber: caseDraftJSON.case.policeCaseNumber ?? '',
        suspectNationalId: caseDraftJSON.case.suspectNationalId ?? '',
        suspectName: caseDraftJSON.case.suspectName ?? '',
        suspectAddress: caseDraftJSON.case.suspectAddress ?? '',
        court: caseDraftJSON.case.court ?? '',
        arrestDate: caseDraftJSON.case.arrestDate ?? null,
        arrestTime: caseDraftJSON.case.arrestTime ?? '',
        requestedCourtDate: caseDraftJSON.case.requestedCourtDate ?? null,
        requestedCourtTime: caseDraftJSON.case.requestedCourtTime ?? '',
        requestedCustodyEndDate:
          caseDraftJSON.case.requestedCustodyEndDate ?? null,
        requestedCustodyEndTime:
          caseDraftJSON.case.requestedCustodyEndTime ?? '',
        lawsBroken: caseDraftJSON.case.lawsBroken ?? '',
        caseCustodyProvisions: caseDraftJSON.case.caseCustodyProvisions ?? [],
        restrictions: caseDraftJSON.case.restrictions ?? [],
        caseFacts: caseDraftJSON.case.caseFacts ?? '',
        witnessAccounts: caseDraftJSON.case.witnessAccounts ?? '',
        investigationProgress: caseDraftJSON.case.investigationProgress ?? '',
        legalArguments: caseDraftJSON.case.legalArguments ?? '',
        comments: caseDraftJSON.case.comments ?? '',
      },
    },
  )
  const [
    requestedCustodyEndDateErrorMessage,
    setRequestedCustodyEndDateErrorMessage,
  ] = useState<string>('')
  const [
    requestedCustodyEndTimeErrorMessage,
    setRequestedCustodyEndTimeErrorMessage,
  ] = useState<string>('')
  const [lawsBrokenErrorMessage, setLawsBrokenErrorMessage] = useState<string>(
    '',
  )

  const [checkboxOne, setCheckboxOne] = useState(
    caseDraftJSON.case.caseCustodyProvisions.indexOf(
      CaseCustodyProvisions._95_1_A,
    ) > -1,
  )
  const [checkboxTwo, setCheckboxTwo] = useState(
    caseDraftJSON.case.caseCustodyProvisions.indexOf(
      CaseCustodyProvisions._95_1_B,
    ) > -1,
  )
  const [checkboxThree, setCheckboxThree] = useState(
    caseDraftJSON.case.caseCustodyProvisions.indexOf(
      CaseCustodyProvisions._95_1_C,
    ) > -1,
  )
  const [checkboxFour, setCheckboxFour] = useState(
    caseDraftJSON.case.caseCustodyProvisions.indexOf(
      CaseCustodyProvisions._95_1_D,
    ) > -1,
  )
  const [checkboxFive, setCheckboxFive] = useState(
    caseDraftJSON.case.caseCustodyProvisions.indexOf(
      CaseCustodyProvisions._95_2,
    ) > -1,
  )
  const [checkboxSix, setCheckboxSix] = useState(
    caseDraftJSON.case.caseCustodyProvisions.indexOf(
      CaseCustodyProvisions._99_1_B,
    ) > -1,
  )
  const [restrictionCheckboxOne, setRestrictionCheckboxOne] = useState(
    caseDraftJSON.case.restrictions.indexOf(CaseCustodyRestrictions.ISOLATION) >
      -1,
  )
  const [restrictionCheckboxTwo, setRestrictionCheckboxTwo] = useState(
    caseDraftJSON.case.restrictions.indexOf(CaseCustodyRestrictions.VISITAION) >
      -1,
  )
  const [restrictionCheckboxThree, setRestrictionCheckboxThree] = useState(
    caseDraftJSON.case.restrictions.indexOf(
      CaseCustodyRestrictions.COMMUNICATION,
    ) > -1,
  )
  const [restrictionCheckboxFour, setRestrictionCheckboxFour] = useState(
    caseDraftJSON.case.restrictions.indexOf(CaseCustodyRestrictions.MEDIA) > -1,
  )

  const caseCustodyProvisions = [
    {
      brokenLaw: 'a-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_A,
      getCheckbox: checkboxOne,
      setCheckbox: setCheckboxOne,
      explination:
        'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_B,
      getCheckbox: checkboxTwo,
      setCheckbox: setCheckboxTwo,
      explination:
        'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
    },
    {
      brokenLaw: 'c-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_C,
      getCheckbox: checkboxThree,
      setCheckbox: setCheckboxThree,
      explination:
        'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
    },
    {
      brokenLaw: 'd-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_D,
      getCheckbox: checkboxFour,
      setCheckbox: setCheckboxFour,
      explination:
        'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
    },
    {
      brokenLaw: '2. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_2,
      getCheckbox: checkboxFive,
      setCheckbox: setCheckboxFive,
      explination:
        'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 99. gr.',
      value: CaseCustodyProvisions._99_1_B,
      getCheckbox: checkboxSix,
      setCheckbox: setCheckboxSix,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
  ]

  const restrictions = [
    {
      restriction: 'B - Einangrun',
      value: CaseCustodyRestrictions.ISOLATION,
      getCheckbox: restrictionCheckboxOne,
      setCheckbox: setRestrictionCheckboxOne,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      restriction: 'C - Heimsóknarbann',
      value: CaseCustodyRestrictions.VISITAION,
      getCheckbox: restrictionCheckboxTwo,
      setCheckbox: setRestrictionCheckboxTwo,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      value: CaseCustodyRestrictions.COMMUNICATION,
      getCheckbox: restrictionCheckboxThree,
      setCheckbox: setRestrictionCheckboxThree,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabanns',
      value: CaseCustodyRestrictions.MEDIA,
      getCheckbox: restrictionCheckboxFour,
      setCheckbox: setRestrictionCheckboxFour,
      explination:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    },
  ]

  useEffect(() => {
    api.saveCase(
      window.localStorage.getItem('caseId'),
      parseString('state', CaseState.SUBMITTED),
    )
    updateState(
      workingCase,
      'id',
      window.localStorage.getItem('caseId'),
      setWorkingCase,
    )
  }, [])

  return (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Logo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Typography as="h1">Krafa um gæsluvarðhald</Typography>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Dómkröfur
                </Typography>
              </Box>
              <GridRow>
                <GridColumn span="5/8">
                  <DatePicker
                    label="Veldu dagsetningu"
                    placeholderText="Veldu dagsetningu"
                    selected={
                      caseDraftJSON.case.requestedCustodyEndDate
                        ? parseISO(
                            caseDraftJSON.case.requestedCustodyEndDate.toString(),
                          )
                        : null
                    }
                    locale="is"
                    minDate={new Date()}
                    hasError={requestedCustodyEndDateErrorMessage !== ''}
                    errorMessage={requestedCustodyEndDateErrorMessage}
                    handleChange={(date) => {
                      updateState(
                        workingCase,
                        'requestedCustodyEndDate',
                        date,
                        setWorkingCase,
                      )
                    }}
                    handleCloseCalander={(date: Date) => {
                      if (isNull(date) || !isValid(date)) {
                        setRequestedCustodyEndDateErrorMessage(
                          'Reitur má ekki vera tómur',
                        )
                      }
                    }}
                    handleOpenCalander={() =>
                      setRequestedCustodyEndDateErrorMessage('')
                    }
                  />
                </GridColumn>
                <GridColumn span="3/8">
                  <Input
                    name="requestedCustodyEndTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    defaultValue={caseDraftJSON.case.requestedCustodyEndTime}
                    disabled={!workingCase.case.requestedCustodyEndDate}
                    errorMessage={requestedCustodyEndTimeErrorMessage}
                    hasError={requestedCustodyEndTimeErrorMessage !== ''}
                    onBlur={(evt) => {
                      const validateTimeEmpty = validate(
                        evt.target.value,
                        'empty',
                      )
                      const validateTimeFormat = validate(
                        evt.target.value,
                        'time-format',
                      )

                      if (
                        validateTimeEmpty.isValid &&
                        validateTimeFormat.isValid
                      ) {
                        const timeWithoutColon = evt.target.value.replace(
                          ':',
                          '',
                        )

                        const requestedCustodyEndDateHours = setHours(
                          workingCase.case.requestedCustodyEndDate,
                          parseInt(timeWithoutColon.substr(0, 2)),
                        )

                        const requestedCustodyEndDateMinutes = setMinutes(
                          requestedCustodyEndDateHours,
                          parseInt(timeWithoutColon.substr(2, 4)),
                        )

                        autoSave(
                          workingCase,
                          'requestedCustodyEndDate',
                          requestedCustodyEndDateMinutes,
                          setWorkingCase,
                        )
                        updateState(
                          workingCase,
                          'requestedCustodyEndTime',
                          evt.target.value,
                          setWorkingCase,
                        )
                      } else {
                        setRequestedCustodyEndTimeErrorMessage(
                          validateTimeEmpty.errorMessage ||
                            validateTimeFormat.errorMessage,
                        )
                      }
                    }}
                    onFocus={() => setRequestedCustodyEndTimeErrorMessage('')}
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Lagaákvæði sem brot varða við
                </Typography>
              </Box>
              <Input
                name="lawsBroken"
                label="Lagaákvæði sem ætluð brot kærða þykja varða við"
                defaultValue={workingCase.case.lawsBroken}
                errorMessage={lawsBrokenErrorMessage}
                hasError={lawsBrokenErrorMessage !== ''}
                onBlur={(evt) => {
                  const validateField = validate(evt.target.value, 'empty')
                  if (validateField.isValid) {
                    autoSave(
                      workingCase,
                      'lawsBroken',
                      evt.target.value,
                      setWorkingCase,
                    )
                  } else {
                    setLawsBrokenErrorMessage(validateField.errorMessage)
                  }
                }}
                onFocus={() => setLawsBrokenErrorMessage('')}
                required
                textarea
                rows={3}
              />
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Lagaákvæði sem krafan er byggð á
                </Typography>
              </Box>
              <GridContainer>
                <GridRow>
                  {caseCustodyProvisions.map((provision, index) => {
                    return (
                      <GridColumn span="3/7" key={index}>
                        <Box marginBottom={3}>
                          <Checkbox
                            name={provision.brokenLaw}
                            label={provision.brokenLaw}
                            value={provision.value}
                            checked={provision.getCheckbox}
                            tooltip={provision.explination}
                            onChange={({ target }) => {
                              // Toggle the checkbox on or off
                              provision.setCheckbox(!provision.getCheckbox)

                              // Create a copy of the state
                              const copyOfState = Object.assign(workingCase, {})

                              // If the user is checking the box, add the broken law to the state
                              if (
                                target.checked &&
                                copyOfState.case.caseCustodyProvisions.indexOf(
                                  target.value as CaseCustodyProvisions,
                                ) === -1
                              ) {
                                copyOfState.case.caseCustodyProvisions.push(
                                  target.value as CaseCustodyProvisions,
                                )
                              }
                              // If the user is unchecking the box, remove the broken law from the state
                              else {
                                const provisions =
                                  copyOfState.case.caseCustodyProvisions

                                provisions.splice(
                                  provisions.indexOf(
                                    target.value as CaseCustodyProvisions,
                                  ),
                                  1,
                                )
                              }

                              // Set the updated state as the state
                              setWorkingCase(copyOfState)

                              // Save case
                              api.saveCase(
                                workingCase.id,
                                parseArray(
                                  'custodyProvisions',
                                  copyOfState.case.caseCustodyProvisions,
                                ),
                              )

                              updateState(
                                workingCase,
                                'caseCustodyProvisions',
                                copyOfState.case.caseCustodyProvisions,
                                setWorkingCase,
                              )
                            }}
                            large
                          />
                        </Box>
                      </GridColumn>
                    )
                  })}
                </GridRow>
              </GridContainer>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Takmarkanir á gæslu
                </Typography>
                <Typography>
                  Ef ekkert er valið, er viðkomandi í lausagæslu
                </Typography>
              </Box>
              <GridContainer>
                <GridRow>
                  {restrictions.map((restriction, index) => (
                    <GridColumn span="3/7" key={index}>
                      <Box marginBottom={3}>
                        <Checkbox
                          name={restriction.restriction}
                          label={restriction.restriction}
                          value={restriction.value}
                          checked={restriction.getCheckbox}
                          tooltip={restriction.explination}
                          onChange={({ target }) => {
                            // Toggle the checkbox on or off
                            restriction.setCheckbox(!restriction.getCheckbox)

                            // Create a copy of the state
                            const copyOfState = Object.assign(workingCase, {})

                            // If the user is checking the box, add the restriction to the state
                            if (
                              target.checked &&
                              copyOfState.case.restrictions.indexOf(
                                target.value as CaseCustodyRestrictions,
                              ) === -1
                            ) {
                              copyOfState.case.restrictions.push(
                                target.value as CaseCustodyRestrictions,
                              )
                            }
                            // If the user is unchecking the box, remove the restriction from the state
                            else {
                              const restrictions = copyOfState.case.restrictions
                              restrictions.splice(
                                restrictions.indexOf(
                                  target.value as CaseCustodyRestrictions,
                                ),
                                1,
                              )
                            }

                            // Set the updated state as the state
                            setWorkingCase(copyOfState)

                            // Save case
                            api.saveCase(
                              workingCase.id,
                              parseArray(
                                'custodyRestrictions',
                                copyOfState.case.restrictions,
                              ),
                            )

                            updateState(
                              workingCase,
                              'restrictions',
                              copyOfState.case.restrictions,
                              setWorkingCase,
                            )
                          }}
                          large
                        />
                      </Box>
                    </GridColumn>
                  ))}
                </GridRow>
              </GridContainer>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Greinargerð um málsatvik og lagarök
                </Typography>
              </Box>
              <Box marginBottom={3}>
                <Input
                  textarea
                  rows={2}
                  name="caseFacts"
                  label="Málsatvik rakin"
                  defaultValue={caseDraftJSON.case.caseFacts}
                  placeholder="Skrifa hér..."
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'caseFacts',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  textarea
                  rows={2}
                  name="witnessAccounts"
                  label="Framburðir"
                  placeholder="Skrifa hér..."
                  defaultValue={caseDraftJSON.case.witnessAccounts}
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'witnessAccounts',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  textarea
                  rows={2}
                  name="investigationProgress"
                  label="Staða rannsóknar og næstu skref"
                  placeholder="Skrifa hér..."
                  defaultValue={caseDraftJSON.case.investigationProgress}
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'investigationProgress',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  textarea
                  rows={2}
                  name="legalArguments"
                  label="Lagarök"
                  placeholder="Skrifa hér..."
                  defaultValue={caseDraftJSON.case.legalArguments}
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'legalArguments',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  textarea
                  rows={2}
                  name="comments"
                  label="Athugasemdir til dómara"
                  placeholder="Skrifa hér..."
                  defaultValue={caseDraftJSON.case.comments}
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'comments',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                />
              </Box>
            </Box>
            <FormFooter
              previousUrl="/stofna-krofu/grunnupplysingar"
              nextUrl="/stofna-krofu/yfirlit"
              nextIsDisabled={
                workingCase.case.lawsBroken === '' &&
                workingCase.case.caseCustodyProvisions.length === 0
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default StepTwo
