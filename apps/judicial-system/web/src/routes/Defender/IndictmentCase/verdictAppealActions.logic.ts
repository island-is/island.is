import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  canDefendantAppealVerdict,
  isCompletedCase,
} from '@island.is/judicial-system/types'
import type {
  Case,
  Defendant,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseIndictmentRulingDecision } from '@island.is/judicial-system-web/src/graphql/schema'

export type VerdictAppealAction = 'APPEAL' | 'WITHDRAW'

// A defender acts on the verdict of one specific defendant, and only one they
// have been confirmed as the defender of. This is the same test the backend
// applies (Defendant.isConfirmedDefenderOfDefendant).
export const isConfirmedDefenderOf = (
  user: User | undefined,
  defendant: Defendant,
): boolean =>
  Boolean(
    defendant.isDefenderChoiceConfirmed &&
      defendant.defenderNationalId &&
      normalizeAndFormatNationalId(user?.nationalId).includes(
        defendant.defenderNationalId,
      ),
  )

// Whether this defender may file an áfrýjun for this defendant right now. The
// backend enforces every one of these again; this only decides what to offer.
export const canDefenderAppealVerdictOf = (
  workingCase: Case,
  defendant: Defendant,
  user: User | undefined,
): boolean =>
  isConfirmedDefenderOf(user, defendant) &&
  isCompletedCase(workingCase.state) &&
  workingCase.indictmentRulingDecision ===
    CaseIndictmentRulingDecision.RULING &&
  canDefendantAppealVerdict(defendant.verdict) &&
  !defendant.isVerdictAppealDeadlineExpired &&
  !defendant.verdict?.appealDate

// Whether this defender may take back the áfrýjun filed for this defendant.
// verdict.appealDate is the per-defendant mirror the backend sets on appeal and
// clears on withdrawal, and the appeal case is what the withdrawal is filed on.
export const canDefenderWithdrawVerdictAppealOf = (
  workingCase: Case,
  defendant: Defendant,
  user: User | undefined,
): boolean =>
  isConfirmedDefenderOf(user, defendant) &&
  Boolean(defendant.verdict?.appealDate) &&
  Boolean(workingCase.verdictAppealCase?.id)

// The single action the defendant's verdict timeline card offers this user, if
// any. Nothing is offered while the feature is hidden.
export const getVerdictAppealAction = (
  workingCase: Case,
  defendant: Defendant,
  user: User | undefined,
  isFeatureEnabled: boolean,
): VerdictAppealAction | undefined => {
  if (!isFeatureEnabled) {
    return undefined
  }

  if (canDefenderWithdrawVerdictAppealOf(workingCase, defendant, user)) {
    return 'WITHDRAW'
  }

  if (canDefenderAppealVerdictOf(workingCase, defendant, user)) {
    return 'APPEAL'
  }

  return undefined
}
