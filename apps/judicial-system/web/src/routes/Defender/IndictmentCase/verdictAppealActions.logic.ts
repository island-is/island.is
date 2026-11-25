import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import {
  canDefendantAppealVerdict,
  findAppealStatementDeadline,
  hasFiledAppealStatement,
  isCompletedCase,
} from '@island.is/judicial-system/types'
import type { WorkingCase } from '@island.is/judicial-system-web/src/components'
import type {
  Defendant,
  User,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  AppealCaseState,
  CaseIndictmentRulingDecision,
  VerdictAppealDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'

export type VerdictAppealAction = 'APPEAL' | 'ACCEPT' | 'WITHDRAW'

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

// Landsréttur confirmation for this defendant — required to file a verdict-
// appeal greinargerð. Distinct from district confirmation, which is enough to
// appeal or withdraw the appeal itself.
export const isConfirmedAppealDefenderOf = (
  user: User | undefined,
  defendant: Defendant,
): boolean =>
  Boolean(
    defendant.isAppealDefenderConfirmed &&
      !defendant.isAppealDefenderWaived &&
      defendant.appealDefenderNationalId &&
      normalizeAndFormatNationalId(user?.nationalId).includes(
        defendant.appealDefenderNationalId,
      ),
  )

// Whether this defender may file a verdict appeal for this defendant right now. The
// backend enforces every one of these again; this only decides what to offer.
export const canDefenderAppealVerdictOf = (
  workingCase: WorkingCase,
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

// Whether this defender may take back the verdict appeal filed for this defendant.
// verdict.appealDate is the per-defendant mirror the backend sets on appeal and
// clears on withdrawal, and the appeal case is what the withdrawal is filed on.
export const canDefenderWithdrawVerdictAppealOf = (
  workingCase: WorkingCase,
  defendant: Defendant,
  user: User | undefined,
): boolean =>
  isConfirmedDefenderOf(user, defendant) &&
  Boolean(defendant.verdict?.appealDate) &&
  Boolean(workingCase.verdictAppealCase?.id)

// Whether this defender may register that the defendant accepts the verdict:
// whenever they could still appeal it, and it is not accepted already.
export const canDefenderAcceptVerdictOf = (
  workingCase: WorkingCase,
  defendant: Defendant,
  user: User | undefined,
): boolean =>
  canDefenderAppealVerdictOf(workingCase, defendant, user) &&
  defendant.verdict?.appealDecision !== VerdictAppealDecision.ACCEPT

// The actions the defendant's verdict timeline card offers this user, in menu
// order. A filed appeal can only be withdrawn; otherwise the defender may
// appeal, accept, or both. Nothing is offered while the feature is hidden.
// Statement filing is separate (canDefenderFileVerdictStatementOf).
export const getVerdictAppealActions = (
  workingCase: WorkingCase,
  defendant: Defendant,
  user: User | undefined,
  isFeatureEnabled: boolean,
): VerdictAppealAction[] => {
  if (!isFeatureEnabled) {
    return []
  }

  if (canDefenderWithdrawVerdictAppealOf(workingCase, defendant, user)) {
    return ['WITHDRAW']
  }

  const actions: VerdictAppealAction[] = []

  if (canDefenderAppealVerdictOf(workingCase, defendant, user)) {
    actions.push('APPEAL')
  }

  if (canDefenderAcceptVerdictOf(workingCase, defendant, user)) {
    actions.push('ACCEPT')
  }

  return actions
}

// Whether the verdict appeal is still open for defence actions (not completed
// or withdrawn). Shared by statement CTA visibility and timeline card logic.
export const isVerdictAppealOpen = (
  appeal:
    | Pick<NonNullable<WorkingCase['verdictAppealCase']>, 'appealState'>
    | null
    | undefined,
): boolean =>
  Boolean(
    appeal &&
      appeal.appealState !== AppealCaseState.COMPLETED &&
      appeal.appealState !== AppealCaseState.WITHDRAWN,
  )

// Whether this appeal-confirmed defender may upload a greinargerð for this
// defendant on the open verdict appeal. Requires a statement deadline and that
// the party has not already filed.
export const canDefenderFileVerdictStatementOf = (
  workingCase: WorkingCase,
  defendant: Defendant,
  user: User | undefined,
): boolean => {
  const appeal = workingCase.verdictAppealCase

  if (!isVerdictAppealOpen(appeal)) {
    return false
  }

  if (!isConfirmedAppealDefenderOf(user, defendant)) {
    return false
  }

  const party = { defendantId: defendant.id }
  const statementDeadline = findAppealStatementDeadline(
    appeal?.statementDeadlines,
    party,
  )

  if (!statementDeadline?.deadline || statementDeadline.isExpired) {
    return false
  }

  return !hasFiledAppealStatement(appeal?.appealEventLogs, party)
}
