import { formatDate } from '@island.is/judicial-system/formatters'
import { appealCourtSessionTypeNames } from '@island.is/judicial-system/types'
import { getProsecutionVerdictAppealDate } from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/prosecutionVerdictAppeal.logic'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import { AppealCourtSessionType } from '@island.is/judicial-system-web/src/graphql/schema'
import type { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

/**
 * Where the Court of Appeals stands with a verdict appeal.
 *
 * Frontend only for now: the status is not saved anywhere, and the values
 * below exist so the screen has something to hold. When the backend learns
 * about the status these move to `@island.is/judicial-system/types` and the
 * generated GraphQL enum takes their place.
 */
export enum VerdictAppealStatus {
  STATEMENT_DEADLINE_GRANTED = 'STATEMENT_DEADLINE_GRANTED',
  COURT_SESSION_SCHEDULED = 'COURT_SESSION_SCHEDULED',
  POSTPONED = 'POSTPONED',
  UNDER_ADVISEMENT = 'UNDER_ADVISEMENT',
  COMPLETED = 'COMPLETED',
}

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
  courtRoom?: string
}

export const isAppealCourtSessionComplete = (
  session: AppealCourtSessionDraft,
): boolean =>
  Boolean(
    session.sessionType && session.sessionDate && session.courtRoom?.trim(),
  )

// Untouched, as opposed to half filled: the court can move on past an empty
// form once a session is booked, but not past one it has started on.
export const isAppealCourtSessionEmpty = (
  session: AppealCourtSessionDraft,
): boolean =>
  !session.sessionType && !session.sessionDate && !session.courtRoom?.trim()

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
