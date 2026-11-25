import {
  canDefendantAppealVerdict,
  isCompletedCase,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  Defendant,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'

// Whether the public prosecution office may register a verdict appeal for this
// defendant - one that reached it outside the system, by letter or email. The
// same conditions that used to show the office's appeal date picker: a verdict
// the defendant can appeal, not yet appealed, and a defendant still in the
// office's hands. The deadline is deliberately not among them; registering a
// late appeal is allowed and confirmed on the page instead. The backend enforces
// what it can again.
export const canRegisterVerdictAppeal = (
  workingCase: WorkingCase,
  defendant: Defendant,
  user: User | undefined,
): boolean =>
  isPublicProsecutionOfficeUser(user) &&
  isCompletedCase(workingCase.state) &&
  workingCase.indictmentRulingDecision ===
    CaseIndictmentRulingDecision.RULING &&
  canDefendantAppealVerdict(defendant.verdict) &&
  !defendant.verdict?.appealDate &&
  !defendant.isSentToPrisonAdmin &&
  !defendant.isClosedWithoutEnforcement

// Whether the public prosecution office may withdraw the defendant's verdict
// appeal from the card. Only the office: a public prosecution prosecutor
// reaches this card too, once a verdict appeal stands, but the defendant's
// appeal is not theirs to withdraw and the prosecution's own is withdrawn by
// changing the review decision - the backend refuses it through the transition
// route, where it would leave the decision standing at appeal.
//
// An appeal that exists as an appeal case can only be withdrawn on it, and that
// path is closed while verdict appeals are hidden, so the action is not offered
// then rather than offered to fail.
export const canWithdrawVerdictAppeal = (
  workingCase: Pick<WorkingCase, 'verdictAppealCase'>,
  defendant: Defendant,
  user: User | undefined,
  isVerdictAppealRegistrationEnabled: boolean,
): boolean =>
  isPublicProsecutionOfficeUser(user) &&
  Boolean(defendant.verdict?.appealDate) &&
  (isVerdictAppealRegistrationEnabled || !workingCase.verdictAppealCase?.id)

// The deadline runs until the end of its last day, and the appeal date is date
// only, so an appeal on the last day itself is still timely.
export const isAfterVerdictAppealDeadline = (
  defendant: Defendant,
  date: Date,
): boolean => {
  const { verdictAppealDeadline } = defendant

  if (!verdictAppealDeadline) {
    return false
  }

  return date.getTime() > new Date(verdictAppealDeadline).getTime()
}

// The appeal bullet names the defender who filed the appeal when the public
// prosecution office registered it on their letter: the name, marked as the
// defender, in parentheses after the date.
export const withAppealDefender = (
  text: string,
  appealDefenderName?: string | null,
): string =>
  appealDefenderName ? `${text} (${appealDefenderName} verjandi)` : text
