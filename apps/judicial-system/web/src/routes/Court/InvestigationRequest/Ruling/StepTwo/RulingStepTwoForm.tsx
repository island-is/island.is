import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import {
  CaseAppealDecision,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import type { Case } from '@island.is/judicial-system/types'
import {
  BlueBox,
  FormContentContainer,
  FormFooter,
  TimeInputField,
  CaseNumbers,
} from '@island.is/judicial-system-web/src/shared-components'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Input,
  RadioButton,
  Text,
} from '@island.is/island-ui/core'
import {
  removeTabsValidateAndSet,
  validateAndSendTimeToServer,
  validateAndSendToServer,
  validateAndSetTime,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import { formatDate, TIME_FORMAT } from '@island.is/judicial-system/formatters'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import { icRulingStepTwo } from '@island.is/judicial-system-web/messages'
import { isRulingStepTwoValidIC } from '@island.is/judicial-system-web/src/utils/validate'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  isLoading: boolean
}

const RulingStepTwoForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, isLoading } = props
  const { updateCase } = useCase()
  const { formatMessage } = useIntl()
  const [courtDocumentEndEM, setCourtDocumentEndEM] = useState<string>('')

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Úrskurður og kæra
          </Text>
        </Box>
        <Box component="section" marginBottom={7}>
          <CaseNumbers workingCase={workingCase} />
        </Box>
        <Box component="section" marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              Úrskurður
            </Text>
          </Box>

          <Input
            name="conclusion"
            label="Úrskurðarorð"
            placeholder="Hver eru úrskurðarorðin?"
            defaultValue={workingCase.conclusion}
            onChange={(event) =>
              removeTabsValidateAndSet(
                'conclusion',
                event,
                [],
                workingCase,
                setWorkingCase,
              )
            }
            onBlur={(event) =>
              validateAndSendToServer(
                'conclusion',
                event.target.value,
                [],
                workingCase,
                updateCase,
              )
            }
            rows={7}
            textarea
            required
          />
        </Box>
        <Box component="section" marginBottom={8}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Ákvörðun um kæru
            </Text>
          </Box>
          {workingCase.sessionArrangements ===
            SessionArrangements.ALL_PRESENT && (
            <Box marginBottom={3}>
              <Text variant="h4" fontWeight="light">
                {formatMessage(
                  icRulingStepTwo.sections.accusedAppealDecision.disclaimer,
                )}
              </Text>
            </Box>
          )}
          <Box marginBottom={3}>
            <BlueBox>
              <Box marginBottom={2}>
                <Text as="h4" variant="h4">
                  Varnaraðili{' '}
                  <Text as="span" color="red600" fontWeight="semiBold">
                    *
                  </Text>
                </Text>
              </Box>
              <Box marginBottom={2}>
                <GridRow>
                  <GridColumn span="6/12">
                    <RadioButton
                      name="accused-appeal-decision"
                      id="accused-appeal"
                      label="Varnaraðili kærir úrskurðinn"
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
                      name="accused-appeal-decision"
                      id="accused-accept"
                      label="Varnaraðili unir úrskurðinum"
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
                      name="accused-appeal-decision"
                      id="accused-postpone"
                      label="Varnaraðili tekur sér lögboðinn frest"
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
                  <GridColumn span="5/12">
                    <RadioButton
                      name="accused-appeal-decision"
                      id="accused-not-applicable"
                      label="Á ekki við"
                      value={CaseAppealDecision.NOT_APPLICABLE}
                      checked={
                        workingCase.accusedAppealDecision ===
                        CaseAppealDecision.NOT_APPLICABLE
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          accusedAppealDecision:
                            CaseAppealDecision.NOT_APPLICABLE,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'accusedAppealDecision',
                            CaseAppealDecision.NOT_APPLICABLE,
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
                label="Yfirlýsing um kæru varnaraðila"
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
                      name="prosecutor-appeal-decision"
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
                      name="prosecutor-appeal-decision"
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
                      name="prosecutor-appeal-decision"
                      id="prosecutor-postpone"
                      label={formatMessage(
                        workingCase.sessionArrangements ===
                          SessionArrangements.REMOTE_SESSION
                          ? icRulingStepTwo.sections.prosecutorAppealDecision
                              .decisionPostponeInRemoteSession
                          : icRulingStepTwo.sections.prosecutorAppealDecision
                              .decisionPostpone,
                      )}
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
                  <GridColumn span="5/12">
                    <RadioButton
                      name="prosecutor-appeal-decision"
                      id="prosecutor-not-applicable"
                      label="Á ekki við"
                      value={CaseAppealDecision.NOT_APPLICABLE}
                      checked={
                        workingCase.prosecutorAppealDecision ===
                        CaseAppealDecision.NOT_APPLICABLE
                      }
                      onChange={() => {
                        setWorkingCase({
                          ...workingCase,
                          prosecutorAppealDecision:
                            CaseAppealDecision.NOT_APPLICABLE,
                        })

                        updateCase(
                          workingCase.id,
                          parseString(
                            'prosecutorAppealDecision',
                            CaseAppealDecision.NOT_APPLICABLE,
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
        <Box marginBottom={10}>
          <Box marginBottom={2}>
            <Text as="h3" variant="h3">
              Þinghald
            </Text>
          </Box>
          <GridContainer>
            <GridRow>
              <GridColumn>
                <TimeInputField
                  onChange={(evt) =>
                    validateAndSetTime(
                      'courtEndTime',
                      workingCase.courtStartDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      setWorkingCase,
                      courtDocumentEndEM,
                      setCourtDocumentEndEM,
                    )
                  }
                  onBlur={(evt) =>
                    validateAndSendTimeToServer(
                      'courtEndTime',
                      workingCase.courtStartDate,
                      evt.target.value,
                      ['empty', 'time-format'],
                      workingCase,
                      updateCase,
                      setCourtDocumentEndEM,
                    )
                  }
                >
                  <Input
                    data-testid="courtEndTime"
                    name="courtEndTime"
                    label="Þinghaldi lauk (kk:mm)"
                    placeholder="Veldu tíma"
                    autoComplete="off"
                    defaultValue={formatDate(
                      workingCase.courtEndTime,
                      TIME_FORMAT,
                    )}
                    errorMessage={courtDocumentEndEM}
                    hasError={courtDocumentEndEM !== ''}
                    required
                  />
                </TimeInputField>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.IC_RULING_STEP_ONE_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoading}
          nextUrl={`${Constants.IC_CONFIRMATION_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!isRulingStepTwoValidIC(workingCase)}
        />
      </FormContentContainer>
    </>
  )
}

export default RulingStepTwoForm
