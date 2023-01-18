import React from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  Case,
  CaseAppealDecision,
  SessionArrangements,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import { BlueBox } from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'

import { appealSections as m } from './AppealSections.strings'
import * as styles from './AppealSections.css'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}

const AppealSections: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer, updateCase } = useCase()

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
                value={CaseAppealDecision.Appeal}
                checked={
                  workingCase.accusedAppealDecision ===
                  CaseAppealDecision.Appeal
                }
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision: CaseAppealDecision.Appeal,
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
                value={CaseAppealDecision.Accept}
                checked={
                  workingCase.accusedAppealDecision ===
                  CaseAppealDecision.Accept
                }
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision: CaseAppealDecision.Accept,
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
                value={CaseAppealDecision.Postpone}
                checked={
                  workingCase.accusedAppealDecision ===
                  CaseAppealDecision.Postpone
                }
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision: CaseAppealDecision.Postpone,
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
                value={CaseAppealDecision.NotApplicable}
                checked={
                  workingCase.accusedAppealDecision ===
                  CaseAppealDecision.NotApplicable
                }
                onChange={() => {
                  setAndSendCaseToServer(
                    [
                      {
                        accusedAppealDecision: CaseAppealDecision.NotApplicable,
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
              value={CaseAppealDecision.Appeal}
              checked={
                workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.Appeal
              }
              onChange={() => {
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision: CaseAppealDecision.Appeal,
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
              value={CaseAppealDecision.Accept}
              checked={
                workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.Accept
              }
              onChange={() => {
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision: CaseAppealDecision.Accept,
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
              value={CaseAppealDecision.Postpone}
              checked={
                workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.Postpone
              }
              onChange={() => {
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision: CaseAppealDecision.Postpone,
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
              value={CaseAppealDecision.NotApplicable}
              checked={
                workingCase.prosecutorAppealDecision ===
                CaseAppealDecision.NotApplicable
              }
              onChange={() => {
                setAndSendCaseToServer(
                  [
                    {
                      prosecutorAppealDecision:
                        CaseAppealDecision.NotApplicable,
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
