import type { Defendant } from '@island.is/judicial-system-web/src/graphql/schema'

export interface Advocate {
  name?: string | null
  nationalId?: string | null
  email?: string | null
  phoneNumber?: string | null
}

/**
 * The defender shown for a defendant on an appeal proceeding, before the
 * court of appeals has settled one of its own.
 *
 * Three things can name a defender, in this order of authority:
 *
 * 1. What the court of appeals has already recorded on the appeal.
 * 2. What the public prosecution office registered when an appeal arrived by
 *    letter - typically a defender with rights before that court, who is not
 *    the defender of record.
 * 3. The defender of record from the district court.
 *
 * Both of the first two live in the same appeal columns, so they are one case
 * here: whoever wrote them last is who the appeal names. The district court's
 * defender is only ever read, never written back to - who defended there is a
 * fact about that proceeding.
 */
// Whether the appeal court has answered a yes/no question of its own, as
// opposed to not having reached it yet. Both answers count: having said no is
// a record, not an absence.
export const isAppealAdvocateAnswered = (value?: boolean | null): boolean =>
  value !== null && value !== undefined

export const namesAdvocate = (advocate: Advocate): boolean =>
  Boolean(
    advocate.name ||
      advocate.nationalId ||
      advocate.email ||
      advocate.phoneNumber,
  )

export const getAppealDefender = (defendant: Defendant): Advocate => {
  const appealDefender = {
    name: defendant.appealDefenderName,
    nationalId: defendant.appealDefenderNationalId,
    email: defendant.appealDefenderEmail,
    phoneNumber: defendant.appealDefenderPhoneNumber,
  }

  // The district court's defender is a starting point, and only while the
  // appeal has recorded no stance of its own. Once it has - named someone, or
  // answered the question of counsel either way - reading through would put a
  // name beside a waiver, and would bring a defender the court had just
  // cleared back onto the screen for it to confirm by accident.
  if (
    namesAdvocate(appealDefender) ||
    isAppealAdvocateAnswered(defendant.isAppealDefenderWaived)
  ) {
    return appealDefender
  }

  return {
    name: defendant.defenderName,
    nationalId: defendant.defenderNationalId,
    email: defendant.defenderEmail,
    phoneNumber: defendant.defenderPhoneNumber,
  }
}
