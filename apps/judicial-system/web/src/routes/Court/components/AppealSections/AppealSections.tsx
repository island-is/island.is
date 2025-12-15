import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, RadioButton, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  CaseAppealDecision,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '@island.is/judicial-system-web/src/utils/formHelper'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'
import { isNullOrUndefined } from '@island.is/judicial-system-web/src/utils/validate'

import { appealSections as m } from './AppealSections.strings'
import * as styles from './AppealSections.css'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  onChange?: ({
    accusedAppealDecision,
    accusedAppealAnnouncement,
    prosecutorAppealDecision,
    prosecutorAppealAnnouncement,
  }: {
    accusedAppealDecision?: CaseAppealDecision
    accusedAppealAnnouncement?: string
    prosecutorAppealDecision?: CaseAppealDecision
    prosecutorAppealAnnouncement?: string
  }) => void
}

const AppealSections: FC<Props> = ({
  workingCase,
  setWorkingCase,
  onChange,
}) => {
  const { formatMessage } = useIntl()
  const { setAndSendCaseToServer, updateCase } = useCase()
  const [checkedAccusedRadio, setCheckedAccusedRadio] =
    useState<CaseAppealDecision>()
  const [checkedProsecutorRadio, setCheckedProsecutorRadio] =
    useState<CaseAppealDecision>()

  const handleChange = (update: {
    accusedAppealDecision?: CaseAppealDecision
    accusedAppealAnnouncement?: string
    prosecutorAppealDecision?: CaseAppealDecision
    prosecutorAppealAnnouncement?: string
  }) => {
    setAndSendCaseToServer(
      [
        ...(!isNullOrUndefined(update.accusedAppealDecision)
          ? [
              {
                accusedAppealDecision: update.accusedAppealDecision,
                force: true,
              },
            ]
          : []),
        ...(!isNullOrUndefined(update.accusedAppealAnnouncement)
          ? [
              {
                accusedAppealAnnouncement: update.accusedAppealAnnouncement,
                force: true,
              },
            ]
          : []),
        ...(!isNullOrUndefined(update.prosecutorAppealDecision)
          ? [
              {
                prosecutorAppealDecision: update.prosecutorAppealDecision,
                force: true,
              },
            ]
          : []),
        ...(!isNullOrUndefined(update.prosecutorAppealAnnouncement)
          ? [
              {
                prosecutorAppealAnnouncement:
                  update.prosecutorAppealAnnouncement,
                force: true,
              },
            ]
          : []),
      ],
      workingCase,
      setWorkingCase,
    )
    if (onChange) {
      onChange(update)
    }
  }
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
            <SectionHeading
              title={formatMessage(m.defendantTitleV2)}
              heading="h4"
              marginBottom={2}
              required
            />
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
                  const update = {
                    accusedAppealDecision: CaseAppealDecision.APPEAL,
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
                  }
                  setCheckedAccusedRadio(CaseAppealDecision.APPEAL)
                  handleChange(update)
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
                  const update = {
                    accusedAppealDecision: CaseAppealDecision.ACCEPT,
                    accusedAppealAnnouncement: '',
                  }
                  setCheckedAccusedRadio(CaseAppealDecision.ACCEPT)
                  handleChange(update)
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
                  const update = {
                    accusedAppealDecision: CaseAppealDecision.POSTPONE,
                    accusedAppealAnnouncement: '',
                  }
                  setCheckedAccusedRadio(CaseAppealDecision.POSTPONE)
                  handleChange(update)
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
                  const update = {
                    accusedAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
                    accusedAppealAnnouncement: '',
                  }
                  setCheckedAccusedRadio(CaseAppealDecision.NOT_APPLICABLE)
                  handleChange(update)
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
                  setWorkingCase,
                )
              }
              onBlur={(event) => {
                const accusedAppealAnnouncement = event.target.value
                validateAndSendToServer(
                  'accusedAppealAnnouncement',
                  accusedAppealAnnouncement,
                  [],
                  workingCase,
                  updateCase,
                )
                if (onChange) {
                  onChange({ accusedAppealAnnouncement })
                }
              }}
              textarea
              rows={7}
            />
          </BlueBox>
        </Box>
      )}
      <Box marginBottom={5}>
        <BlueBox>
          <SectionHeading
            title={formatMessage(m.prosecutorTitleV2)}
            heading="h4"
            marginBottom={2}
            required
          />
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
                const update = {
                  prosecutorAppealDecision: CaseAppealDecision.APPEAL,
                  prosecutorAppealAnnouncement: formatMessage(
                    m.prosecutorAnnoncementAutofillAppealV2,
                  ),
                }
                setCheckedProsecutorRadio(CaseAppealDecision.APPEAL)
                handleChange(update)
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
                const update = {
                  prosecutorAppealDecision: CaseAppealDecision.ACCEPT,
                  prosecutorAppealAnnouncement: '',
                }
                setCheckedProsecutorRadio(CaseAppealDecision.ACCEPT)
                handleChange(update)
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
                const update = {
                  prosecutorAppealDecision: CaseAppealDecision.POSTPONE,
                  prosecutorAppealAnnouncement: '',
                }
                setCheckedProsecutorRadio(CaseAppealDecision.POSTPONE)
                handleChange(update)
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
                const update = {
                  prosecutorAppealDecision: CaseAppealDecision.NOT_APPLICABLE,
                  prosecutorAppealAnnouncement: '',
                }
                setCheckedProsecutorRadio(CaseAppealDecision.NOT_APPLICABLE)
                handleChange(update)
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
                  setWorkingCase,
                )
              }
              onBlur={(event) => {
                const prosecutorAppealAnnouncement = event.target.value
                validateAndSendToServer(
                  'prosecutorAppealAnnouncement',
                  prosecutorAppealAnnouncement,
                  [],
                  workingCase,
                  updateCase,
                )
                if (onChange) {
                  onChange({ prosecutorAppealAnnouncement })
                }
              }}
              textarea
              rows={7}
            />
          </Box>
        </BlueBox>
      </Box>
    </>
  )
}

export default AppealSections
