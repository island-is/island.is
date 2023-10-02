import React, { useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { CaseAppealDecision } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import { SessionArrangements } from '@island.is/judicial-system-web/src/graphql/schema'
import { TempCase as Case } from '@island.is/judicial-system-web/src/types'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

import { appealSections as m } from './AppealSections.strings'
import * as styles from './AppealSections.css'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}

const AppealSections: React.FC<React.PropsWithChildren<Props>> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer, updateCase } = useCase()
  const [checkedAccusedRadio, setCheckedAccusedRadio] =
    useState<CaseAppealDecision>()
  const [checkedProsecutorRadio, setCheckedProsecutorRadio] =
    useState<CaseAppealDecision>()

  return (
    <>
      <Box marginBottom={2}>
        <Text as="h3" variant="h3">
          {formatMessage(m.titleV2)}
        </Text>
      </Box>
      <Box marginBottom={3}>
        <Text variant="h4" fontWeight="light">
          {formatMessage(m.disclaimerV2)}
        </Text>
      </Box>
      {workingCase.defendants && workingCase.defendants.length > 0 && (
        <Box marginBottom={3}>
          <BlueBox>
            <Box marginBottom={2}>
              <Text as="h4" variant="h4">
                {`${formatMessage(m.defendantTitleV2)} `}
                <Text as="span" color="red600" fontWeight="semiBold">
                  *
                </Text>
              </Text>
            </Box>
            <div className={styles.gridRowEqual}>
              <RadioButton
                name="accused-appeal-decision"
                id="accused-appeal"
                label={formatMessage(m.defendantAppealV2, {
                  accused: capitalize(
                    formatMessage(core.defendant, {
                      suffix: 'i',
                    }),
                  ),
                })}
                value={CaseAppealDecision.APPEAL}
                checked={
                  checkedAccusedRadio === CaseAppealDecision.APPEAL ||
                  (!checkedAccusedRadio &&
                    workingCase.accusedAppealDecision ===
                      CaseAppealDecision.APPEAL)
                }
                onChange={() => {
                  setCheckedAccusedRadio(CaseAppealDecision.APPEAL)
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision: CaseAppealDecision.APPEAL,
                        force: true,
                      },
                      {
                        accusedAppealAnnouncement:
                          workingCase.sessionArrangements ===
                          SessionArrangements.ALL_PRESENT_SPOKESPERSON
                            ? formatMessage(
                                m.defendantAnnouncementAutofillSpokespersonAppealV2,
                              )
                            : formatMessage(
                                m.defendantAnnouncementAutofillAppealV2,
                                { caseType: workingCase.type },
                              ),
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
              />
              <RadioButton
                name="accused-appeal-decision"
                id="accused-accept"
                label={formatMessage(m.defendantAcceptV2)}
                value={CaseAppealDecision.ACCEPT}
                checked={
                  checkedAccusedRadio === CaseAppealDecision.ACCEPT ||
                  (!checkedAccusedRadio &&
                    workingCase.accusedAppealDecision ===
                      CaseAppealDecision.ACCEPT)
                }
                onChange={() => {
                  setCheckedAccusedRadio(CaseAppealDecision.ACCEPT)
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision: CaseAppealDecision.ACCEPT,
                        force: true,
                      },
                      {
                        accusedAppealAnnouncement: '',
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </div>
            <div className={styles.gridRow2fr1fr}>
              <RadioButton
                name="accused-appeal-decision"
                id="accused-postpone"
                label={formatMessage(m.defendantPostponeV2)}
                value={CaseAppealDecision.POSTPONE}
                checked={
                  checkedAccusedRadio === CaseAppealDecision.POSTPONE ||
                  (!checkedAccusedRadio &&
                    workingCase.accusedAppealDecision ===
                      CaseAppealDecision.POSTPONE)
                }
                onChange={() => {
                  setCheckedAccusedRadio(CaseAppealDecision.POSTPONE)
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision: CaseAppealDecision.POSTPONE,
                        force: true,
                      },
                      {
                        accusedAppealAnnouncement: '',
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
              />
              <RadioButton
                name="accused-appeal-decision"
                id="accused-not-applicable"
                label={formatMessage(m.defendantNotApplicableV2)}
                value={CaseAppealDecision.NOT_APPLICABLE}
                checked={
                  checkedAccusedRadio === CaseAppealDecision.NOT_APPLICABLE ||
                  (!checkedAccusedRadio &&
                    workingCase.accusedAppealDecision ===
                      CaseAppealDecision.NOT_APPLICABLE)
                }
                onChange={() => {
                  setCheckedAccusedRadio(CaseAppealDecision.NOT_APPLICABLE)
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision:
                          CaseAppealDecision.NOT_APPLICABLE,
                        force: true,
                      },
                      {
                        accusedAppealAnnouncement: '',
                        force: true,
                      },
                    ],
                    workingCase,
                    setWorkingCase,
                  )
                }}
                large
                backgroundColor="white"
              />
            </div>
            <Input
              name="accusedAppealAnnouncement"
              data-testid="accusedAppealAnnouncement"
              label={formatMessage(m.defendantAnnouncementLabelV2)}
              value={workingCase.accusedAppealAnnouncement || ''}
              placeholder={formatMessage(m.defendantAnnouncementPlaceholderV2)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'accusedAppealAnnouncement',
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </BlueBox>
        </Box>
      )}
      <Box marginBottom={5}>
        <BlueBox>
          <Box marginBottom={2}>
            <Text as="h4" variant="h4">
              {formatMessage(m.prosecutorTitleV2)}{' '}
              <Text as="span" color="red400" fontWeight="semiBold">
                *
              </Text>
            </Text>
          </Box>
          <div className={styles.gridRowEqual}>
            <RadioButton
              name="prosecutor-appeal-decision"
              id="prosecutor-appeal"
              label={formatMessage(m.prosecutorAppealV2)}
              value={CaseAppealDecision.APPEAL}
              checked={
                checkedProsecutorRadio === CaseAppealDecision.APPEAL ||
                (!checkedProsecutorRadio &&
                  workingCase.prosecutorAppealDecision ===
                    CaseAppealDecision.APPEAL)
              }
              onChange={() => {
                setCheckedProsecutorRadio(CaseAppealDecision.APPEAL)
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision: CaseAppealDecision.APPEAL,
                      force: true,
                    },
                    {
                      prosecutorAppealAnnouncement: formatMessage(
                        m.prosecutorAnnoncementAutofillAppealV2,
                      ),
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              large
              backgroundColor="white"
            />

            <RadioButton
              name="prosecutor-appeal-decision"
              id="prosecutor-accept"
              label={formatMessage(m.prosecutorAcceptV2)}
              value={CaseAppealDecision.ACCEPT}
              checked={
                checkedProsecutorRadio === CaseAppealDecision.ACCEPT ||
                (!checkedProsecutorRadio &&
                  workingCase.prosecutorAppealDecision ===
                    CaseAppealDecision.ACCEPT)
              }
              onChange={() => {
                setCheckedProsecutorRadio(CaseAppealDecision.ACCEPT)
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
                      force: true,
                    },
                    {
                      prosecutorAppealAnnouncement: '',
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              large
              backgroundColor="white"
            />
          </div>
          <div className={styles.gridRow2fr1fr}>
            <RadioButton
              name="prosecutor-appeal-decision"
              id="prosecutor-postpone"
              label={formatMessage(m.prosecutorPostponeV2)}
              value={CaseAppealDecision.POSTPONE}
              checked={
                checkedProsecutorRadio === CaseAppealDecision.POSTPONE ||
                (!checkedProsecutorRadio &&
                  workingCase.prosecutorAppealDecision ===
                    CaseAppealDecision.POSTPONE)
              }
              onChange={() => {
                setCheckedProsecutorRadio(CaseAppealDecision.POSTPONE)
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
                      force: true,
                    },
                    {
                      prosecutorAppealAnnouncement: '',
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              large
              backgroundColor="white"
            />

            <RadioButton
              name="prosecutor-appeal-decision"
              id="prosecutor-not-applicable"
              label={formatMessage(m.prosecutorNotApplicableV2)}
              value={CaseAppealDecision.NOT_APPLICABLE}
              checked={
                checkedProsecutorRadio === CaseAppealDecision.NOT_APPLICABLE ||
                (!checkedProsecutorRadio &&
                  workingCase.prosecutorAppealDecision ===
                    CaseAppealDecision.NOT_APPLICABLE)
              }
              onChange={() => {
                setCheckedProsecutorRadio(CaseAppealDecision.NOT_APPLICABLE)
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision:
                        CaseAppealDecision.NOT_APPLICABLE,
                      force: true,
                    },
                    {
                      prosecutorAppealAnnouncement: '',
                      force: true,
                    },
                  ],
                  workingCase,
                  setWorkingCase,
                )
              }}
              large
              backgroundColor="white"
            />
          </div>
          <Box>
            <Input
              name="prosecutorAppealAnnouncement"
              data-testid="prosecutorAppealAnnouncement"
              label={formatMessage(m.prosecutorAnnouncementLabelV2)}
              value={workingCase.prosecutorAppealAnnouncement || ''}
              placeholder={formatMessage(m.prosecutorAnnouncementPlaceholderV2)}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'prosecutorAppealAnnouncement',
                  event.target.value,
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
              autoExpand={{ on: true, maxHeight: 300 }}
            />
          </Box>
        </BlueBox>
      </Box>
    </>
  )
}

export default AppealSections
