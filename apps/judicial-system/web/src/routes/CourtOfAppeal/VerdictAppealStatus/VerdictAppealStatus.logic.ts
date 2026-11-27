import { formatDate } from '@island.is/judicial-system/formatters'
import { appealCourtSessionTypeNames } from '@island.is/judicial-system/types'
import { getProsecutionVerdictAppealDate } from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/prosecutionVerdictAppeal.logic'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import {
  AppealCaseState,
  AppealCourtSessionType,
  VerdictAppealStatus,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { ReactSelectOption } from '@island.is/judicial-system-web/src/types'
import { applyAppealCaseUpdate } from '@island.is/judicial-system-web/src/utils/utils'

// Where the Court of Appeals stands with a verdict appeal, as the court words
// each status on its own page.
export const verdictAppealStatusLabels: Record<VerdictAppealStatus, string> = {
  [VerdictAppealStatus.STATEMENT_DEADLINE_GRANTED]: 'Veita greinargerðafrest',
  [VerdictAppealStatus.COURT_SESSION_SCHEDULED]: 'Boða til þinghalds',
  [VerdictAppealStatus.POSTPONED]: 'Frestun',
  [VerdictAppealStatus.UNDER_ADVISEMENT]: 'Dómtekið',
  [VerdictAppealStatus.COMPLETED]: 'Lokið',
}

// In the order the court reads them, which is the order of the design.
export const verdictAppealStatuses: VerdictAppealStatus[] = [
  VerdictAppealStatus.STATEMENT_DEADLINE_GRANTED,
  VerdictAppealStatus.COURT_SESSION_SCHEDULED,
  VerdictAppealStatus.POSTPONED,
  VerdictAppealStatus.UNDER_ADVISEMENT,
  VerdictAppealStatus.COMPLETED,
]

/**
 * The status the page opens on: the one the court saved, and for an appeal
 * that has none yet, calling a session when one is already booked - the
 * sessions were kept before the status was.
 */
export const getInitialVerdictAppealStatus = (
  verdictAppealCase?: {
    verdictAppealStatus?: VerdictAppealStatus | null
    courtSessions?: unknown[] | null
  } | null,
): VerdictAppealStatus | undefined =>
  verdictAppealCase?.verdictAppealStatus ??
  ((verdictAppealCase?.courtSessions ?? []).length > 0
    ? VerdictAppealStatus.COURT_SESSION_SCHEDULED
    : undefined)

/**
 * The type options the session form offers, in the order the court reads
 * them.
 */
export const appealCourtSessionTypeOptions: ReactSelectOption[] = Object.values(
  AppealCourtSessionType,
).map((type) => ({
  label: appealCourtSessionTypeNames[type],
  value: type,
}))

/**
 * One session, as the form holds it. Every field is optional because the
 * form fills them one at a time; `isAppealCourtSessionComplete` says when
 * all of them are in. The field names are the saved session's, so the two
 * read alike.
 */
export interface AppealCourtSessionDraft {
  sessionType?: AppealCourtSessionType
  sessionDate?: Date
  // Whether the date and time fields hold a complete value. The last complete
  // `sessionDate` is kept while the court corrects or clears the time, so
  // that the picker does not lose the day, and so the date alone cannot say
  // the field is filled in.
  isSessionDateValid?: boolean
  courtRoom?: string
}

export const isAppealCourtSessionComplete = (
  session: AppealCourtSessionDraft,
): boolean =>
  Boolean(
    session.sessionType &&
      session.sessionDate &&
      session.isSessionDateValid !== false &&
      session.courtRoom?.trim(),
  )

// Untouched, as opposed to half filled: the court can move on past an empty
// form once a session is booked, but not past one it has started on.
export const isAppealCourtSessionEmpty = (
  session: AppealCourtSessionDraft,
): boolean =>
  !session.sessionType && !session.sessionDate && !session.courtRoom?.trim()

/**
 * A booked session as the form holds it, so the court can change it in place.
 * The saved date is an ISO string; the picker wants a Date.
 */
