import { getUpcomingAppealCourtSessions } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type {
  AppealCourtSession,
  AppealCourtSessionType,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealCaseState } from '@island.is/judicial-system-web/src/graphql/schema'

// The only court of appeals there is. A verdict appeal carries no court of its
// own the way a district court case does.
export const COURT_OF_APPEALS_NAME = 'Landsréttur'

// A booked session with everything a card needs, which the generated type
// cannot promise.
export type ScheduledAppealCourtSession = AppealCourtSession & {
  sessionType: AppealCourtSessionType
  sessionDate: string
}

/**
 * The sessions the parties have on their agenda in the verdict appeal, earliest
 * first: every booked session still ahead, as long as the appeal is open. Once
 * the court of appeals has ruled, or the appeal was withdrawn, nothing is on
 * the agenda whatever the court left in its list.
 */
export const getScheduledAppealCourtSessions = (
  verdictAppealCase: WorkingCase['verdictAppealCase'],
  now: Date = new Date(),
): ScheduledAppealCourtSession[] => {
  if (
    !verdictAppealCase ||
    verdictAppealCase.appealState === AppealCaseState.COMPLETED ||
    verdictAppealCase.appealState === AppealCaseState.WITHDRAWN
  ) {
    return []
  }

  const booked = (verdictAppealCase.courtSessions ?? []).filter(
    (session): session is ScheduledAppealCourtSession =>
      Boolean(session.sessionType && session.sessionDate),
  )

  return getUpcomingAppealCourtSessions(booked, now)
}
