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

/**
 * Every booked session with a date, earliest first, the way a calendar reads:
 * the session nearest in time is at the top. The court's list and the
 * parties' card are both logs of what the court has called, so nothing is
 * dropped for being over. Sessions without a usable date are left out - the
 * backend requires one, but the web's generated type does not.
 */
export const sortAppealCourtSessionsByDate = <
  T extends { sessionDate?: Date | string | null },
>(
  sessions: T[] | undefined | null,
): T[] =>
  (sessions ?? [])
    .flatMap((session) => {
      if (!session.sessionDate) {
        return []
      }

      const time = new Date(session.sessionDate).getTime()

      return Number.isNaN(time) ? [] : [{ session, time }]
    })
    .sort((a, b) => a.time - b.time)
    .map(({ session }) => session)