export const toAppealCourtSessionDraft = (session: {
  sessionType?: AppealCourtSessionType | null
  sessionDate?: string | null
  courtRoom?: string | null
}): AppealCourtSessionDraft => ({
  sessionType: session.sessionType ?? undefined,
  sessionDate: session.sessionDate ? new Date(session.sessionDate) : undefined,
  courtRoom: session.courtRoom ?? undefined,
})

/**
 * The line under a booked session's type: `12.12.2026 kl. 14:00 · Dómsalur 1`.
 */
export const formatAppealCourtSessionDetails = (session: {
  sessionDate?: Date | string | null
  courtRoom?: string | null
}): string => {
  const parts: string[] = []

  if (session.sessionDate) {
    parts.push(`${formatDate(session.sessionDate, "dd.MM.yyyy 'kl.' HH:mm")}`)
  }

  if (session.courtRoom?.trim()) {
    parts.push(`Dómsalur ${session.courtRoom.trim()}`)
  }

  return parts.join(' · ')
}

/**
 * The lines under the page title: the district court's case number and who
 * appealed when.
 *
 * Who appealed is read per defendant, the same way the verdict timeline card
 * reads it: the defendant's own appeal is dated on their verdict, the
 * prosecution's on the appeal's event log. Both can stand at once, and a case
 * with two defendants can carry two lines that say the same thing, so lines
 * are deduplicated rather than repeated.
 */
export const getVerdictAppealStatusHeaderLines = (
  theCase: Pick<
    WorkingCase,
    'courtCaseNumber' | 'defendants' | 'verdictAppealCase'
  >,
): string[] => {
  const lines: string[] = []

  if (theCase.courtCaseNumber) {
    lines.push(`Málsnr. héraðsdóms ${theCase.courtCaseNumber}`)
  }

  for (const defendant of theCase.defendants ?? []) {
    const defendantAppealDate = defendant.verdict?.appealDate

    if (defendantAppealDate) {
      lines.push(`Dómfelldi áfrýjaði ${formatDate(defendantAppealDate, 'PPP')}`)
    }

    const prosecutionAppealDate = getProsecutionVerdictAppealDate(
      theCase.verdictAppealCase,
      defendant.id,
    )

    if (prosecutionAppealDate) {
      lines.push(
        `Ákæruvaldið áfrýjaði ${formatDate(prosecutionAppealDate, 'PPP')}`,
      )
    }
  }

  return Array.from(new Set(lines))
}

/**
 * The working case with the state a save on the appeal returned. Changing how
 * a confirmed appeal ended takes it back in the same request, and the response
 * says so; the working case follows without a refetch, so the summary asks for
 * confirmation again. Only the state is written: the values the save sent are
 * already in the working case, and a later edit may have moved past them.
 *
 * The pages that save outlive a case change, so a response for a case the
 * court has left changes nothing, and nor does one that carries no state.
 */
export const withReturnedAppealState = (
  workingCase: WorkingCase,
  caseId: string,
  appealCaseId: string,
  appealState: AppealCaseState | null | undefined,
): WorkingCase =>
  workingCase.id === caseId && appealState
    ? applyAppealCaseUpdate(workingCase, appealCaseId, { appealState })
    : workingCase

/**
 * The working case once the ruling document has been uploaded or removed. The
 * court confirmed the appeal with the document it had then, so the backend
 * takes a confirmed appeal back when a new one is stored or the old one
 * removed. Neither request returns the appeal, so the working case follows
 * here: a confirmed verdict appeal goes back to APPEALED, and an appeal in any
 * other state is left as it is.
 */
export const withRulingDocumentChanged = (
  workingCase: WorkingCase,
): WorkingCase => {
  const verdictAppealCase = workingCase.verdictAppealCase

  if (verdictAppealCase?.appealState !== AppealCaseState.READY_TO_COMPLETE) {
    return workingCase
  }

  return {
    ...workingCase,
    verdictAppealCase: {
      ...verdictAppealCase,
      appealState: AppealCaseState.APPEALED,
    },
  }
}
