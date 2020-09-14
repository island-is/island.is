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

export const StepTwo: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<CreateDetentionReqStepTwoCase>(
    {
      id: '',
      case: {
        courtClaimDate: null,
        courtClaimTime: 'string',
        offense: '',
        offenseParagraph: '',
        brokenLaws: [],
      },
    },
  )
  const [courtClaimDateErrorMessage, setCourtClaimDateErrorMessage] = useState<
    string
  >('')
  const [courtClaimTimeErrorMessage, setCourtClaimTimeErrorMessage] = useState<
    string
  >('')
  const [offenceErrorMessage, setOffenceErrorMessage] = useState<string>('')

  const [checkboxOne, setCheckboxOne] = useState(false)
  const [checkboxTwo, setCheckboxTwo] = useState(false)
  const [checkboxThree, setCheckboxThree] = useState(false)
  const [checkboxFour, setCheckboxFour] = useState(false)
  const [checkboxFive, setCheckboxFive] = useState(false)
  const [checkboxSix, setCheckboxSix] = useState(false)

  const brokenLaws = [
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
                    hasError={courtClaimDateErrorMessage !== ''}
                    errorMessage={courtClaimDateErrorMessage}
                    handleChange={(date) => {
                      updateState(
                        workingCase,
                        'courtClaimDate',
                        date,
                        setWorkingCase,
                      )
                    }}
                    handleCloseCalander={(date: Date) => {
                      if (isNull(date) || !isValid(date)) {
                        setCourtClaimDateErrorMessage(
                          'Reitur má ekki vera tómur',
                        )
                      }
                    }}
                    handleOpenCalander={() => setCourtClaimDateErrorMessage('')}
                  />
                </GridColumn>
                <GridColumn span="3/8">
                  <Input
                    name="courtClaimTime"
                    label="Tímasetning"
                    placeholder="Settu inn tíma"
                    disabled={!workingCase.case.courtClaimDate}
                    errorMessage={courtClaimTimeErrorMessage}
                    hasError={courtClaimTimeErrorMessage !== ''}
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

                        const courtClaimtDateHours = setHours(
                          workingCase.case.courtClaimDate,
                          parseInt(timeWithoutColon.substr(0, 2)),
                        )

                        const courtClaimDateMinutes = setMinutes(
                          courtClaimtDateHours,
                          parseInt(timeWithoutColon.substr(2, 4)),
                        )

                        autoSave(
                          workingCase,
                          'courtClaimDate',
                          courtClaimDateMinutes,
                          setWorkingCase,
                        )
                        updateState(
                          workingCase,
                          'courtClaimTime',
                          evt.target.value,
                          setWorkingCase,
                        )
                      } else {
                        setCourtClaimTimeErrorMessage(
                          validateTimeEmpty.errorMessage ||
                            validateTimeFormat.errorMessage,
                        )
                      }
                    }}
                    onFocus={() => setCourtClaimTimeErrorMessage('')}
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
                name="offence"
                label="Lagaákvæði sem ætluð brot kærða þykja varða við"
                errorMessage={offenceErrorMessage}
                hasError={offenceErrorMessage !== ''}
                onBlur={(evt) => {
                  const validateField = validate(evt.target.value, 'empty')
                  if (validateField.isValid) {
                    updateState(
                      workingCase,
                      'offence',
                      evt.target.value,
                      setWorkingCase,
                    )
                  } else {
                    setOffenceErrorMessage(validateField.errorMessage)
                  }
                }}
                onFocus={() => setOffenceErrorMessage('')}
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
                  {brokenLaws.map((brokenLaw, index) => (
                    <GridColumn span="3/6">
                      <Checkbox
                        name={brokenLaw.brokenLaw}
                        label={brokenLaw.brokenLaw}
                        value={brokenLaw.brokenLaw}
                        checked={brokenLaw.getCheckbox}
                        tooltip={brokenLaw.explination}
                        onChange={({ target }) => {
                          // Toggle the checkbox on or off
                          brokenLaw.setCheckbox(target.checked)

                          // Create a copy of the state
                          const copyOfState = Object.assign(workingCase, {})

                          // If the user is checking the box, add the broken law to the state
                          if (target.checked) {
                            copyOfState.case.brokenLaws.push(target.value)
                          }
                          // If the user is unchecking the box, remove the broken law from the state
                          else {
                            const brokenLaws = copyOfState.case.brokenLaws
                            brokenLaws.splice(
                              brokenLaws.indexOf(target.value),
                              1,
                            )
                          }

                          // Set the updated state as the state
                          setWorkingCase(copyOfState)
                        }}
                      />
                    </GridColumn>
                  ))}
                </GridRow>
              </GridContainer>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default StepTwo
