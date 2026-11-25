// Imported from the module that owns it rather than the formatters barrel:
// the placeholder is a decision about the appeal case number, shared with the
// letter of appointment, and the two must read the same.
import { getAppealCaseNumberOrPlaceholder } from '../../../formatters/generatedPdfs/appealAppointmentLetterPdf'

/**
 * The mail the court of appeals sends an advocate it has just recorded on an
 * appeal - to a defender, to a claimant's réttargæslumaður, and to a
 * claimant's lögmaður, who gets this but no letter of appointment.
 *
 * Shared by the defendant and civil claimant notification services so the
 * three cannot drift apart: they are one message with the role named
 * differently.
 *
 * The court is named outright rather than read off the case. The case's court
 * is the district court that gave the judgment; the court writing here is
 * always the court of appeals.
 */
export const COURT_OF_APPEALS_NAME = 'Landsréttur'

const COURT_NAME = COURT_OF_APPEALS_NAME

/** How the mail names the role it has recorded the advocate in. */
export type AppealAdvocateRole =
  | 'verjanda'
  | 'réttargæslumann einkaréttarkröfuhafa'
  | 'lögmann einkaréttarkröfuhafa'

export const appealAdvocateAssignedSubject = () =>
  `${COURT_NAME} - aðgangur að máli`

/**
 * The sentence that records the advocate, and — when the recipient has a
 * national id and can open the case — a link to the defender indictment
 * overview. Without a link, the base notification service appends its usual
 * portal closing line.
 */
export const appealAdvocateAssignedBody = (
  role: AppealAdvocateRole,
  appealCaseNumber?: string | null,
  caseUrl?: string,
) => {
  const assignment = `${COURT_NAME} hefur skráð þig sem ${role} í máli ${getAppealCaseNumberOrPlaceholder(
    appealCaseNumber,
  )}.`

  if (!caseUrl) {
    return assignment
  }

  return `${assignment}<br/><br/>Hægt er að nálgast gögn málsins á <a href="${caseUrl}">yfirlitssíðu málsins í Réttarvörslugátt</a>.`
}
