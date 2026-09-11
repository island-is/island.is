import type { Dispatch, FC, SetStateAction } from 'react'
import { useState } from 'react'
import { useIntl } from 'react-intl'

import {
  AlertMessage,
  Box,
  Input,
  RadioButton,
} from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { appealCorrectionLock } from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import type { Case } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
  SessionArrangements,
} from '@island.is/judicial-system-web/src/graphql/schema'
import useCaseAppealDecision from '@island.is/judicial-system-web/src/utils/hooks/useCaseAppealDecision'
import useSerializedSave from '@island.is/judicial-system-web/src/utils/hooks/useSerializedSave'
import { stack } from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import {
  caseLevelAppealDecision,
  caseLevelAppealDecisionRow,
  revertCaseLevelAppealDecision,
  withCaseLevelAppealDecision,
} from '@island.is/judicial-system-web/src/utils/utils'

import useDebouncedAppealAnnouncement from './useDebouncedAppealAnnouncement'
import { appealSections as m } from './AppealSections.strings'
import * as styles from './AppealSections.css'

type AppealDecisionRow = NonNullable<Case['appealDecisions']>[number]

interface AppealDecisionPatch {
  decision?: CaseAppealDecision
  announcement?: string
}

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
  // Runs each party's saves one at a time and knows which row the server has
  const saveAppealDecision = useSerializedSave<AppealDecisionRow | undefined>()

  const accusedAppealDecision = caseLevelAppealDecision(
    workingCase.appealDecisions,
    AppealDecisionPartyRole.DEFENDANT,
  )
  const prosecutorAppealDecision = caseLevelAppealDecision(
    workingCase.appealDecisions,
    AppealDecisionPartyRole.PROSECUTOR,
  )

  const accusedAppealAnnouncementInput = useDebouncedAppealAnnouncement(
    AppealDecisionPartyRole.DEFENDANT,
  )
  const prosecutorAppealAnnouncementInput = useDebouncedAppealAnnouncement(
    AppealDecisionPartyRole.PROSECUTOR,
  )

  // The in-court decisions describe what happened at the ruling, so they may
  // only be edited while the court record still governs the appeal they produced
  // (see appealCorrectionLock). case.service.upsertCaseAppealDecision rejects the
  // same cases server-side - this only keeps the UI from offering them. The lock
  // reason is kept so the section can say which of the two applies.
  const lock = appealCorrectionLock(workingCase.appealCase)
  const disabled = Boolean(lock)

  // Puts a party's case-level row back to the one the server holds, so the
  // working case only claims a decision the server has. The court record step
  // is validated against the working case, and a decision that never reached
  // the server (network down, backend error) would otherwise let the judge
  // continue and complete the case with an incomplete court record - the
  // backend rejects that completion, but the judge should see the problem
  // here, where it can be fixed.
  const revertAppealDecision = (
    caseId: string,
    partyRole: AppealDecisionPartyRole,
    confirmedRow: AppealDecisionRow | undefined,
  ) => {
    setWorkingCase((prev) =>
      // The page is reused across cases, so a save that fails after the judge
      // has moved on to another case must not touch that case
      prev.id !== caseId
        ? prev
        : {
            ...prev,
            appealDecisions: revertCaseLevelAppealDecision(
              prev.appealDecisions,
              confirmedRow ? [confirmedRow] : [],
              partyRole,
            ),
          },
    )

    // Let the radio fall back to whatever the working case now holds
    if (partyRole === AppealDecisionPartyRole.DEFENDANT) {
      setCheckedAccusedRadio(undefined)
    } else {
      setCheckedProsecutorRadio(undefined)
    }
  }

  // Persists one party's row. The mutation toasts its own error and resolves
  // to undefined on failure. Resolves to whether the save succeeded and is
  // still the party's latest - a superseded save must drive nothing, since the
  // newer one owns the row now.
  const persistAppealDecision = (
    partyRole: AppealDecisionPartyRole,
    patch: AppealDecisionPatch,
  ) =>
    saveAppealDecision({
      // Per case as well as per party: the component outlives a case change
      key: `${workingCase.id}:${partyRole}`,
      // Read before the optimistic update below is applied
      confirmed: caseLevelAppealDecisionRow(
        workingCase.appealDecisions,
        partyRole,
      ),
      value: caseLevelAppealDecisionRow(
        withCaseLevelAppealDecision(
          workingCase.appealDecisions,
          partyRole,
          patch,
        ),
        partyRole,
      ),
      persist: async () =>
        Boolean(
          await updateCaseAppealDecision({
            caseId: workingCase.id,
            partyRole,
            decision: patch.decision,
            announcement: patch.announcement,
          }),
        ),
      rollback: (confirmedRow) =>
        revertAppealDecision(workingCase.id, partyRole, confirmedRow),
    })

  const toPatch = (
    decision?: CaseAppealDecision,
    announcement?: string,
  ): AppealDecisionPatch | undefined =>
    decision !== undefined || announcement !== undefined
      ? {
          ...(decision !== undefined ? { decision } : {}),
          ...(announcement !== undefined ? { announcement } : {}),
        }
      : undefined

  const handleChange = async (update: {
    accusedAppealDecision?: CaseAppealDecision
    accusedAppealAnnouncement?: string
    prosecutorAppealDecision?: CaseAppealDecision
    prosecutorAppealAnnouncement?: string
  }) => {
    const accusedPatch = toPatch(
      update.accusedAppealDecision,
      update.accusedAppealAnnouncement,
    )
    const prosecutorPatch = toPatch(
      update.prosecutorAppealDecision,
      update.prosecutorAppealAnnouncement,
    )

    // Optimistically update the case-level appeal_decision rows the UI reads;
    // the mutation persists them server-side.
    setWorkingCase((prev) => {
      let appealDecisions = prev.appealDecisions

      if (accusedPatch) {
        appealDecisions = withCaseLevelAppealDecision(
          appealDecisions,
          AppealDecisionPartyRole.DEFENDANT,
          accusedPatch,
        )
      }

      if (prosecutorPatch) {
        appealDecisions = withCaseLevelAppealDecision(
          appealDecisions,
          AppealDecisionPartyRole.PROSECUTOR,
          prosecutorPatch,
        )
      }

      return { ...prev, appealDecisions }
    })

    let saved = true

    if (accusedPatch) {
      saved =
        (await persistAppealDecision(
          AppealDecisionPartyRole.DEFENDANT,
          accusedPatch,
        )) && saved
    }

    if (prosecutorPatch) {
      saved =
        (await persistAppealDecision(
          AppealDecisionPartyRole.PROSECUTOR,
          prosecutorPatch,
        )) && saved
    }

    // The parents derive and persist the end-of-session text from the
    // decision, so only tell them once the decision itself is on the server -
    // otherwise a failed save would leave text describing a decision that was
    // rolled back.
    if (saved && onChange) {
      onChange(update)
    }
  }

  return (
    <>
      <SectionHeading
        title={formatMessage(m.titleV2)}
        description={formatMessage(m.disclaimerV2)}
      />
      {lock && (
        <Box marginBottom={3}>
          <AlertMessage
            type="info"
            message={
              lock === 'OUT_OF_COURT'
                ? 'Úrskurðurinn hefur verið kærður utan þinghalds og því er ekki hægt að breyta ákvörðun um kæru.'
                : 'Kæra úrskurðarins er komin til Landsréttar og því er ekki hægt að breyta ákvörðun um kæru.'
            }
          />
        </Box>
      )}
      <div className={stack({ gap: 3 })}>
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
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
              />
            </div>
            <Input
              name="accusedAppealAnnouncement"
              data-testid="accusedAppealAnnouncement"
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
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
              disabled={disabled}
            />
          </div>
          <Box>
            <Input
              name="prosecutorAppealAnnouncement"
              data-testid="prosecutorAppealAnnouncement"
              disabled={disabled}
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
