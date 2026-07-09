import { Dispatch, FC, SetStateAction, useState } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, RadioButton } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import {
  AppealDecisionPartyRole,
  Case,
  CaseAppealDecision,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import useCaseAppealDecision from '@island.is/judicial-system-web/src/utils/hooks/useCaseAppealDecision'
import { grid } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  caseLevelAppealDecision,
  withCaseLevelAppealDecision,
} from '@island.is/judicial-system-web/src/utils/utils'

import useDebouncedAppealAnnouncement from './useDebouncedAppealAnnouncement'
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
  const { updateCaseAppealDecision } = useCaseAppealDecision()
  const [checkedAccusedRadio, setCheckedAccusedRadio] =
    useState<CaseAppealDecision>()
  const [checkedProsecutorRadio, setCheckedProsecutorRadio] =
    useState<CaseAppealDecision>()

  const accusedAppealDecision = caseLevelAppealDecision(
    workingCase,
    AppealDecisionPartyRole.DEFENDANT,
  )
  const prosecutorAppealDecision = caseLevelAppealDecision(
    workingCase,
    AppealDecisionPartyRole.PROSECUTOR,
  )

  const accusedAppealAnnouncementInput = useDebouncedAppealAnnouncement(
    AppealDecisionPartyRole.DEFENDANT,
  )
  const prosecutorAppealAnnouncementInput = useDebouncedAppealAnnouncement(
    AppealDecisionPartyRole.PROSECUTOR,
  )

  const handleChange = (update: {
    accusedAppealDecision?: CaseAppealDecision
    accusedAppealAnnouncement?: string
    prosecutorAppealDecision?: CaseAppealDecision
    prosecutorAppealAnnouncement?: string
  }) => {
    // Optimistically update the case-level appeal_decision rows the UI reads;
    // the mutation persists them server-side.
    setWorkingCase((prev) => {
      let appealDecisions = prev.appealDecisions
      if (
        update.accusedAppealDecision !== undefined ||
        update.accusedAppealAnnouncement !== undefined
      ) {
        appealDecisions = withCaseLevelAppealDecision(
          appealDecisions,
          AppealDecisionPartyRole.DEFENDANT,
          {
            ...(update.accusedAppealDecision !== undefined
              ? { decision: update.accusedAppealDecision }
              : {}),
            ...(update.accusedAppealAnnouncement !== undefined
              ? { announcement: update.accusedAppealAnnouncement }
              : {}),
          },
        )
      }
      if (
        update.prosecutorAppealDecision !== undefined ||
        update.prosecutorAppealAnnouncement !== undefined
      ) {
        appealDecisions = withCaseLevelAppealDecision(
          appealDecisions,
          AppealDecisionPartyRole.PROSECUTOR,
          {
            ...(update.prosecutorAppealDecision !== undefined
              ? { decision: update.prosecutorAppealDecision }
              : {}),
            ...(update.prosecutorAppealAnnouncement !== undefined
              ? { announcement: update.prosecutorAppealAnnouncement }
              : {}),
          },
        )
      }
      return { ...prev, appealDecisions }
    })

    if (
      update.accusedAppealDecision !== undefined ||
      update.accusedAppealAnnouncement !== undefined
    ) {
      updateCaseAppealDecision({
        caseId: workingCase.id,
        partyRole: AppealDecisionPartyRole.DEFENDANT,
        decision: update.accusedAppealDecision,
        announcement: update.accusedAppealAnnouncement,
      })
    }

    if (
      update.prosecutorAppealDecision !== undefined ||
      update.prosecutorAppealAnnouncement !== undefined
    ) {
      updateCaseAppealDecision({
        caseId: workingCase.id,
        partyRole: AppealDecisionPartyRole.PROSECUTOR,
        decision: update.prosecutorAppealDecision,
        announcement: update.prosecutorAppealAnnouncement,
      })
    }

    if (onChange) {
      onChange(update)
    }
  }
  return (
    <>
      <SectionHeading
        title={formatMessage(m.titleV2)}
        description={formatMessage(m.disclaimerV2)}
      />
      <div className={grid({ gap: 3 })}>
        {workingCase.defendants && workingCase.defendants.length > 0 && (
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
                    accusedAppealDecision === CaseAppealDecision.APPEAL)
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
                    accusedAppealDecision === CaseAppealDecision.ACCEPT)
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
                    accusedAppealDecision === CaseAppealDecision.POSTPONE)
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
                    accusedAppealDecision === CaseAppealDecision.NOT_APPLICABLE)
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
              value={accusedAppealAnnouncementInput.value || ''}
              placeholder={formatMessage(m.defendantAnnouncementPlaceholderV2)}
              onChange={(evt) => {
                const accusedAppealAnnouncement = evt.target.value

                accusedAppealAnnouncementInput.onChange(
                  accusedAppealAnnouncement,
                )

                if (onChange) {
                  onChange({ accusedAppealAnnouncement })
                }
              }}
              textarea
              rows={7}
            />
          </BlueBox>
        )}
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
                  prosecutorAppealDecision === CaseAppealDecision.APPEAL)
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
                  prosecutorAppealDecision === CaseAppealDecision.ACCEPT)
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
                  prosecutorAppealDecision === CaseAppealDecision.POSTPONE)
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
                  prosecutorAppealDecision ===
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
              value={prosecutorAppealAnnouncementInput.value || ''}
              placeholder={formatMessage(m.prosecutorAnnouncementPlaceholderV2)}
              onChange={(evt) => {
                const prosecutorAppealAnnouncement = evt.target.value

                prosecutorAppealAnnouncementInput.onChange(
                  prosecutorAppealAnnouncement,
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
      </div>
    </>
  )
}

export default AppealSections
