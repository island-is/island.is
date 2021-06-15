import React from 'react'
import {
  Case,
  CaseAppealDecision,
  CaseGender,
} from '@island.is/judicial-system/types'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Box,
  GridColumn,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import useCase from '@island.is/judicial-system-web/src/utils/hooks/useCase'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import {
  capitalize,
  formatAccusedByGender,
  NounCases,
} from '@island.is/judicial-system/formatters'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const RulingStepTwoForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const { updateCase } = useCase()

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Úrskurður og kæra
          </Text>
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Úrskurður
            </Text>
          </Box>
          <Input
            name="additionToConclusion"
            label="Bæta texta við úrskurðarorð"
            placeholder="Hér er hægt að bæta texta við úrskurðarorð eftir þörfum"
            defaultValue={workingCase?.additionToConclusion}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'additionToConclusion',
                event,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'additionToConclusion',
                event.target.value,
                [],
                workingCase,
                updateCase,
              )
            }
            rows={7}
            textarea
          />
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
            <BlueBox>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  {capitalize(
                    formatAccusedByGender(
                      workingCase.accusedGender || CaseGender.OTHER,
                    ),
                  )}{' '}
                  <Text as="span" color="red600" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-appeal"
                      label={`${capitalize(
                        formatAccusedByGender(
                          workingCase.accusedGender || CaseGender.OTHER,
                        ),
                      )} kærir úrskurðinn`}
                      value={CaseAppealDecision.APPEAL}
                      checked={
                        workingCase.accusedAppealDecision ===
                        CaseAppealDecision.APPEAL
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          accusedAppealDecision: CaseAppealDecision.APPEAL,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'accusedAppealDecision',
                            CaseAppealDecision.APPEAL,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-accept"
                      label={`${capitalize(
                        formatAccusedByGender(
                          workingCase.accusedGender || CaseGender.OTHER,
                        ),
                      )} unir úrskurðinum`}
                      value={CaseAppealDecision.ACCEPT}
                      checked={
                        workingCase.accusedAppealDecision ===
                        CaseAppealDecision.ACCEPT
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          accusedAppealDecision: CaseAppealDecision.ACCEPT,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'accusedAppealDecision',
                            CaseAppealDecision.ACCEPT,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="7/12">
                    <RadioButton
                      name="accused-appeal-decition"
                      id="accused-postpone"
                      label={`${capitalize(
                        formatAccusedByGender(
                          workingCase.accusedGender || CaseGender.OTHER,
                        ),
                      )}  tekur sér lögboðinn frest`}
                      value={CaseAppealDecision.POSTPONE}
                      checked={
                        workingCase.accusedAppealDecision ===
                        CaseAppealDecision.POSTPONE
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          accusedAppealDecision: CaseAppealDecision.POSTPONE,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'accusedAppealDecision',
                            CaseAppealDecision.POSTPONE,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Input
                name="accusedAppealAnnouncement"
                data-testid="accusedAppealAnnouncement"
                label={`Yfirlýsing um kæru ${formatAccusedByGender(
                  workingCase.accusedGender || CaseGender.OTHER,
                  NounCases.DATIVE,
                )}`}
                defaultValue={workingCase.accusedAppealAnnouncement}
                disabled={
                  workingCase.accusedAppealDecision !==
                  CaseAppealDecision.APPEAL
                }
                placeholder="Í hvaða skyni er kært?"
                onChange={(event) =>
                  removeTabsValidateAndSet(
                    'accusedAppealAnnouncement',
                    event,
                    [],
                    workingCase,
                    setWorkingCase,
                  )
                }
                onBlur={(event) =>
                  validateAndSendToServer(
                    'accusedAppealAnnouncement',
                    event.target.value,
                    [],
                    workingCase,
                    updateCase,
                  )
                }
                textarea
                rows={7}
              />
            </BlueBox>
          </Box>
          <Box marginBottom={5}>
            <BlueBox>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Sækjandi{' '}
                  <Text as="span" color="red400" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="prosecutor-appeal-decition"
                      id="prosecutor-appeal"
                      label="Sækjandi kærir úrskurðinn"
                      value={CaseAppealDecision.APPEAL}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.APPEAL
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.APPEAL,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.APPEAL,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                  <GridColumn span="6/12">
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
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.ACCEPT,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="7/12">
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
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.POSTPONE,
                          ),
                        )
                      }}
                      large
                      backgroundColor="white"
                    />
                  </GridColumn>
                </GridRow>
              </Box>
              <Box>
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
                  onChange={(event) =>
                    removeTabsValidateAndSet(
                      'prosecutorAppealAnnouncement',
                      event,
                      [],
                      workingCase,
                      setWorkingCase,
                    )
                  }
                  onBlur={(event) =>
                    validateAndSendToServer(
                      'prosecutorAppealAnnouncement',
                      event.target.value,
                      [],
                      workingCase,
                      updateCase,
                    )
                  }
                  textarea
                  rows={7}
                />
              </Box>
            </BlueBox>
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.R_CASE_RULING_STEP_ONE_ROUTE}/${workingCase.id}}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.R_CASE_CONFIRMATION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={
            !workingCase.accusedAppealDecision ||
            !workingCase.prosecutorAppealDecision
          }
        />
      </FormContentContainer>
    </>
  )
}

export default RulingStepTwoForm
