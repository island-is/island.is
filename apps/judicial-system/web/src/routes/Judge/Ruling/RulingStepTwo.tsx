import {
  Box,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import React, { useEffect, useState } from 'react'
import { FormFooter } from '../../../shared-components/FormFooter'
import { Case } from '../../../types'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import * as Constants from '../../../utils/constants'
import { parseString } from '../../../utils/formatters'
import {
  autoSave,
  constructConclusion,
  updateState,
} from '../../../utils/stepHelper'
import * as api from '../../../api'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'

export const RulingStepTwo: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<Case>()

  useEffect(() => {
    document.title = 'Úrskurðarorð - Réttarvörslugátt'
  }, [])

  useEffect(() => {
    const caseDraft = window.sessionStorage.getItem('workingCase')

    if (caseDraft && caseDraft !== 'undefined' && !workingCase) {
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

  return (
    <PageLayout activeSection={1} activeSubSection={3}>
      {workingCase ? (
        <>
          <Box marginBottom={10}>
            <Text as="h1" variant="h1">
              Úrskurður og kæra
            </Text>
          </Box>
          <Box component="section" marginBottom={7}>
            <Text variant="h2">{`Mál nr. ${workingCase.courtCaseNumber}`}</Text>
            <Text fontWeight="semiBold">{`LÖKE málsnr. ${workingCase.policeCaseNumber}`}</Text>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={10}>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Úrskurðarorð
                </Text>
              </Box>
              <Box marginBottom={3}>
                <Text>{constructConclusion(workingCase)}</Text>
              </Box>
              <Text variant="h4" fontWeight="light">
                Úrskurðarorðið er lesið í heyranda hljóði að viðstöddum kærða,
                verjanda hans, túlki og aðstoðarsaksóknara.
              </Text>
            </Box>
          </Box>
          <Box component="section" marginBottom={8}>
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Ákvörðun um kæru
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Text variant="h4" fontWeight="light">
                Dómari leiðbeinir málsaðilum um rétt þeirra til að kæra úrskurð
                þennan til Landsréttar innan þriggja sólarhringa.
              </Text>
            </Box>
            <Box marginBottom={3}>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Kærði{' '}
                  <Text as="span" color="red400" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
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
                        workingCase.accusedAppealDecision ===
                        CaseAppealDecision.APPEAL
                      }
                      onChange={() => {
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
                        workingCase.accusedAppealDecision ===
                        CaseAppealDecision.ACCEPT
                      }
                      onChange={() => {
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
              <Box marginBottom={4}>
                <GridRow>
                  <GridColumn span="4/7">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-postpone"
                      label="Kærði tekur sér lögboðinn frest"
                      value={CaseAppealDecision.POSTPONE}
                      checked={
                        workingCase.accusedAppealDecision ===
                        CaseAppealDecision.POSTPONE
                      }
                      onChange={() => {
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
              <Input
                name="accusedAppealAnnouncement"
                data-testid="accusedAppealAnnouncement"
                label="Yfirlýsing um kæru kærða"
                defaultValue={workingCase.accusedAppealAnnouncement}
                disabled={
                  workingCase.accusedAppealDecision !==
                  CaseAppealDecision.APPEAL
                }
                placeholder="Í hvaða skyni er kært?"
                onBlur={(evt) => {
                  autoSave(
                    workingCase,
                    'accusedAppealAnnouncement',
                    evt.target.value,
                    setWorkingCase,
                  )
                }}
                textarea
                rows={7}
              />
            </Box>
            <Box marginBottom={2}>
              <Text as="h4" variant="h4">
                Sækjandi{' '}
                <Text as="span" color="red400" fontWeight="semiBold">
                  *
                </Text>
              </Text>
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
                      workingCase.prosecutorAppealDecision ===
                      CaseAppealDecision.APPEAL
                    }
                    onChange={() => {
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
                      workingCase.prosecutorAppealDecision ===
                      CaseAppealDecision.ACCEPT
                    }
                    onChange={() => {
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
            <Box marginBottom={4}>
              <GridRow>
                <GridColumn span="4/7">
                  <RadioButton
                    name="prosecutor-appeal-decition"
                    id="prosecutor-postpone"
                    label="Sækjandi tekur sér lögboðinn frest"
                    value={CaseAppealDecision.POSTPONE}
                    checked={
                      workingCase.prosecutorAppealDecision ===
                      CaseAppealDecision.POSTPONE
                    }
                    onChange={() => {
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
            <Box marginBottom={1}>
              <Input
                name="prosecutorAppealAnnouncement"
                data-testid="prosecutorAppealAnnouncement"
                label="Yfirlýsing um kæru sækjanda"
                defaultValue={workingCase.prosecutorAppealAnnouncement}
                disabled={
                  workingCase.prosecutorAppealDecision !==
                  CaseAppealDecision.APPEAL
                }
                placeholder="Í hvaða skyni er kært?"
                onBlur={(evt) => {
                  autoSave(
                    workingCase,
                    'prosecutorAppealAnnouncement',
                    evt.target.value,
                    setWorkingCase,
                  )
                }}
                textarea
                rows={7}
              />
            </Box>
            <Text variant="h4" fontWeight="light">
              Dómari bendir kærða á að honum sé heimilt að bera atriði er lúta
              að framkvæmd gæsluvarðhaldsins undir dómara.
            </Text>
          </Box>
          <FormFooter
            nextUrl={Constants.CONFIRMATION_ROUTE}
            nextIsDisabled={
              !workingCase.accusedAppealDecision ||
              !workingCase.prosecutorAppealDecision
            }
          />
        </>
      ) : null}
    </PageLayout>
  )
}

export default RulingStepTwo
