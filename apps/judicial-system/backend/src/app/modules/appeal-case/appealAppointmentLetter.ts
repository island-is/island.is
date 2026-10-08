import {
  AppealAppointmentKind,
  type AppealAppointmentLetter,
  getAppealAppointmentDefendantNames,
  getCourtNameInGenitive,
} from '../../formatters/generatedPdfs/appealAppointmentLetterPdf'
import { Case, CivilClaimant, Defendant, User } from '../repository'
import { latestAdvocateConfirmedEvent } from './appealCase.helpers'

/** How the letter lists someone in its copy line: name, then what they are. */
const withTitle = (name?: string | null, title?: string | null) =>
  name ? [name, title].filter(Boolean).join(' ') : undefined

/**
 * Who is copied on the letter.
 *
 * The prosecution always is. A verdict appeal is prosecuted by the public
 * prosecution office, so until an appeal prosecutor is assigned the reviewer
 * who handled the indictment is the prosecutor in the case, and is who the
 * court writes to.
 *
 * A spokesperson's letter also copies the defenders appointed for the appeal -
 * their client is on the other side of the claim the spokesperson pursues, so
 * they have to know who it is. A defender's letter copies the prosecution
 * alone.
 */
const getCopyRecipients = (
  theCase: Case,
  kind: AppealAppointmentKind,
): string[] => {
  const prosecutor: User | undefined =
    theCase.appealProsecutor ?? theCase.indictmentReviewer

  const recipients = [withTitle(prosecutor?.name, prosecutor?.title)]

  if (kind === AppealAppointmentKind.SPOKESPERSON) {
    recipients.push(
      ...(theCase.defendants ?? [])
        .filter((defendant) => defendant.isAppealDefenderConfirmed)
        .map((defendant) =>
          withTitle(defendant.appealDefenderName, 'lögmaður'),
        ),
    )
  }

  return recipients.filter((recipient): recipient is string =>
    Boolean(recipient),
  )
}

/**
 * Everything the letter of appointment prints, read off the case.
 *
 * Returns undefined when there is no letter to write, which is a state the
 * screen offering it is supposed to prevent but the route cannot assume: no
 * verdict appeal, no advocate confirmed for this party, or no record of the
 * court confirming one. The letter is signed and dated by whoever confirmed
 * the advocate, and the party row keeps neither, so without that event there
 * is nothing to sign.
 *
 * A civil claimant who engaged a lawyer of their own gets no letter either. A
 * réttargæslumaður is appointed by the court; a lögmaður is hired by the
 * claimant, and the court does not appoint what it did not choose.
 */
export const buildAppealAppointmentLetter = (params: {
  theCase: Case
  defendant?: Defendant
  civilClaimant?: CivilClaimant
}): AppealAppointmentLetter | undefined => {
  const { theCase, defendant, civilClaimant } = params

  const appealCase = theCase.verdictAppealCase

  if (!appealCase) {
    return undefined
  }

  let kind: AppealAppointmentKind
  let advocateName: string | undefined

  if (defendant) {
    if (!defendant.isAppealDefenderConfirmed) {
      return undefined
    }

    kind = AppealAppointmentKind.DEFENDER
    advocateName = defendant.appealDefenderName
  } else if (civilClaimant) {
    if (
      !civilClaimant.isAppealSpokespersonConfirmed ||
      civilClaimant.appealSpokespersonIsLawyer
    ) {
      return undefined
    }

    kind = AppealAppointmentKind.SPOKESPERSON
    advocateName = civilClaimant.appealSpokespersonName
  } else {
    return undefined
  }

  if (!advocateName) {
    return undefined
  }

  const confirmation = latestAdvocateConfirmedEvent(appealCase, {
    defendantId: defendant?.id,
    civilClaimantId: civilClaimant?.id,
  })

  if (!confirmation?.userName) {
    return undefined
  }

  return {
    kind,
    advocateName,
    defendantName: getAppealAppointmentDefendantNames(
      (theCase.defendants ?? [])
        .map((d) => d.name)
        .filter((name): name is string => Boolean(name)),
    ),
    courtName: getCourtNameInGenitive(theCase.court?.name),
    courtCaseNumber: theCase.courtCaseNumber ?? '',
    appealCaseNumber: appealCase.appealCaseNumber,
    // Nothing issues an áfrýjunarstefna yet, so the letter says so rather than
    // omitting the sentence that refers to it.
    appealSummonsDate: undefined,
    appointedBy: {
      name: confirmation.userName,
      title: confirmation.userTitle,
    },
    appointedDate: confirmation.created,
    copyTo: getCopyRecipients(theCase, kind),
  }
}
