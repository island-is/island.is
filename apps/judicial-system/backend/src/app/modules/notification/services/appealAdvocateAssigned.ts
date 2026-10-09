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
const COURT_NAME = 'Landsréttur'

/** How the mail names the role it has recorded the advocate in. */
export type AppealAdvocateRole =
  | 'verjanda'
  | 'réttargæslumann einkaréttarkröfuhafa'
  | 'lögmann einkaréttarkröfuhafa'

export const appealAdvocateAssignedSubject = () =>
  `${COURT_NAME} - aðgangur að máli`

/**
 * No link to the case. Being recorded grants no access yet, so a link would
 * lead the advocate to a refusal; the step that opens the case to them is a
 * later one, and the link belongs with it.
 */
export const appealAdvocateAssignedBody = (
  role: AppealAdvocateRole,
  appealCaseNumber?: string | null,
) =>
  `${COURT_NAME} hefur skráð þig sem ${role} í máli ${getAppealCaseNumberOrPlaceholder(
    appealCaseNumber,
  )}.<br /><br />Hægt er að nálgast málið í Réttarvörslugátt.`
