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
import {
  Case,
  CaseAppealDecision,
  UpdateCase,
} from '@island.is/judicial-system/types'
import * as Constants from '../../../utils/constants'
import { parseString } from '../../../utils/formatters'
import {
  autoSave,
  constructConclusion,
  createCaseFromDraft,
  updateState,
} from '../../../utils/stepHelper'
import { PageLayout } from '@island.is/judicial-system-web/src/shared-components/PageLayout/PageLayout'
import { useMutation } from '@apollo/client'
import { UpdateCaseMutation } from '@island.is/judicial-system-web/src/graphql'

export const RulingStepTwo: React.FC = () => {
  const caseDraft = window.localStorage.getItem('workingCase')
  const caseDraftJSON = createCaseFromDraft(caseDraft)
  const [workingCase, setWorkingCase] = useState<Case>(caseDraftJSON)

  const [accusedAppealDecition, setAccusedAppealDecition] = useState<
    CaseAppealDecision
  >(caseDraftJSON.accusedAppealDecision)
  const [prosecutorAppealDecition, setProsecutorAppealDecition] = useState(
    caseDraftJSON.prosecutorAppealDecision,
  )

  useEffect(() => {
    document.title = 'Úrskurðarorð - Réttarvörslugátt'
  }, [])

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

  return workingCase ? (
    <PageLayout activeSection={1} activeSubSection={3}>
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
                  checked={accusedAppealDecition === CaseAppealDecision.APPEAL}
                  onChange={() => {
                    setAccusedAppealDecition(CaseAppealDecision.APPEAL)
                    updateState(
                      workingCase,
                      'accusedAppealDecision',
                      CaseAppealDecision.APPEAL,
                      setWorkingCase,
                    )
                    updateCase(
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
                  checked={accusedAppealDecition === CaseAppealDecision.ACCEPT}
                  onChange={() => {
                    setAccusedAppealDecition(CaseAppealDecision.ACCEPT)

                    updateState(
                      workingCase,
                      'accusedAppealDecision',
                      CaseAppealDecision.ACCEPT,
                      setWorkingCase,
                    )

                    updateCase(
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

                    updateCase(
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
              workingCase.accusedAppealDecision !== CaseAppealDecision.APPEAL
            }
            placeholder="Í hvaða skyni er kært?"
            onBlur={(evt) => {
              autoSave(
                workingCase,
                'accusedAppealAnnouncement',
                evt.target.value,
                setWorkingCase,
                updateCase,
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
                checked={prosecutorAppealDecition === CaseAppealDecision.APPEAL}
                onChange={() => {
                  setProsecutorAppealDecition(CaseAppealDecision.APPEAL)

                  updateState(
                    workingCase,
                    'prosecutorAppealDecision',
                    CaseAppealDecision.APPEAL,
                    setWorkingCase,
                  )

                  updateCase(
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
                checked={prosecutorAppealDecition === CaseAppealDecision.ACCEPT}
                onChange={() => {
                  setProsecutorAppealDecition(CaseAppealDecision.ACCEPT)

                  updateState(
                    workingCase,
                    'prosecutorAppealDecision',
                    CaseAppealDecision.ACCEPT,
                    setWorkingCase,
                  )

                  updateCase(
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

                  updateCase(
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
              workingCase.prosecutorAppealDecision !== CaseAppealDecision.APPEAL
            }
            placeholder="Í hvaða skyni er kært?"
            onBlur={(evt) => {
              autoSave(
                workingCase,
                'prosecutorAppealAnnouncement',
                evt.target.value,
                setWorkingCase,
                updateCase,
              )
            }}
            textarea
            rows={7}
          />
        </Box>
        <Text variant="h4" fontWeight="light">
          Dómari bendir kærða á að honum sé heimilt að bera atriði er lúta að
          framkvæmd gæsluvarðhaldsins undir dómara.
        </Text>
      </Box>
      <FormFooter
        nextUrl={Constants.CONFIRMATION_ROUTE}
        nextIsDisabled={
          !workingCase.accusedAppealDecision ||
          !workingCase.prosecutorAppealDecision
        }
      />
    </PageLayout>
  ) : null
}

export default RulingStepTwo
