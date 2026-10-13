import { formatDate } from '@island.is/judicial-system/formatters'
import { getProsecutionVerdictAppealDate } from '@island.is/judicial-system-web/src/components/Cards/VerdictTimelineCard/prosecutionVerdictAppeal.logic'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type { ReactSelectOption } from '@island.is/judicial-system-web/src/types'

/**
 * Where the Court of Appeals stands with a verdict appeal.
 *
 * Frontend only for now: nothing is written anywhere, and the values below
 * exist so the screen has something to hold. When the backend learns about
 * the status these move to `@island.is/judicial-system/types` and the
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
 * The sessions the Court of Appeals holds in a verdict appeal.
 *
 * Its own list rather than the district court's `CourtSessionType`: the court
 * of appeals holds three kinds of session and names the last one differently
 * (dómsuppkvaðning, not dómsuppsaga). Frontend only, like the status above.
 */
export enum AppealCourtSessionType {
  MAIN_HEARING = 'MAIN_HEARING',
  PREPARATORY_HEARING = 'PREPARATORY_HEARING',
  VERDICT = 'VERDICT',
}

export const appealCourtSessionTypeLabels: Record<
  AppealCourtSessionType,
  string
> = {
  [AppealCourtSessionType.MAIN_HEARING]: 'Aðalmeðferð',
  [AppealCourtSessionType.PREPARATORY_HEARING]: 'Undirbúningsþinghald',
  [AppealCourtSessionType.VERDICT]: 'Dómsuppkvaðning',
}

export const appealCourtSessionTypeOptions: ReactSelectOption[] = Object.values(
  AppealCourtSessionType,
).map((type) => ({
  label: appealCourtSessionTypeLabels[type],
  value: type,
}))

/**
 * One session, as the form holds it. Every field is optional because the
 * form fills them one at a time; `isAppealCourtSessionComplete` says when
 * all of them are in.
 */
export interface AppealCourtSession {
  type?: AppealCourtSessionType
  date?: Date
  courtRoom?: string
}

export const isAppealCourtSessionComplete = (
  session: AppealCourtSession,
): boolean => Boolean(session.type && session.date && session.courtRoom?.trim())

/**
 * The lines under the page title: the court's own case number, the district
 * court's, and who appealed when.
 *
 * The case number of the appeal is the first line and the largest, because it
 * is how the court refers to the case from here on. It is left out while the
 * court has not assigned one - the step that does is not built yet.
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
