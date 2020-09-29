import {
  Box,
  Checkbox,
  DatePicker,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  RadioButton,
  Typography,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { JudgeLogo } from '../../../shared-components/Logos'
import {
  AppealDecision,
  Case,
  CustodyRestrictions,
  GetCaseByIdResponse,
} from '../../../types'
import useWorkingCase from '../../../utils/hooks/useWorkingCase'
import * as Constants from '../../../utils/constants'
import { formatDate, parseArray, parseString } from '../../../utils/formatters'
import { CaseState } from '@island.is/judicial-system/types'
import { autoSave, updateState } from '../../../utils/stepHelper'
import * as api from '../../../api'

export const Ruling: React.FC = () => {
  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = JSON.parse(caseDraft)

  const [workingCase, setWorkingCase] = useState<Case>({
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
    custodyRestrictions: caseDraftJSON.CustodyRestrictions ?? [],
    accusedAppealDecision: caseDraftJSON.accusedAppealDecision ?? '',
    prosecutorAppealDecision: caseDraftJSON.prosecutorAppealDecision ?? '',
  })

  const [requestRecjected, setRequestRejected] = useState(
    caseDraftJSON.state === CaseState.REJECTED,
  )
  const [accusedAppealDecition, setAccusedAppealDecition] = useState<
    AppealDecision
  >(caseDraftJSON.accusedAppealDecision)
  const [prosecutorAppealDecition, setProsecutorAppealDecition] = useState(
    caseDraftJSON.prosecutorAppealDecision,
  )
  const [restrictionCheckboxOne, setRestrictionCheckboxOne] = useState(
    caseDraftJSON.requestedCustodyRestrictions?.indexOf(
      CustodyRestrictions.ISOLATION,
    ) > -1,
  )
  const [restrictionCheckboxTwo, setRestrictionCheckboxTwo] = useState(
    caseDraftJSON.requestedCustodyRestrictions?.indexOf(
      CustodyRestrictions.VISITAION,
    ) > -1,
  )
  const [restrictionCheckboxThree, setRestrictionCheckboxThree] = useState(
    caseDraftJSON.requestedCustodyRestrictions?.indexOf(
      CustodyRestrictions.COMMUNICATION,
    ) > -1,
  )
  const [restrictionCheckboxFour, setRestrictionCheckboxFour] = useState(
    caseDraftJSON.requestedCustodyRestrictions?.indexOf(
      CustodyRestrictions.MEDIA,
    ) > -1,
  )
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

  return workingCase ? (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <JudgeLogo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Box marginBottom={10}>
              <Typography as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Typography>
            </Box>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={7}>
              <Typography variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Typography>
              <Typography fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Typography>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Úrskurður
                </Typography>
              </Box>
              <Box marginBottom={2}>
                <Input
                  name="Ruling"
                  label="Niðurstaða úrskurðar"
                  placeholder="Skrifa hér..."
                  textarea
                  rows={3}
                  onBlur={(evt) => {
                    autoSave(
                      workingCase,
                      'ruling',
                      evt.target.value,
                      setWorkingCase,
                    )
                  }}
                />
              </Box>
              <GridRow>
                <GridColumn span="3/7">
                  <Checkbox
                    name="rejectRequest"
                    label="Hafna kröfu"
                    onChange={({ target }) => {
                      setRequestRejected(target.checked)
                      // Save case
                      api.saveCase(
                        workingCase.id,
                        parseString(
                          'state',
                          target.checked
                            ? CaseState.REJECTED
                            : CaseState.ACCEPTED,
                        ),
                      )

                      updateState(
                        workingCase,
                        'state',
                        target.checked
                          ? CaseState.REJECTED
                          : CaseState.ACCEPTED,
                        setWorkingCase,
                      )
                    }}
                    checked={requestRecjected}
                    large
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Dómkröfur
                </Typography>
              </Box>
              <GridRow>
                <GridColumn span="5/8">
                  <DatePicker
                    label="Gæsluvarðhald til"
                    placeholderText="Veldu dagsetningu"
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
                        date,
                        setWorkingCase,
                      )
                    }}
                  />
                </GridColumn>
                <GridColumn span="3/8">
                  <Input
                    name="requestedCustodyEndTime"
                    defaultValue={formatDate(
                      workingCase.requestedCustodyEndDate,
                      Constants.TIME_FORMAT,
                    )}
                    label="Tímasetning"
                  />
                </GridColumn>
              </GridRow>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Takmarkanir á gæslu
                </Typography>
              </Box>
              <Box marginBottom={1}>
                {restrictions.map((restriction, index) => {
                  return (
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
                  )
                })}
              </Box>
              <Typography>
                Úrskurðarorðið er lesið í heyranda hljóði að viðstöddum kærða,
                verjanda hans, túlki og aðstoðarsaksóknara.
              </Typography>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Ákvörðun um kæru
                </Typography>
              </Box>
              <Box marginBottom={3}>
                <Typography>
                  Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra
                  úrskurð þennan til Landsréttar innan þriggja sólarhringa.
                </Typography>
              </Box>
              <Box marginBottom={3}>
                <Box marginBottom={2}>
                  <Typography as="h4" variant="h4">
                    Kærði
                  </Typography>
                </Box>
                <Box marginBottom={3}>
                  <GridRow>
                    <GridColumn span="3/7">
                      <RadioButton
                        name="accused-appeal-decition"
                        id="accused-appeal"
                        label="Kærði kærir málið"
                        value={AppealDecision.APPEAL}
                        checked={
                          accusedAppealDecition === AppealDecision.APPEAL
                        }
                        onChange={() => {
                          setAccusedAppealDecition(AppealDecision.APPEAL)
                          updateState(
                            workingCase,
                            'accusedAppealDecision',
                            AppealDecision.APPEAL,
                            setWorkingCase,
                          )
                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              AppealDecision.APPEAL,
                            ),
                          )
                        }}
                        large
                      />
                    </GridColumn>
                    <GridColumn span="3/7">
                      <RadioButton
                        name="accused-appeal-decition"
                        id="accused-accept"
                        label="Kærði unir úrskurðinum"
                        value={AppealDecision.ACCEPT}
                        checked={
                          accusedAppealDecition === AppealDecision.ACCEPT
                        }
                        onChange={() => {
                          setAccusedAppealDecition(AppealDecision.ACCEPT)

                          updateState(
                            workingCase,
                            'accusedAppealDecision',
                            AppealDecision.ACCEPT,
                            setWorkingCase,
                          )

                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              AppealDecision.ACCEPT,
                            ),
                          )
                        }}
                        large
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <GridRow>
                  <GridColumn span="4/7">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-postpone"
                      label="Kærði tekur sér lögboðinn frest"
                      value={AppealDecision.POSTPONE}
                      checked={
                        accusedAppealDecition === AppealDecision.POSTPONE
                      }
                      onChange={() => {
                        setAccusedAppealDecition(AppealDecision.POSTPONE)

                        updateState(
                          workingCase,
                          'accusedAppealDecision',
                          AppealDecision.POSTPONE,
                          setWorkingCase,
                        )

                        api.saveCase(
                          workingCase.id,
                          parseString(
                            'accusedAppealDecision',
                            AppealDecision.POSTPONE,
                          ),
                        )
                      }}
                      large
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box marginBottom={3}>
                <Typography>
                  Dómari bendir kærða á að honum sé heimilt að bera atriði er
                  lúta að framkvæmd gæsluvarðhaldsins undir dómara.
                </Typography>
              </Box>
              <Box>
                <Box marginBottom={2}>
                  <Typography as="h4" variant="h4">
                    Sækjandi
                  </Typography>
                </Box>
                <Box marginBottom={3}>
                  <GridRow>
                    <GridColumn span="3/7">
                      <RadioButton
                        name="prosecutor-appeal-decition"
                        id="prosecutor-appeal"
                        label="Sækjandi kærir málið"
                        value={AppealDecision.APPEAL}
                        checked={
                          prosecutorAppealDecition === AppealDecision.APPEAL
                        }
                        onChange={() => {
                          setProsecutorAppealDecition(AppealDecision.APPEAL)

                          updateState(
                            workingCase,
                            'prosecutorAppealDecision',
                            AppealDecision.APPEAL,
                            setWorkingCase,
                          )

                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'prosecutorAppealDecision',
                              AppealDecision.APPEAL,
                            ),
                          )
                        }}
                        large
                      />
                    </GridColumn>
                    <GridColumn>
                      <RadioButton
                        name="prosecutor-appeal-decition"
                        id="prosecutor-accept"
                        label="Sækjandi unir úrskurðinum"
                        value={AppealDecision.ACCEPT}
                        checked={
                          prosecutorAppealDecition === AppealDecision.ACCEPT
                        }
                        onChange={() => {
                          setProsecutorAppealDecition(AppealDecision.ACCEPT)

                          updateState(
                            workingCase,
                            'prosecutorAppealDecision',
                            AppealDecision.ACCEPT,
                            setWorkingCase,
                          )

                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'prosecutorAppealDecision',
                              AppealDecision.ACCEPT,
                            ),
                          )
                        }}
                        large
                      />
                    </GridColumn>
                  </GridRow>
                </Box>
                <GridRow>
                  <GridColumn span="4/7">
                    <RadioButton
                      name="prosecutor-appeal-decition"
                      id="prosecutor-postpone"
                      label="Sækjandi tekur sér lögboðinn frest"
                      value={AppealDecision.POSTPONE}
                      checked={
                        prosecutorAppealDecition === AppealDecision.POSTPONE
                      }
                      onChange={() => {
                        setProsecutorAppealDecition(AppealDecision.POSTPONE)

                        updateState(
                          workingCase,
                          'prosecutorAppealDecision',
                          AppealDecision.POSTPONE,
                          setWorkingCase,
                        )

                        api.saveCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            AppealDecision.POSTPONE,
                          ),
                        )
                      }}
                      large
                    />
                  </GridColumn>
                </GridRow>
              </Box>
            </Box>
            <FormFooter
              previousUrl="/"
              nextUrl="/"
              nextIsDisabled={
                !workingCase.courtStartTime || !workingCase.courtEndTime
              }
            />
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  ) : null
}

export default Ruling
