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
  CustodyProvisions,
  CustodyRestrictions,
  Case,
  CaseState,
} from '@island.is/judicial-system-web/src/types'
import { updateState, autoSave } from '../../../utils/stepHelper'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import {
  setHours,
  setMinutes,
  isValid,
  parseISO,
  format,
  getTime,
} from 'date-fns'
import { isNull } from 'lodash'
import { FormFooter } from '../../../shared-components/FormFooter'
import * as api from '../../../api'
import {
  parseArray,
  parseString,
} from '@island.is/judicial-system-web/src/utils/formatters'
import * as Constants from '../../../utils/constants'

export const StepTwo: React.FC = () => {
  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)

  const [workingCase, setWorkingCase] = useState<Case>({
    id: caseDraftJSON.id ?? '',
    created: new Date(),
    modified: new Date(),
    state: caseDraftJSON.state ?? '',
    policeCaseNumber: caseDraftJSON.policeCaseNumber ?? '',
    suspectNationalId: caseDraftJSON.suspectNationalId ?? '',
    suspectName: caseDraftJSON.suspectName ?? '',
    suspectAddress: caseDraftJSON.suspectAddress ?? '',
    court: caseDraftJSON.court ?? 'Héraðsdómur Reykjavíkur',
    arrestDate: caseDraftJSON.arrestDate ?? null,
    requestedCourtDate: caseDraftJSON.requestedCourtDate ?? null,
    requestedCustodyEndDate: caseDraftJSON.requestedCustodyEndDate ?? null,
    lawsBroken: caseDraftJSON.lawsBroken ?? '',
    custodyProvisions: caseDraftJSON.custodyProvisions ?? [],
    custodyRestrictions: caseDraftJSON.restrictions ?? [],
    caseFacts: caseDraftJSON.caseFacts ?? '',
    witnessAccounts: caseDraftJSON.witnessAccounts ?? '',
    investigationProgress: caseDraftJSON.investigationProgress ?? '',
    legalArguments: caseDraftJSON.legalArguments ?? '',
    comments: caseDraftJSON.comments ?? '',
  })
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
    caseDraftJSON.custodyProvisions.indexOf(CustodyProvisions._95_1_A) > -1,
  )
  const [checkboxTwo, setCheckboxTwo] = useState(
    caseDraftJSON.custodyProvisions.indexOf(CustodyProvisions._95_1_B) > -1,
  )
  const [checkboxThree, setCheckboxThree] = useState(
    caseDraftJSON.custodyProvisions.indexOf(CustodyProvisions._95_1_C) > -1,
  )
  const [checkboxFour, setCheckboxFour] = useState(
    caseDraftJSON.custodyProvisions.indexOf(CustodyProvisions._95_1_D) > -1,
  )
  const [checkboxFive, setCheckboxFive] = useState(
    caseDraftJSON.custodyProvisions.indexOf(CustodyProvisions._95_2) > -1,
  )
  const [checkboxSix, setCheckboxSix] = useState(
    caseDraftJSON.custodyProvisions.indexOf(CustodyProvisions._99_1_B) > -1,
  )
  const [restrictionCheckboxOne, setRestrictionCheckboxOne] = useState(
    caseDraftJSON.custodyRestrictions.indexOf(CustodyRestrictions.ISOLATION) >
      -1,
  )
  const [restrictionCheckboxTwo, setRestrictionCheckboxTwo] = useState(
    caseDraftJSON.custodyRestrictions.indexOf(CustodyRestrictions.VISITAION) >
      -1,
  )
  const [restrictionCheckboxThree, setRestrictionCheckboxThree] = useState(
    caseDraftJSON.custodyRestrictions.indexOf(
      CustodyRestrictions.COMMUNICATION,
    ) > -1,
  )
  const [restrictionCheckboxFour, setRestrictionCheckboxFour] = useState(
    caseDraftJSON.custodyRestrictions.indexOf(CustodyRestrictions.MEDIA) > -1,
  )

  const caseCustodyProvisions = [
    {
      brokenLaw: 'a-lið 1. mgr. 95. gr.',
      value: CustodyProvisions._95_1_A,
      getCheckbox: checkboxOne,
      setCheckbox: setCheckboxOne,
      explination:
        'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 95. gr.',
      value: CustodyProvisions._95_1_B,
      getCheckbox: checkboxTwo,
      setCheckbox: setCheckboxTwo,
      explination:
        'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
    },
    {
      brokenLaw: 'c-lið 1. mgr. 95. gr.',
      value: CustodyProvisions._95_1_C,
      getCheckbox: checkboxThree,
      setCheckbox: setCheckboxThree,
      explination:
        'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
    },
    {
      brokenLaw: 'd-lið 1. mgr. 95. gr.',
      value: CustodyProvisions._95_1_D,
      getCheckbox: checkboxFour,
      setCheckbox: setCheckboxFour,
      explination:
        'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
    },
    {
      brokenLaw: '2. mgr. 95. gr.',
      value: CustodyProvisions._95_2,
      getCheckbox: checkboxFive,
      setCheckbox: setCheckboxFive,
      explination:
        'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 99. gr.',
      value: CustodyProvisions._99_1_B,
      getCheckbox: checkboxSix,
      setCheckbox: setCheckboxSix,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
  ]

  const restrictions = [
    {
      restriction: 'B - Einangrun',
      value: CustodyRestrictions.ISOLATION,
      getCheckbox: restrictionCheckboxOne,
      setCheckbox: setRestrictionCheckboxOne,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      restriction: 'C - Heimsóknarbann',
      value: CustodyRestrictions.VISITAION,
      getCheckbox: restrictionCheckboxTwo,
      setCheckbox: setRestrictionCheckboxTwo,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      value: CustodyRestrictions.COMMUNICATION,
      getCheckbox: restrictionCheckboxThree,
      setCheckbox: setRestrictionCheckboxThree,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabanns',
      value: CustodyRestrictions.MEDIA,
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
            <Typography as="h1" variant="h1">
              Krafa um gæsluvarðhald
            </Typography>
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
                      caseDraftJSON.requestedCustodyEndDate
                        ? parseISO(
                            caseDraftJSON.requestedCustodyEndDate.toString(),
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
                    defaultValue={
                      caseDraftJSON.requestedCustodyEndDate
                        ? format(
                            getTime(parseISO(caseDraftJSON.arrestDate)),
                            'hh:mm',
                          )
                        : null
                    }
                    disabled={!workingCase.requestedCustodyEndDate}
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
                          workingCase.requestedCustodyEndDate,
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
                defaultValue={workingCase.lawsBroken}
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
                              provision.setCheckbox(target.checked)

                              // Create a copy of the state
                              const copyOfState = Object.assign(workingCase, {})

                              // If the user is checking the box, add the broken law to the state
                              if (target.checked) {
                                copyOfState.custodyProvisions.push(
                                  target.value as CustodyProvisions,
                                )
                              }
                              // If the user is unchecking the box, remove the broken law from the state
                              else {
                                const provisions = copyOfState.custodyProvisions

                                provisions.splice(
                                  provisions.indexOf(
                                    target.value as CustodyProvisions,
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
                                  copyOfState.custodyProvisions,
                                ),
                              )

                              updateState(
                                workingCase,
                                'custodyProvisions',
                                copyOfState.custodyProvisions,
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
                            restriction.setCheckbox(target.checked)

                            // Create a copy of the state
                            const copyOfState = Object.assign(workingCase, {})

                            // If the user is checking the box, add the restriction to the state
                            if (target.checked) {
                              copyOfState.custodyRestrictions.push(
                                target.value as CustodyRestrictions,
                              )
                            }
                            // If the user is unchecking the box, remove the restriction from the state
                            else {
                              const restrictions =
                                copyOfState.custodyRestrictions
                              restrictions.splice(
                                restrictions.indexOf(
                                  target.value as CustodyRestrictions,
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
                                copyOfState.custodyRestrictions,
                              ),
                            )

                            updateState(
                              workingCase,
                              'restrictions',
                              copyOfState.custodyRestrictions,
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
                  defaultValue={caseDraftJSON.caseFacts}
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
                  defaultValue={caseDraftJSON.witnessAccounts}
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
                  defaultValue={caseDraftJSON.investigationProgress}
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
                  defaultValue={caseDraftJSON.legalArguments}
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
                  defaultValue={caseDraftJSON.comments}
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
              previousUrl={Constants.STEP_ONE_ROUTE}
              nextUrl={Constants.STEP_THREE_ROUTE}
              nextIsDisabled={
                workingCase.lawsBroken === '' &&
                workingCase.custodyRestrictions.length === 0
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default StepTwo
