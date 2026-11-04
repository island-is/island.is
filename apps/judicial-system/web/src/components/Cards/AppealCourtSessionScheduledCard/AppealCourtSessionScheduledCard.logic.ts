import { sortAppealCourtSessionsByDate } from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import type {
  AppealCourtSession,
  AppealCourtSessionType,
} from '@island.is/judicial-system-web/src/graphql/schema'

// The only court of appeals there is. A verdict appeal carries no court of its
// own the way a district court case does.
export const COURT_OF_APPEALS_NAME = 'Landsréttur'

// A booked session with everything the card needs, which the generated type
// cannot promise.
export type BookedAppealCourtSession = AppealCourtSession & {
  sessionType: AppealCourtSessionType
  sessionDate: string
}

/**
 * Every session the court of appeals has called in the verdict appeal, earliest
 * first. The card is a log of what was called: a session that has been held
 * stays on it, and so does one booked in an appeal since completed or
 * withdrawn.
 */
export const getBookedAppealCourtSessions = (
  verdictAppealCase: WorkingCase['verdictAppealCase'],
): BookedAppealCourtSession[] =>
  sortAppealCourtSessionsByDate(
    (verdictAppealCase?.courtSessions ?? []).filter(
      (session): session is BookedAppealCourtSession =>
        Boolean(session.sessionType && session.sessionDate),
    ),
  )
