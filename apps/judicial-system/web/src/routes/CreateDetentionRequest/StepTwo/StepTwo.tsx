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
import { CreateDetentionReqStepTwoCase } from '@island.is/judicial-system-web/src/types'
import { updateState, autoSave } from '../../../utils/stepHelper'
import { validate } from '@island.is/judicial-system-web/src/utils/validate'
import { setHours, setMinutes, isValid } from 'date-fns'
import { isNull } from 'lodash'
import { FormFooter } from '../../../shared-components/FormFooter'

export const StepTwo: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<CreateDetentionReqStepTwoCase>(
    {
      id: '',
      case: {
        requestedCustodyEndDate: null,
        requestedCustodyEndTime: 'string',
        lawsBroken: '',
        caseCustodyProvisions: [],
        restrictions: [],
        caseFacts: '',
        witnessAccounts: '',
        investigationProgress: '',
        legalArguments: '',
        comments: '',
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

  const [checkboxOne, setCheckboxOne] = useState(false)
  const [checkboxTwo, setCheckboxTwo] = useState(false)
  const [checkboxThree, setCheckboxThree] = useState(false)
  const [checkboxFour, setCheckboxFour] = useState(false)
  const [checkboxFive, setCheckboxFive] = useState(false)
  const [checkboxSix, setCheckboxSix] = useState(false)
  const [restrictionCheckboxOne, setRestrictionCheckboxOne] = useState(false)
  const [restrictionCheckboxTwo, setRestrictionCheckboxTwo] = useState(false)
  const [restrictionCheckboxThree, setRestrictionCheckboxThree] = useState(
    false,
  )
  const [restrictionCheckboxFour, setRestrictionCheckboxFour] = useState(false)

  const caseCustodyProvisions = [
    {
      brokenLaw: 'a-lið 1. mgr. 95. gr.',
      getCheckbox: checkboxOne,
      setCheckbox: setCheckboxOne,
      explination:
        'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 95. gr.',
      getCheckbox: checkboxTwo,
      setCheckbox: setCheckboxTwo,
      explination:
        'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
    },
    {
      brokenLaw: 'c-lið 1. mgr. 95. gr.',
      getCheckbox: checkboxThree,
      setCheckbox: setCheckboxThree,
      explination:
        'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
    },
    {
      brokenLaw: 'd-lið 1. mgr. 95. gr.',
      getCheckbox: checkboxFour,
      setCheckbox: setCheckboxFour,
      explination:
        'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
    },
    {
      brokenLaw: '2. mgr. 95. gr.',
      getCheckbox: checkboxFive,
      setCheckbox: setCheckboxFive,
      explination:
        'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 99. gr.',
      getCheckbox: checkboxSix,
      setCheckbox: setCheckboxSix,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
  ]

  const restrictions = [
    {
      restriction: 'B - Einangrun',
      getCheckbox: restrictionCheckboxOne,
      setCheckbox: setRestrictionCheckboxOne,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      restriction: 'C - Heimsóknarbann',
      getCheckbox: restrictionCheckboxTwo,
      setCheckbox: setRestrictionCheckboxTwo,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      getCheckbox: restrictionCheckboxThree,
      setCheckbox: setRestrictionCheckboxThree,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabanns',
      getCheckbox: restrictionCheckboxFour,
      setCheckbox: setRestrictionCheckboxFour,
      explination:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    },
  ]

  useEffect(() => {
    updateState(
      workingCase,
      'id',
      window.localStorage.getItem('caseId'),
      setWorkingCase,
    )
  }, [])

  return (
    <Box marginTop={7}>
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
                          'requestedCustodyEndDate',
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
                errorMessage={lawsBrokenErrorMessage}
                hasError={lawsBrokenErrorMessage !== ''}
                onBlur={(evt) => {
                  const validateField = validate(evt.target.value, 'empty')
                  if (validateField.isValid) {
                    updateState(
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
                  {caseCustodyProvisions.map((provision, index) => (
                    <GridColumn span="3/7" key={index}>
                      <Box marginBottom={3}>
                        <Checkbox
                          name={provision.brokenLaw}
                          label={provision.brokenLaw}
                          value={provision.brokenLaw}
                          checked={provision.getCheckbox}
                          tooltip={provision.explination}
                          onChange={({ target }) => {
                            // Toggle the checkbox on or off
                            provision.setCheckbox(target.checked)

                            // Create a copy of the state
                            const copyOfState = Object.assign(workingCase, {})

                            // If the user is checking the box, add the broken law to the state
                            if (target.checked) {
                              copyOfState.case.caseCustodyProvisions.push(
                                target.value,
                              )
                            }
                            // If the user is unchecking the box, remove the broken law from the state
                            else {
                              const provisions =
                                copyOfState.case.caseCustodyProvisions

                              provisions.splice(
                                provisions.indexOf(target.value),
                                1,
                              )
                            }

                            // Set the updated state as the state
                            setWorkingCase(copyOfState)
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
                          value={restriction.restriction}
                          checked={restriction.getCheckbox}
                          tooltip={restriction.explination}
                          onChange={({ target }) => {
                            // Toggle the checkbox on or off
                            restriction.setCheckbox(target.checked)

                            // Create a copy of the state
                            const copyOfState = Object.assign(workingCase, {})

                            // If the user is checking the box, add the restriction to the state
                            if (target.checked) {
                              copyOfState.case.restrictions.push(target.value)
                            }
                            // If the user is unchecking the box, remove the restriction from the state
                            else {
                              const restrictions = copyOfState.case.restrictions
                              restrictions.splice(
                                restrictions.indexOf(target.value),
                                1,
                              )
                            }

                            // Set the updated state as the state
                            setWorkingCase(copyOfState)
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
              nextUrl="/"
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
