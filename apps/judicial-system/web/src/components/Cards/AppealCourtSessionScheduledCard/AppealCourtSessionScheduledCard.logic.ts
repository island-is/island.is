import { getScheduledAppealCourtSessions as getSharedScheduledAppealCourtSessions } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type {
  AppealCourtSession,
  AppealCourtSessionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

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
 * first - the shared rule, over the sessions the generated type lets through
 * with their type and date missing.
 */
export const getScheduledAppealCourtSessions = (
  verdictAppealCase: WorkingCase['verdictAppealCase'],
  now: Date = new Date(),
): ScheduledAppealCourtSession[] => {
  if (!verdictAppealCase) {
    return []
  }

  const booked = (verdictAppealCase.courtSessions ?? []).filter(
    (session): session is ScheduledAppealCourtSession =>
      Boolean(session.sessionType && session.sessionDate),
  )

  return getSharedScheduledAppealCourtSessions(
    { appealState: verdictAppealCase.appealState, courtSessions: booked },
    now,
  )
}
