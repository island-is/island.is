import type {
  CivilClaimant,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'

export interface Advocate {
  name?: string | null
  nationalId?: string | null
  email?: string | null
  phoneNumber?: string | null
}

/**
 * The defender the court of appeals is shown for a defendant, before it has
 * settled one of its own.
 *
 * Three things can name a defender, in this order of authority:
 *
 * 1. What this court has already recorded on the appeal.
 * 2. What the public prosecution office registered when an appeal arrived by
 *    letter - typically a defender with rights before this court, who is not
 *    the defender of record.
 * 3. The defender of record from the district court.
 *
 * Both of the first two live in the same appeal columns, so they are one case
 * here: whoever wrote them last is who the appeal names. The district court's
 * defender is only ever read, never written back to - who defended there is a
 * fact about that proceeding.
 */
// Whether this court has answered a yes/no question of its own, as opposed to
// not having reached it yet. Both answers count: having said no is a record,
// not an absence.
const isAnswered = (value?: boolean | null): boolean =>
  value !== null && value !== undefined

const namesSomeone = (advocate: Advocate): boolean =>
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

  // The district court's defender is a starting point, and only while this
  // court has recorded no stance of its own. Once it has - named someone, or
  // answered the question of counsel either way - reading through would put a
  // name beside a waiver, and would bring a defender the court had just
  // cleared back onto the screen for it to confirm by accident.
  if (
    namesSomeone(appealDefender) ||
    isAnswered(defendant.appealDefenderWaived)
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

/**
 * The same for a civil claimant, with one source fewer - the office registers
 * an appeal for the defendant, never for a claimant, so it is this court's own
 * record or the district court's.
 */
export const getAppealSpokesperson = (
  civilClaimant: CivilClaimant,
): Advocate => {
  const appealSpokesperson = {
    name: civilClaimant.appealSpokespersonName,
    nationalId: civilClaimant.appealSpokespersonNationalId,
    email: civilClaimant.appealSpokespersonEmail,
    phoneNumber: civilClaimant.appealSpokespersonPhoneNumber,
  }

  // Same rule as for the defendant: hasAppealSpokesperson is this court's
  // answer to whether the claimant is represented at all, so once it is set
  // the appeal speaks for itself.
  if (
    namesSomeone(appealSpokesperson) ||
    isAnswered(civilClaimant.hasAppealSpokesperson)
  ) {
    return appealSpokesperson
  }

  return {
    name: civilClaimant.spokespersonName,
    nationalId: civilClaimant.spokespersonNationalId,
    email: civilClaimant.spokespersonEmail,
    phoneNumber: civilClaimant.spokespersonPhoneNumber,
  }
}

/**
 * Whether the claimant is to be represented at all, and by which kind of
 * advocate. Both fall back to the district court's answer only while this
 * court has given none, so the screen opens on what is known rather than on
 * nothing - and stops reading through the moment the court answers.
 *
 * The distinction matters more here than it does at the district court: a
 * spokesperson is appointed by the court, a lawyer the claimant retains is
 * not, and only the appointed one is given a letter of appointment.
 */
export const getHasAppealSpokesperson = (
  civilClaimant: CivilClaimant,
): boolean =>
  civilClaimant.hasAppealSpokesperson ?? Boolean(civilClaimant.hasSpokesperson)

export const getAppealSpokespersonIsLawyer = (
  civilClaimant: CivilClaimant,
): boolean | null | undefined =>
  isAnswered(civilClaimant.hasAppealSpokesperson)
    ? civilClaimant.appealSpokespersonIsLawyer
    : civilClaimant.appealSpokespersonIsLawyer ??
      civilClaimant.spokespersonIsLawyer

/**
 * Whether every party's advocate has been settled, which is what the step
 * needs before the court moves on.
 *
 * A defendant is settled once confirmed, and a claimant once confirmed or
 * once this court has said they are to have no advocate. Waiving counsel
 * still has to be confirmed - saying so and recording it are two steps, and
 * the letter of appointment hangs off the second.
 */
export const areAllAppealAdvocatesConfirmed = (theCase: {
  defendants?: Defendant[] | null
  civilClaimants?: CivilClaimant[] | null
}): boolean =>
  (theCase.defendants ?? []).every(
    (defendant) => defendant.isAppealDefenderConfirmed,
  ) &&
  (theCase.civilClaimants ?? []).every(
    (civilClaimant) =>
      !getHasAppealSpokesperson(civilClaimant) ||
      civilClaimant.isAppealSpokespersonConfirmed,
  )
