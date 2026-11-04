import { AppealCaseState } from './appealCase'

// The sessions the court of appeals calls in a verdict appeal. Its own list
// rather than the district court's CourtSessionType: the court of appeals holds
// three kinds of session and names the last one differently (dómsuppkvaðning,
// not dómsuppsaga).
export enum AppealCourtSessionType {
  MAIN_HEARING = 'MAIN_HEARING',
  PREPARATORY_HEARING = 'PREPARATORY_HEARING',
  VERDICT = 'VERDICT',
}

// A plain object rather than a Record over the enum, like courtSessionTypeNames,
// so the web can index it with its generated GraphQL enum as well.
export const appealCourtSessionTypeNames = {
  MAIN_HEARING: 'Aðalmeðferð',
  PREPARATORY_HEARING: 'Undirbúningsþinghald',
  VERDICT: 'Dómsuppkvaðning',
}

// Each session with a usable date, earliest first. Sessions without a date
// are left out - the backend requires one, but the web's generated type does
// not.
const byDate = <T extends { sessionDate?: Date | string | null }>(
  sessions: T[] | undefined | null,
): { session: T; time: number }[] =>
  (sessions ?? [])
    .flatMap((session) => {
      if (!session.sessionDate) {
        return []
      }

      const time = new Date(session.sessionDate).getTime()

      return Number.isNaN(time) ? [] : [{ session, time }]
    })
    .sort((a, b) => a.time - b.time)

/**
 * Every booked session with a date, earliest first. The parties' card is a
 * log of what the court has called, so nothing is dropped for being over.
 */
export const sortAppealCourtSessionsByDate = <
  T extends { sessionDate?: Date | string | null },
>(
  sessions: T[] | undefined | null,
): T[] => byDate(sessions).map(({ session }) => session)

/**
 * The booked sessions still ahead, earliest first.
 *
 * A session stays ahead through its day rather than falling off at its
 * minute: the parties look the case up on the morning of the hearing.
 */
export const getUpcomingAppealCourtSessions = <
  T extends { sessionDate?: Date | string | null },
>(
  sessions: T[] | undefined | null,
  now: Date = new Date(),
): T[] => {
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime()

  return byDate(sessions)
    .filter(({ time }) => time >= startOfToday)
    .map(({ session }) => session)
}

/**
 * The sessions still to come in a verdict appeal: every booked session ahead,
 * as long as the appeal is open. Once the court of appeals has ruled, or the
 * appeal was withdrawn, nothing is next whatever the court left in its list.
 *
 * The state is read as a string so the web could pass its generated enum.
 */
export const getScheduledAppealCourtSessions = <
  T extends { sessionDate?: Date | string | null },
>(
  appeal:
    | { appealState?: string | null; courtSessions?: T[] | null }
    | undefined
    | null,
  now: Date = new Date(),
): T[] => {
  if (
    !appeal ||
    appeal.appealState === AppealCaseState.COMPLETED ||
    appeal.appealState === AppealCaseState.WITHDRAWN
  ) {
    return []
  }

  return getUpcomingAppealCourtSessions(appeal.courtSessions, now)
}
