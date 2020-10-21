import React, { useEffect, useState, useRef } from 'react'

import { ProsecutorLogo } from '@island.is/judicial-system-web/src/shared-components/Logos'
import {
  Text,
  GridContainer,
  GridRow,
  GridColumn,
  Box,
  DatePicker,
  Input,
  Checkbox,
  Tooltip,
} from '@island.is/island-ui/core'
import { Case } from '@island.is/judicial-system-web/src/types'
import {
  CaseCustodyProvisions,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'
import {
  updateState,
  autoSave,
  renderFormStepper,
  isNextDisabled,
} from '../../../../utils/stepHelper'
import {
  validate,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'
import { formatISO, isValid, parseISO } from 'date-fns'
import { isNull } from 'lodash'
import { FormFooter } from '../../../../shared-components/FormFooter'
import * as api from '../../../../api'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  parseArray,
  parseString,
  parseTime,
} from '@island.is/judicial-system-web/src/utils/formatters'
import * as Constants from '../../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'

export const StepTwo: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>(null)
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const requestedCustodyEndTimeRef = useRef<HTMLInputElement>()

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

  const [, setCheckboxOne] = useState<boolean>()
  const [, setCheckboxTwo] = useState<boolean>()
  const [, setCheckboxThree] = useState<boolean>()
  const [, setCheckboxFour] = useState<boolean>()
  const [, setCheckboxFive] = useState<boolean>()
  const [, setCheckboxSix] = useState<boolean>()
  const [, setRestrictionCheckboxOne] = useState<boolean>()
  const [, setRestrictionCheckboxTwo] = useState<boolean>()
  const [, setRestrictionCheckboxThree] = useState<boolean>()
  const [, setRestrictionCheckboxFour] = useState<boolean>()

  const caseCustodyProvisions = [
    {
      brokenLaw: 'a-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_A,
      setCheckbox: setCheckboxOne,
      explination:
        'Að ætla megi að sakborningur muni torvelda rannsókn málsins, svo sem með því að afmá merki eftir brot, skjóta undan munum ellegar hafa áhrif á samseka eða vitni.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_B,
      setCheckbox: setCheckboxTwo,
      explination:
        'Að ætla megi að hann muni reyna að komast úr landi eða leynast ellegar koma sér með öðrum hætti undan málsókn eða fullnustu refsingar.',
    },
    {
      brokenLaw: 'c-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_C,
      setCheckbox: setCheckboxThree,
      explination:
        'Að ætla megi að hann muni halda áfram brotum meðan máli hans er ekki lokið eða rökstuddur grunur leiki á að hann hafi rofið í verulegum atriðum skilyrði sem honum hafa verið sett í skilorðsbundnum dómi.',
    },
    {
      brokenLaw: 'd-lið 1. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_1_D,
      setCheckbox: setCheckboxFour,
      explination:
        'Að telja megi gæsluvarðhald nauðsynlegt til að verja aðra fyrir árásum sakbornings ellegar hann sjálfan fyrir árásum eða áhrifum annarra manna.',
    },
    {
      brokenLaw: '2. mgr. 95. gr.',
      value: CaseCustodyProvisions._95_2,
      setCheckbox: setCheckboxFive,
      explination:
        'Einnig má úrskurða sakborning í gæsluvarðhald þótt skilyrði a–d-liðar 1. mgr. séu ekki fyrir hendi ef sterkur grunur leikur á að hann hafi framið afbrot sem að lögum getur varðað 10 ára fangelsi, enda sé brotið þess eðlis að ætla megi varðhald nauðsynlegt með tilliti til almannahagsmuna.',
    },
    {
      brokenLaw: 'b-lið 1. mgr. 99. gr.',
      value: CaseCustodyProvisions._99_1_B,
      setCheckbox: setCheckboxSix,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
  ]

  const restrictions = [
    {
      restriction: 'B - Einangrun',
      value: CaseCustodyRestrictions.ISOLATION,
      setCheckbox: setRestrictionCheckboxOne,
      explination:
        'Gæslufangar skulu aðeins látnir vera í einrúmi samkvæmt úrskurði dómara en þó skulu þeir ekki gegn vilja sínum hafðir með öðrum föngum.',
    },
    {
      restriction: 'C - Heimsóknarbann',
      value: CaseCustodyRestrictions.VISITAION,
      setCheckbox: setRestrictionCheckboxTwo,
      explination:
        'Gæslufangar eiga rétt á heimsóknum. Þó getur sá sem rannsókn stýrir bannað heimsóknir ef nauðsyn ber til í þágu hennar en skylt er að verða við óskum gæslufanga um að hafa samband við verjanda og ræða við hann einslega, sbr. 1. mgr. 36. gr., og rétt að verða við óskum hans um að hafa samband við lækni eða prest, ef þess er kostur.',
    },
    {
      restriction: 'D - Bréfskoðun, símabann',
      value: CaseCustodyRestrictions.COMMUNICATION,
      setCheckbox: setRestrictionCheckboxThree,
      explination:
        'Gæslufangar mega nota síma eða önnur fjarskiptatæki og senda og taka við bréfum og öðrum skjölum. Þó getur sá sem rannsókn stýrir bannað notkun síma eða annarra fjarskiptatækja og látið athuga efni bréfa eða annarra skjala og kyrrsett þau ef nauðsyn ber til í þágu hennar en gera skal sendanda viðvart um kyrrsetningu, ef því er að skipta.',
    },
    {
      restriction: 'E - Fjölmiðlabann',
      value: CaseCustodyRestrictions.MEDIA,
      setCheckbox: setRestrictionCheckboxFour,
      explination:
        'Gæslufangar mega lesa dagblöð og bækur, svo og fylgjast með hljóðvarpi og sjónvarpi. Þó getur sá sem rannsókn stýrir takmarkað aðgang gæslufanga að fjölmiðlum ef nauðsyn ber til í þágu rannsóknar.',
    },
  ]

  useEffect(() => {
    document.title = 'Málsatvik og lagarök - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const caseDraft = window.localStorage.getItem('workingCase')

    if (caseDraft !== 'undefined' && !workingCase) {
      const caseDraftJSON = JSON.parse(caseDraft || '{}')

      setWorkingCase({
        id: caseDraftJSON.id ?? '',
        created: caseDraftJSON.created ?? '',
        modified: caseDraftJSON.modified ?? '',
        state: caseDraftJSON.state ?? '',
        policeCaseNumber: caseDraftJSON.policeCaseNumber ?? '',
        accusedNationalId: caseDraftJSON.accusedNationalId ?? '',
        accusedName: caseDraftJSON.accusedName ?? '',
        accusedAddress: caseDraftJSON.accusedAddress ?? '',
        court: caseDraftJSON.court ?? 'Héraðsdómur Reykjavíkur',
        arrestDate: caseDraftJSON.arrestDate ?? null,
        requestedCourtDate: caseDraftJSON.requestedCourtDate ?? null,
        requestedCustodyEndDate: caseDraftJSON.requestedCustodyEndDate ?? null,
        lawsBroken: caseDraftJSON.lawsBroken ?? '',
        custodyProvisions: caseDraftJSON.custodyProvisions ?? [],
        requestedCustodyRestrictions:
          caseDraftJSON.requestedCustodyRestrictions ?? [],
        caseFacts: caseDraftJSON.caseFacts ?? '',
        witnessAccounts: caseDraftJSON.witnessAccounts ?? '',
        investigationProgress: caseDraftJSON.investigationProgress ?? '',
        legalArguments: caseDraftJSON.legalArguments ?? '',
        comments: caseDraftJSON.comments ?? '',
        notifications: caseDraftJSON.Notification ?? [],
        courtCaseNumber: caseDraftJSON.courtCaseNumber ?? '',
        courtStartTime: caseDraftJSON.courtStartTime ?? '',
        courtEndTime: caseDraftJSON.courtEndTime ?? '',
        courtAttendees: caseDraftJSON.courtAttendees ?? '',
        policeDemands: caseDraftJSON.policeDemands ?? '',
        accusedPlea: caseDraftJSON.accusedPlea ?? '',
        litigationPresentations: caseDraftJSON.litigationPresentations ?? '',
        ruling: caseDraftJSON.ruling ?? '',
        custodyEndDate: caseDraftJSON.custodyEndDate ?? '',
        custodyRestrictions: caseDraftJSON.custodyRestrictions ?? [],
        accusedAppealDecision: caseDraftJSON.AppealDecision ?? '',
        prosecutorAppealDecision: caseDraftJSON.AppealDecision ?? '',
        prosecutorId: caseDraftJSON.prosecutorId ?? null,
        prosecutor: caseDraftJSON.prosecutor ?? null,
        judgeId: caseDraftJSON.judgeId ?? null,
        judge: caseDraftJSON.judge ?? null,
      })
    }
  }, [workingCase, setWorkingCase])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      {
        value: workingCase?.requestedCustodyEndDate,
        validations: ['empty'],
      },
      {
        value: requestedCustodyEndTimeRef.current?.value,
        validations: ['empty', 'time-format'],
      },
      { value: workingCase?.lawsBroken, validations: ['empty'] },
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, setIsStepIllegal, requestedCustodyEndTimeRef.current?.value])

  return (
    workingCase && (
      <Box marginTop={7} marginBottom={30}>
        <GridContainer>
          <Box marginBottom={7}>
            <GridRow>
              <GridColumn span={'3/12'}>
                <ProsecutorLogo />
              </GridColumn>
              <GridColumn span={'8/12'} offset={'1/12'}>
                <Text as="h1" variant="h1">
                  Krafa um gæsluvarðhald
                </Text>
              </GridColumn>
            </GridRow>
          </Box>
          <GridRow>
            <GridColumn span={['12/12', '3/12']}>
              {renderFormStepper(0, 1)}
            </GridColumn>
            <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
              <Box component="section" marginBottom={7}>
                <Box marginBottom={2}>
                  <Text as="h3" variant="h3">
                    Dómkröfur
                  </Text>
                </Box>
                <GridRow>
                  <GridColumn span="5/8">
                    <DatePicker
                      label="Gæsluvarðhald til"
                      placeholderText="Veldu dagsetningu"
                      selected={
                        workingCase?.requestedCustodyEndDate
                          ? parseISO(
                              workingCase?.requestedCustodyEndDate.toString(),
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
                          formatISO(date, { representation: 'date' }),
                          setWorkingCase,
                        )
                      }}
                      handleCloseCalendar={(date: Date) => {
                        if (isNull(date) || !isValid(date)) {
                          setRequestedCustodyEndDateErrorMessage(
                            'Reitur má ekki vera tómur',
                          )
                        }
                      }}
                      handleOpenCalendar={() =>
                        setRequestedCustodyEndDateErrorMessage('')
                      }
                      required
                    />
                  </GridColumn>
                  <GridColumn span="3/8">
                    <Input
                      data-testid="requestedCustodyEndTime"
                      name="requestedCustodyEndTime"
                      label="Tímasetning"
                      placeholder="Settu inn tíma"
                      ref={requestedCustodyEndTimeRef}
                      defaultValue={
                        workingCase?.requestedCustodyEndDate?.indexOf('T') > -1
                          ? formatDate(
                              workingCase?.requestedCustodyEndDate,
                              TIME_FORMAT,
                            )
                          : null
                      }
                      disabled={!workingCase?.requestedCustodyEndDate}
                      errorMessage={requestedCustodyEndTimeErrorMessage}
                      hasError={requestedCustodyEndTimeErrorMessage !== ''}
                      onBlur={async (evt) => {
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
                          const requestedCustodyEndDateMinutes = parseTime(
                            workingCase.requestedCustodyEndDate,
                            evt.target.value,
                          )

                          await api.saveCase(
                            workingCase.id,
                            JSON.parse(`{
                            "requestedCustodyEndDate": "${requestedCustodyEndDateMinutes}",
                            "custodyEndDate": "${requestedCustodyEndDateMinutes}"
                          }`),
                          )

                          window.localStorage.setItem(
                            'workingCase',
                            JSON.stringify({
                              ...workingCase,
                              requestedCustodyEndDate: requestedCustodyEndDateMinutes,
                              custodyEndDate: requestedCustodyEndDateMinutes,
                            }),
                          )

                          setWorkingCase({
                            ...workingCase,
                            requestedCustodyEndDate: requestedCustodyEndDateMinutes,
                            custodyEndDate: requestedCustodyEndDateMinutes,
                          })
                        } else {
                          setRequestedCustodyEndTimeErrorMessage(
                            validateTimeEmpty.errorMessage ||
                              validateTimeFormat.errorMessage,
                          )
                        }
                      }}
                      onFocus={() => setRequestedCustodyEndTimeErrorMessage('')}
                      required
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box component="section" marginBottom={7}>
                <Box marginBottom={2}>
                  <Text as="h3" variant="h3">
                    Lagaákvæði sem brot varða við
                  </Text>
                </Box>
                <Input
                  data-testid="lawsBroken"
                  name="lawsBroken"
                  label="Lagaákvæði sem ætluð brot kærða þykja varða við"
                  defaultValue={workingCase?.lawsBroken}
                  errorMessage={lawsBrokenErrorMessage}
                  hasError={lawsBrokenErrorMessage !== ''}
                  onBlur={(evt) => {
                    updateState(
                      workingCase,
                      'lawsBroken',
                      evt.target.value,
                      setWorkingCase,
                    )

                    const validateField = validate(evt.target.value, 'empty')
                    if (validateField.isValid) {
                      api.saveCase(
                        workingCase.id,
                        parseString('lawsBroken', evt.target.value),
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
                  <Text as="h3" variant="h3">
                    Lagaákvæði sem krafan er byggð á{' '}
                    <Text as="span" color={'red400'} fontWeight="semiBold">
                      *
                    </Text>
                  </Text>
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
                              checked={
                                workingCase.custodyProvisions.indexOf(
                                  provision.value,
                                ) > -1
                              }
                              tooltip={provision.explination}
                              onChange={({ target }) => {
                                // Create a copy of the state
                                const copyOfState = Object.assign(
                                  workingCase,
                                  {},
                                )

                                const provisionIsSelected =
                                  copyOfState.custodyProvisions.indexOf(
                                    target.value as CaseCustodyProvisions,
                                  ) > -1

                                // Toggle the checkbox on or off
                                provision.setCheckbox(!provisionIsSelected)

                                // If the user is checking the box, add the broken law to the state
                                if (!provisionIsSelected) {
                                  copyOfState.custodyProvisions.push(
                                    target.value as CaseCustodyProvisions,
                                  )
                                }
                                // If the user is unchecking the box, remove the broken law from the state
                                else {
                                  const provisions =
                                    copyOfState.custodyProvisions

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
                  <Text as="h3" variant="h3">
                    Takmarkanir á gæslu
                  </Text>
                  <Text fontWeight="regular">
                    Ef ekkert er valið, er viðkomandi í lausagæslu
                  </Text>
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
                            checked={
                              workingCase.custodyRestrictions.indexOf(
                                restriction.value,
                              ) > -1
                            }
                            tooltip={restriction.explination}
                            onChange={async ({ target }) => {
                              // Create a copy of the state
                              const copyOfState = Object.assign(workingCase, {})

                              const restrictionIsSelected =
                                copyOfState.requestedCustodyRestrictions.indexOf(
                                  target.value as CaseCustodyRestrictions,
                                ) > -1

                              // Toggle the checkbox on or off
                              restriction.setCheckbox(!restrictionIsSelected)

                              // If the user is checking the box, add the restriction to the state
                              if (!restrictionIsSelected) {
                                // Add them both to requestedCR and CR. The judge will then deselect them later if s/he wants
                                copyOfState.requestedCustodyRestrictions.push(
                                  target.value as CaseCustodyRestrictions,
                                )

                                copyOfState.custodyRestrictions.push(
                                  target.value as CaseCustodyRestrictions,
                                )
                              }
                              // If the user is unchecking the box, remove the restriction from the state
                              else {
                                const restrictions =
                                  copyOfState.requestedCustodyRestrictions

                                const cRestrictions =
                                  copyOfState.custodyRestrictions

                                restrictions.splice(
                                  restrictions.indexOf(
                                    target.value as CaseCustodyRestrictions,
                                  ),
                                  1,
                                )

                                cRestrictions.splice(
                                  restrictions.indexOf(
                                    target.value as CaseCustodyRestrictions,
                                  ),
                                  1,
                                )
                              }

                              // Set the updated state as the state
                              setWorkingCase(copyOfState)

                              // Save case
                              await api.saveCase(
                                workingCase.id,
                                parseArray(
                                  'requestedCustodyRestrictions',
                                  copyOfState.requestedCustodyRestrictions,
                                ),
                              )
                              // TODO: COMBINE IN A SINGLE API CALL
                              await api.saveCase(
                                workingCase.id,
                                parseArray(
                                  'custodyRestrictions',
                                  copyOfState.custodyRestrictions,
                                ),
                              )

                              updateState(
                                workingCase,
                                'requestedCustodyRestrictions',
                                copyOfState.requestedCustodyRestrictions,
                                setWorkingCase,
                              )

                              updateState(
                                workingCase,
                                'custodyRestrictions',
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
                  <Text as="h3" variant="h3">
                    Greinargerð um málsatvik og lagarök
                  </Text>
                </Box>
                <Box marginBottom={3}>
                  <Input
                    textarea
                    rows={2}
                    name="caseFacts"
                    label="Málsatvik rakin"
                    defaultValue={workingCase?.caseFacts}
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
                    defaultValue={workingCase?.witnessAccounts}
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
                    defaultValue={workingCase?.investigationProgress}
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
                <Box marginBottom={7}>
                  <Input
                    textarea
                    rows={2}
                    name="legalArguments"
                    label="Lagarök"
                    placeholder="Skrifa hér..."
                    defaultValue={workingCase?.legalArguments}
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
                <Box component="section" marginBottom={7}>
                  <Box marginBottom={2}>
                    <Text as="h3" variant="h3">
                      Skilaboð til dómara{' '}
                      <Tooltip
                        placement="right"
                        as="span"
                        text="Hér er hægt að skrá athugasemdir eða skilaboð til dómara sem verður ekki vistað sem hluti af kröfunni. Til dæmis aðrar upplýsingar en koma fram í kröfunni og/eða upplýsingar um ástand sakbornings"
                      />
                    </Text>
                  </Box>
                  <Box marginBottom={3}>
                    <Input
                      textarea
                      rows={2}
                      name="comments"
                      label="Athugasemdir til dómara"
                      placeholder="Skrifa hér..."
                      defaultValue={workingCase?.comments}
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
              </Box>
              <FormFooter
                nextUrl={Constants.STEP_THREE_ROUTE}
                nextIsDisabled={
                  isStepIllegal || workingCase.custodyProvisions.length === 0
                }
              />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    )
  )
}

export default StepTwo
