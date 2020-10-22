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
import React, { useEffect, useState, useRef } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { Case } from '../../../types'
import { CaseCustodyRestrictions } from '@island.is/judicial-system/types'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { parseArray, parseString, parseTime } from '../../../utils/formatters'
import {
  autoSave,
  isNextDisabled,
  updateState,
} from '../../../utils/stepHelper'
import * as api from '../../../api'
import {
  validate,
  Validation,
} from '@island.is/judicial-system-web/src/utils/validate'
import { formatISO } from 'date-fns'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import PoliceRequestAccordionItem from '@island.is/judicial-system-web/src/shared-components/PoliceRequestAccordionItem/PoliceRequestAccordionItem'

export const RulingStepOne: React.FC = () => {
  const custodyEndTimeRef = useRef<HTMLInputElement>()
  const [isStepIllegal, setIsStepIllegal] = useState<boolean>(true)
  const [workingCase, setWorkingCase] = useState<Case>()

  const [, setRestrictionCheckboxOne] = useState<boolean>()
  const [, setRestrictionCheckboxTwo] = useState<boolean>()
  const [, setRestrictionCheckboxThree] = useState<boolean>()
  const [, setRestrictionCheckboxFour] = useState<boolean>()
  const [rulingErrorMessage, setRulingErrorMessage] = useState('')
  const [custodyEndTimeErrorMessage, setCustodyEndTimeErrorMessage] = useState(
    '',
  )
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
    document.title = 'Úrskurður - Réttarvörslugátt'
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
        rejecting: caseDraftJSON.rejecting ?? false,
        custodyEndDate: caseDraftJSON.custodyEndDate ?? '',
        custodyRestrictions: caseDraftJSON.custodyRestrictions ?? [],
        accusedAppealDecision: caseDraftJSON.accusedAppealDecision ?? '',
        prosecutorAppealDecision: caseDraftJSON.prosecutorAppealDecision ?? '',
        accusedAppealAnnouncement:
          caseDraftJSON.accusedAppealAnnouncement ?? '',
        prosecutorAppealAnnouncement:
          caseDraftJSON.prosecutorAppealAnnouncement ?? '',
        prosecutorId: caseDraftJSON.prosecutorId ?? null,
        prosecutor: caseDraftJSON.prosecutor ?? null,
        judgeId: caseDraftJSON.judgeId ?? null,
        judge: caseDraftJSON.judge ?? null,
      })
    }
  }, [workingCase, setWorkingCase])

  useEffect(() => {
    const requiredFields: { value: string; validations: Validation[] }[] = [
      { value: workingCase?.ruling, validations: ['empty'] },
      { value: workingCase?.custodyEndDate, validations: ['empty'] },
      {
        value: custodyEndTimeRef.current?.value,
        validations: ['empty', 'time-format'],
      },
    ]

    if (workingCase) {
      setIsStepIllegal(isNextDisabled(requiredFields))
    }
  }, [workingCase, isStepIllegal])

  return workingCase ? (
    <PageLayout activeSection={1} activeSubSection={2}>
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
            onFocus={() => setRulingErrorMessage('')}
            onBlur={(evt) => {
              const validateEmpty = validate(evt.target.value, 'empty')

              updateState(
                workingCase,
                'ruling',
                evt.target.value,
                setWorkingCase,
              )

              if (
                validateEmpty.isValid &&
                workingCase.ruling !== evt.target.value
              ) {
                api.saveCase(
                  workingCase.id,
                  parseString('ruling', evt.target.value),
                )
              } else {
                setRulingErrorMessage(validateEmpty.errorMessage)
              }
            }}
            textarea
            required
          />
        </Box>
        <GridRow>
          <GridColumn span="3/7">
            <Checkbox
              name="rejectRequest"
              label="Hafna kröfu"
              onChange={({ target }) => {
                autoSave(
                  workingCase,
                  'rejecting',
                  target.checked,
                  setWorkingCase,
                )
              }}
              checked={workingCase.rejecting}
              large
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box component="section" marginBottom={8}>
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
              locale="is"
              selected={
                workingCase.custodyEndDate
                  ? new Date(workingCase.custodyEndDate)
                  : workingCase.requestedCustodyEndDate
                  ? new Date(workingCase.requestedCustodyEndDate)
                  : null
              }
              handleChange={(date) => {
                updateState(
                  workingCase,
                  'custodyEndDate',
                  formatISO(date, { representation: 'date' }),
                  setWorkingCase,
                )
              }}
              required
            />
          </GridColumn>
          <GridColumn span="3/8">
            <Input
              data-testid="custodyEndTime"
              name="custodyEndTime"
              label="Tímasetning"
              ref={custodyEndTimeRef}
              defaultValue={
                workingCase.custodyEndDate.indexOf('T') > -1
                  ? formatDate(workingCase.custodyEndDate, TIME_FORMAT)
                  : workingCase.requestedCustodyEndDate?.indexOf('T') > -1
                  ? formatDate(workingCase.requestedCustodyEndDate, TIME_FORMAT)
                  : null
              }
              hasError={custodyEndTimeErrorMessage !== ''}
              errorMessage={custodyEndTimeErrorMessage}
              onFocus={() => setCustodyEndTimeErrorMessage('')}
              onBlur={(evt) => {
                const validateTimeEmpty = validate(evt.target.value, 'empty')
                const validateTimeFormat = validate(
                  evt.target.value,
                  'time-format',
                )
                if (validateTimeEmpty.isValid && validateTimeFormat.isValid) {
                  const custodyEndDateMinutes = parseTime(
                    workingCase.custodyEndDate,
                    evt.target.value,
                  )

                  updateState(
                    workingCase,
                    'custodyEndDate',
                    custodyEndDateMinutes,
                    setWorkingCase,
                  )
                  api.saveCase(
                    workingCase.id,
                    parseString('custodyEndDate', custodyEndDateMinutes),
                  )
                } else {
                  setCustodyEndTimeErrorMessage(
                    validateTimeEmpty.errorMessage ||
                      validateTimeFormat.errorMessage,
                  )
                }
              }}
              required
            />
          </GridColumn>
        </GridRow>
      </Box>
      <Box component="section" marginBottom={8}>
        <Box marginBottom={2}>
          <Text as="h3" variant="h3">
            Takmarkanir á gæslu
          </Text>
        </Box>
        <Box marginBottom={1}>
          <GridRow>
            {restrictions.map((restriction, index) => {
              return (
                <GridColumn span="3/7" key={index}>
                  <Box marginBottom={3}>
                    <Checkbox
                      name={restriction.restriction}
                      label={restriction.restriction}
                      value={restriction.value}
                      checked={
                        workingCase.custodyRestrictions?.indexOf(
                          restriction.value,
                        ) > -1
                      }
                      tooltip={restriction.explination}
                      onChange={({ target }) => {
                        // Create a copy of the state
                        const copyOfState = Object.assign(workingCase, {})

                        const restrictionIsSelected =
                          copyOfState.custodyRestrictions?.indexOf(
                            target.value as CaseCustodyRestrictions,
                          ) > -1

                        // Toggle the checkbox on or off
                        restriction.setCheckbox(!restrictionIsSelected)

                        // If the user is checking the box, add the restriction to the state
                        if (!restrictionIsSelected) {
                          copyOfState.custodyRestrictions.push(
                            target.value as CaseCustodyRestrictions,
                          )
                        }
                        // If the user is unchecking the box, remove the restriction from the state
                        else {
                          const restrictions = copyOfState.custodyRestrictions
                          restrictions.splice(
                            restrictions?.indexOf(
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
                            copyOfState.custodyRestrictions,
                          ),
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
              )
            })}
          </GridRow>
        </Box>
      </Box>
      <FormFooter
        nextUrl={Constants.RULING_STEP_TWO_ROUTE}
        nextIsDisabled={isStepIllegal}
      />
    </PageLayout>
  ) : null
}

export default RulingStepOne
