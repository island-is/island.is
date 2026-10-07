import {
  canDefendantAppealVerdict,
  isCompletedCase,
  isPublicProsecutionOfficeUser,
} from '@island.is/judicial-system/types'
import type {
  Case,
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
  workingCase: Case,
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
