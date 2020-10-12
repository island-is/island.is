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
import { formatDate } from '@island.is/judicial-system/formatters'
import React, { useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { JudgeLogo } from '../../../shared-components/Logos'
import { Case } from '../../../types'
import {
  CaseAppealDecision,
  CaseCustodyRestrictions,
} from '@island.is/judicial-system/types'
import * as Constants from '../../../utils/constants'
import { TIME_FORMAT } from '@island.is/judicial-system/formatters'
import { parseArray, parseString } from '../../../utils/formatters'
import {
  autoSave,
  constructConclusion,
  renderFormStepper,
  updateState,
} from '../../../utils/stepHelper'
import * as api from '../../../api'

export const RulingStepTwo: React.FC = () => {
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
    rejecting: caseDraftJSON.rejecting ?? false,
    custodyEndDate: caseDraftJSON.custodyEndDate ?? '',
    custodyRestrictions: caseDraftJSON.custodyRestrictions ?? [],
    accusedAppealDecision: caseDraftJSON.accusedAppealDecision ?? '',
    prosecutorAppealDecision: caseDraftJSON.prosecutorAppealDecision ?? '',
  })

  const [accusedAppealDecition, setAccusedAppealDecition] = useState<
    CaseAppealDecision
  >(caseDraftJSON.accusedAppealDecision)
  const [prosecutorAppealDecition, setProsecutorAppealDecition] = useState(
    caseDraftJSON.prosecutorAppealDecision,
  )

  useEffect(() => {
    document.title = 'Úrskurðarorð - Réttarvörslugátt'
  }, [])

  return workingCase ? (
    <Box marginTop={7} marginBottom={30}>
      <GridContainer>
        <Box marginBottom={7}>
          <GridRow>
            <GridColumn span={'3/12'}>
              <JudgeLogo />
            </GridColumn>
            <GridColumn span={'8/12'} offset={'1/12'}>
              <Typography as="h1" variant="h1">
                Krafa um gæsluvarðhald
              </Typography>
            </GridColumn>
          </GridRow>
        </Box>
        <GridRow>
          <GridColumn span={['12/12', '3/12']}>
            {renderFormStepper(1, 3)}
          </GridColumn>
          <GridColumn span={['12/12', '7/12']} offset={['0', '1/12']}>
            <Box component="section" marginBottom={7}>
              <Typography variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Typography>
              <Typography fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Typography>
            </Box>
            <Box component="section" marginBottom={8}>
              <Box marginBottom={10}>
                <Box marginBottom={2}>
                  <Typography as="h4" variant="h4">
                    Úrskurðarorð
                  </Typography>
                </Box>
                <Box marginBottom={3}>
                  <Typography>{constructConclusion(workingCase)}</Typography>
                </Box>
                <Typography>
                  Úrskurðarorðið er lesið í heyranda hljóði að viðstöddum kærða,
                  verjanda hans, túlki og aðstoðarsaksóknara.
                </Typography>
              </Box>
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
                        value={CaseAppealDecision.APPEAL}
                        checked={
                          accusedAppealDecition === CaseAppealDecision.APPEAL
                        }
                        onChange={() => {
                          setAccusedAppealDecition(CaseAppealDecision.APPEAL)
                          updateState(
                            workingCase,
                            'accusedAppealDecision',
                            CaseAppealDecision.APPEAL,
                            setWorkingCase,
                          )
                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.APPEAL,
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
                        value={CaseAppealDecision.ACCEPT}
                        checked={
                          accusedAppealDecition === CaseAppealDecision.ACCEPT
                        }
                        onChange={() => {
                          setAccusedAppealDecition(CaseAppealDecision.ACCEPT)

                          updateState(
                            workingCase,
                            'accusedAppealDecision',
                            CaseAppealDecision.ACCEPT,
                            setWorkingCase,
                          )

                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'accusedAppealDecision',
                              CaseAppealDecision.ACCEPT,
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
                      value={CaseAppealDecision.POSTPONE}
                      checked={
                        accusedAppealDecition === CaseAppealDecision.POSTPONE
                      }
                      onChange={() => {
                        setAccusedAppealDecition(CaseAppealDecision.POSTPONE)

                        updateState(
                          workingCase,
                          'accusedAppealDecision',
                          CaseAppealDecision.POSTPONE,
                          setWorkingCase,
                        )

                        api.saveCase(
                          workingCase.id,
                          parseString(
                            'accusedAppealDecision',
                            CaseAppealDecision.POSTPONE,
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
                        value={CaseAppealDecision.APPEAL}
                        checked={
                          prosecutorAppealDecition === CaseAppealDecision.APPEAL
                        }
                        onChange={() => {
                          setProsecutorAppealDecition(CaseAppealDecision.APPEAL)

                          updateState(
                            workingCase,
                            'prosecutorAppealDecision',
                            CaseAppealDecision.APPEAL,
                            setWorkingCase,
                          )

                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'prosecutorAppealDecision',
                              CaseAppealDecision.APPEAL,
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
                        value={CaseAppealDecision.ACCEPT}
                        checked={
                          prosecutorAppealDecition === CaseAppealDecision.ACCEPT
                        }
                        onChange={() => {
                          setProsecutorAppealDecition(CaseAppealDecision.ACCEPT)

                          updateState(
                            workingCase,
                            'prosecutorAppealDecision',
                            CaseAppealDecision.ACCEPT,
                            setWorkingCase,
                          )

                          api.saveCase(
                            workingCase.id,
                            parseString(
                              'prosecutorAppealDecision',
                              CaseAppealDecision.ACCEPT,
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
                      value={CaseAppealDecision.POSTPONE}
                      checked={
                        prosecutorAppealDecition === CaseAppealDecision.POSTPONE
                      }
                      onChange={() => {
                        setProsecutorAppealDecition(CaseAppealDecision.POSTPONE)

                        updateState(
                          workingCase,
                          'prosecutorAppealDecision',
                          CaseAppealDecision.POSTPONE,
                          setWorkingCase,
                        )

                        api.saveCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.POSTPONE,
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
              nextUrl={Constants.CONFIRMATION_ROUTE}
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

export default RulingStepTwo
