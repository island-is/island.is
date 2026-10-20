import { formatDate } from '@island.is/judicial-system/formatters'
import { prosecutionRoles } from '@island.is/judicial-system/types'
import type {
  AppealCase,
  AppealEventLog,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  AppealEventType,
} from '@island.is/judicial-system-web/src/graphql/schema'

import type { VerdictTimelineItem } from './VerdictTimelineBody'

// The web's UserRole is the generated GraphQL enum, not the one the shared list
// is typed with, so the two are compared as the strings they both are - the same
// way isProsecutionUser does it.
const prosecutionRoleNames: string[] = prosecutionRoles

const isProsecutionEvent = (eventLog: AppealEventLog): boolean =>
  Boolean(eventLog.userRole && prosecutionRoleNames.includes(eventLog.userRole))

/**
 * The date the prosecution appealed the verdict regarding one defendant, or
 * undefined when it has not - or withdrew again.
 *
 * A verdict appeal has two independent sides per defendant: the defence side is
 * the defendant appealing, the prosecution side is the public prosecution
 * reviewer appealing the verdict regarding them. Only the prosecution side is
 * read here, and for each side the latest APPEALED / APPEAL_WITHDRAWN event
 * decides, so a withdrawal followed by a fresh appeal counts as standing. This
 * mirrors standingVerdictAppellants in the backend.
 *
 * The event's own timestamp is the appeal date: for the prosecution the review
 * decision is the appeal, so the moment it was registered is when it was filed.
 * A defence appeal, which may be registered long after the letter arrived, has
 * its filing date typed in separately on the verdict.
 */
export const getProsecutionVerdictAppealDate = (
  verdictAppealCase: Pick<AppealCase, 'appealEventLogs'> | null | undefined,
  defendantId: string,
): string | undefined => {
  let latest: AppealEventLog | undefined

  for (const eventLog of verdictAppealCase?.appealEventLogs ?? []) {
    if (
      eventLog.defendantId !== defendantId ||
      !eventLog.created ||
      !isProsecutionEvent(eventLog) ||
      (eventLog.eventType !== AppealEventType.APPEALED &&
        eventLog.eventType !== AppealEventType.APPEAL_WITHDRAWN)
    ) {
      continue
    }

    if (!latest || eventLog.created > (latest.created ?? '')) {
      latest = eventLog
    }
  }

  return latest?.eventType === AppealEventType.APPEALED
    ? latest.created ?? undefined
    : undefined
}

/**
 * The bullet every card shows once the prosecution has appealed a defendant's
 * verdict - the reviewer's own overview, the public prosecution office's and the
 * defence's - so the three tell the same story in the same words.
 */
export const getProsecutionVerdictAppealItem = (
  verdictAppealCase: Pick<AppealCase, 'appealEventLogs'> | null | undefined,
  defendantId: string,
): VerdictTimelineItem | undefined => {
  const appealDate = getProsecutionVerdictAppealDate(
    verdictAppealCase,
    defendantId,
  )

  return appealDate
    ? { text: `Ákæruvaldið áfrýjaði ${formatDate(appealDate)}` }
    : undefined
}

/**
 * Whether the review decision is no longer the reviewer's to change, because
 * the appeal it made has moved on.
 *
 * Mirrors the backend rule in defendant.service: a review decision may only
 * change while the verdict appeal case is APPEALED or WITHDRAWN. Every later
 * state - received by the court of appeals, and completed after it - refuses
 * the change, so the page must not offer it.
 */
export const isVerdictAppealPastReview = (
  verdictAppealCase: Pick<AppealCase, 'appealState'> | null | undefined,
): boolean =>
  Boolean(
    verdictAppealCase &&
      verdictAppealCase.appealState !== AppealCaseState.APPEALED &&
      verdictAppealCase.appealState !== AppealCaseState.WITHDRAWN,
  )
