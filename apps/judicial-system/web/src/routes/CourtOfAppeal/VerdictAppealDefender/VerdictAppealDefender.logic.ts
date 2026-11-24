import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  CivilClaimant,
  Defendant,
} from '@island.is/judicial-system-web/src/graphql/schema'
import type { Advocate } from '@island.is/judicial-system-web/src/utils/appealAdvocate'
import {
  getAppealDefender,
  isAppealAdvocateAnswered,
  namesAdvocate,
} from '@island.is/judicial-system-web/src/utils/appealAdvocate'

export type { Advocate }
export { getAppealDefender }

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
    namesAdvocate(appealSpokesperson) ||
    isAppealAdvocateAnswered(civilClaimant.hasAppealSpokesperson)
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
  isAppealAdvocateAnswered(civilClaimant.hasAppealSpokesperson)
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

/**
 * The page's own title line: the appeal's number at this court (design, parent
 * ticket).
 *
 * Nothing records that number yet, so the line is left out rather than shown
 * as "Mál nr." with nothing after it, which reads as a value that failed to
 * load.
 */
export const getVerdictAppealDefenderCaseNumber = (
  theCase: Pick<WorkingCase, 'verdictAppealCase'>,
): string | undefined => {
  const appealCaseNumber = theCase.verdictAppealCase?.appealCaseNumber

  return appealCaseNumber ? `Mál nr. ${appealCaseNumber}` : undefined
}

/**
 * The lines under it: which district court case the appeal came from.
 *
 * Deliberately not the overview's header. That one leads with the district
 * court and says when the appeal reached this court; here the appeal is the
 * case being worked on, so it leads and the district court follows.
 *
 * The design carries a third line naming who appealed and when. Left out until
 * the product owner settles what it should say when several parties appealed:
 * a case carries one appeal per appealing party, and one line cannot name them
 * all.
 */
export const getVerdictAppealDefenderHeaderLines = (
  theCase: Pick<WorkingCase, 'courtCaseNumber'>,
): string[] =>
  theCase.courtCaseNumber
    ? [`Málsnr. héraðsdóms ${theCase.courtCaseNumber}`]
    : []

/**
 * How the two sections are headed: for the party, and in the plural once a
 * case has more than one of them. A réttargæslumaður is a lawyer too, so the
 * claimants' heading does not name the role the court settled on.
 */
export const getDefendantSectionTitle = (count: number): string =>
  count === 1 ? 'Verjandi' : 'Verjendur'

export const getCivilClaimantSectionTitle = (count: number): string =>
  count === 1 ? 'Lögmaður einkaréttarkröfuhafa' : 'Lögmenn einkaréttarkröfuhafa'
