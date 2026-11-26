import {
  isStoredVerdictAppealRulingPdf,
  isVerdictAppealConfirmed,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  AppealCase,
  CaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  CaseFileCategory,
  VerdictAppealStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { isVerdictAppealConclusionFieldsValid } from '@island.is/judicial-system-web/src/utils/validate'

import { appealRulingDecisionOptions } from '../VerdictAppealStatus/RegisterConclusion.logic'

/**
 * Whether how the appeal ended is shown: the outcome, the Court of Appeals'
 * concluding words and its document. They are shown once the court has marked
 * the appeal "Lokið", and for an appeal it has confirmed. Moving the status
 * away from "Lokið" leaves what was recorded on record, so it is hidden
 * rather than shown for an appeal that has not ended. A confirmed appeal
 * whose status was later moved away from "Lokið" has still ended, and keeps
 * showing it.
 */
export const isVerdictAppealOutcomeShown = (
  appeal:
    | Pick<AppealCase, 'appealType' | 'appealState' | 'verdictAppealStatus'>
    | null
    | undefined,
): boolean =>
  isVerdictAppealConfirmed(appeal) ||
  appeal?.verdictAppealStatus === VerdictAppealStatus.COMPLETED

/** The document the Court of Appeals ended the appeal with. */
export const getVerdictAppealRulingFiles = (
  theCase: Pick<WorkingCase, 'caseFiles'>,
): CaseFile[] =>
  (theCase.caseFiles ?? []).filter(
    (file) => file.category === CaseFileCategory.VERDICT_APPEAL_RULING,
  )

/** The ruling document the appeal can be confirmed with. */
export const getConfirmableVerdictAppealRulingFile = (
  theCase: Pick<WorkingCase, 'caseFiles'>,
): CaseFile | undefined =>
  (theCase.caseFiles ?? []).find(isStoredVerdictAppealRulingPdf)

/** How the appeal ended, in the words the court chose it by. */
export const getVerdictAppealRulingDecisionLabel = (
  appealCase: Pick<AppealCase, 'appealRulingDecision'> | undefined | null,
): string | undefined => {
  const decision = appealCase?.appealRulingDecision

  return decision
    ? appealRulingDecisionOptions.find((option) => option.decision === decision)
        ?.label
    : undefined
}

/**
 * The earliest day the appeal can have ended on: the day of the district
 * court's verdict it appeals, or the day the case was created when the case
 * carries no verdict date.
 */
export const getVerdictAppealRulingDateMinDate = (
  theCase: Pick<WorkingCase, 'rulingDate' | 'created'>,
): Date | undefined => {
  const earliest = theCase.rulingDate ?? theCase.created

  if (!earliest) {
    return undefined
  }

  const minDate = new Date(earliest)
  minDate.setHours(0, 0, 0, 0)

  return Number.isNaN(minDate.getTime()) ? undefined : minDate
}

/**
 * Whether a date can be the day the appeal ended: no later than today and no
 * earlier than the verdict it appeals. A date typed into the picker is not
 * held to the range the calendar offers, and a half-typed one can parse to a
 * year long past, so nothing outside the range is saved. Without a lower
 * bound nothing is.
 */
export const isVerdictAppealRulingDateInRange = (
  date: Date,
  minDate: Date | undefined,
  now: Date = new Date(),
): boolean => {
  if (!minDate || Number.isNaN(date.getTime())) {
    return false
  }

  const endOfToday = new Date(now)
  endOfToday.setHours(23, 59, 59, 999)

  return date >= minDate && date <= endOfToday
}

/**
 * Whether the date picked is the one already on record, in which case there
 * is nothing to save.
 */
export const isSameVerdictAppealRulingDate = (
  stored: string | null | undefined,
  picked: Date,
): boolean => (stored ? new Date(stored).getTime() === picked.getTime() : false)

export type VerdictAppealSummaryStage =
  | 'IN_PROGRESS'
  | 'CONFIRMED'
  | 'COMPLETED'

/**
 * Where the appeal stands for its summary. IN_PROGRESS: the court has not
 * confirmed how it ended, and the page offers to. CONFIRMED: the court has
 * confirmed it (READY_TO_COMPLETE), but the outcome is not released, so the
 * page warns that the parties do not see it. COMPLETED: the outcome is
 * released to everyone who can open the appeal. Past IN_PROGRESS the page
 * shows the appeal as it ended and offers nothing more to do.
 */
export const getVerdictAppealSummaryStage = (
  appealCase: Pick<AppealCase, 'appealType' | 'appealState'> | undefined | null,
): VerdictAppealSummaryStage => {
  if (appealCase?.appealState === AppealCaseState.COMPLETED) {
    return 'COMPLETED'
  }

  return isVerdictAppealConfirmed(appealCase) ? 'CONFIRMED' : 'IN_PROGRESS'
}

/**
 * Whether the public prosecution has sent the appeal to the Court of Appeals:
 * at least one of its summonses carries the date it was sent there. The
 * server only lists sent summonses under sentAppealSummonses; the date is
 * checked as well so the rule does not rest on that alone.
 */
export const isVerdictAppealSentToCourtOfAppeals = (
  appeal: Pick<AppealCase, 'sentAppealSummonses'> | null | undefined,
): boolean =>
  (appeal?.sentAppealSummonses ?? []).some((summons) =>
    Boolean(summons.sentToCourtOfAppealsDate),
  )

/**
 * Whether the court can confirm the appeal as finished: it is still open,
 * it has been sent to the Court of Appeals, the court has marked it "Lokið",
 * and everything the backend asks of a finished appeal is on record - the
 * outcome, its type, the concluding words, the date the appeal ended and the
 * document, stored as a PDF.
 */
export const canConfirmVerdictAppeal = (
  theCase: Pick<WorkingCase, 'verdictAppealCase' | 'caseFiles'>,
): boolean => {
  const appeal = theCase.verdictAppealCase

  return Boolean(
    appeal &&
      appeal.appealState === AppealCaseState.APPEALED &&
      isVerdictAppealSentToCourtOfAppeals(appeal) &&
      appeal.verdictAppealStatus === VerdictAppealStatus.COMPLETED &&
      isVerdictAppealConclusionFieldsValid(appeal) &&
      appeal.appealRulingDate &&
      getConfirmableVerdictAppealRulingFile(theCase),
  )
}

/** The case and the verdict appeal a confirmation on the page is for. */
export interface VerdictAppealConfirmationTarget {
  caseId: string
  appealCaseId: string | undefined
}

export const getVerdictAppealConfirmationTarget = (
  theCase: Pick<WorkingCase, 'id' | 'verdictAppealCase'>,
): VerdictAppealConfirmationTarget => ({
  caseId: theCase.id,
  appealCaseId: theCase.verdictAppealCase?.id,
})

/**
 * Whether a request begun for one appeal still answers for the appeal on the
 * page. The page stays mounted when the user moves to another case or appeal,
 * so a response for the one they left must not act on the one they are at.
 */
export const isSameVerdictAppealConfirmationTarget = (
  started: VerdictAppealConfirmationTarget,
  current: VerdictAppealConfirmationTarget,
): boolean =>
  Boolean(started.appealCaseId) &&
  started.caseId === current.caseId &&
  started.appealCaseId === current.appealCaseId
