import {
  AppealDecisionPartyRole,
  CaseAppealDecision,
  isDefenceUser,
  isProsecutionUser,
  type User,
} from '@island.is/judicial-system/types'

import { AppealDecision, Case } from '../repository'

// Resolves the appeal decision (Ákvörðun um kæru) recorded in court for the
// party the user acts for - the prosecution, or the specific defendant / civil
// claimant the defence user is the confirmed representative of. Used to decide
// what a user may do with an in-court ruling-order appeal (withdraw it, or - for
// the ACCEPT rule - whether it waived its appeal right).
export const findUserRulingOrderAppealDecision = (
  theCase: Case,
  rulingFileId: string,
  user: User,
): AppealDecision | undefined => {
  let partyRole: AppealDecisionPartyRole
  let defendantId: string | undefined
  let civilClaimantId: string | undefined

  if (isProsecutionUser(user)) {
    partyRole = AppealDecisionPartyRole.PROSECUTOR
  } else if (isDefenceUser(user)) {
    const defendant = theCase.defendants?.find(
      (d) =>
        d.isDefenderChoiceConfirmed &&
        d.defenderNationalId &&
        d.defenderNationalId === user.nationalId,
    )
    const civilClaimant = theCase.civilClaimants?.find(
      (c) =>
        c.isSpokespersonConfirmed &&
        c.spokespersonNationalId &&
        c.spokespersonNationalId === user.nationalId,
    )

    if (defendant) {
      partyRole = AppealDecisionPartyRole.DEFENDANT
      defendantId = defendant.id
    } else if (civilClaimant) {
      partyRole = AppealDecisionPartyRole.CIVIL_CLAIMANT
      civilClaimantId = civilClaimant.id
    } else {
      return undefined
    }
  } else {
    return undefined
  }

  return theCase.appealDecisions?.find(
    (appealDecision) =>
      appealDecision.rulingFileId === rulingFileId &&
      appealDecision.partyRole === partyRole &&
      (appealDecision.defendantId ?? null) === (defendantId ?? null) &&
      (appealDecision.civilClaimantId ?? null) === (civilClaimantId ?? null),
  )
}

// True when the ruling order was appealed in court - i.e. some party recorded a
// decision = APPEAL for it. Distinguishes in-court appeals (withdrawn per party)
// from out-of-court ones (a single appellant on the appeal case).
export const isInCourtRulingOrderAppeal = (
  theCase: Case,
  rulingFileId: string,
): boolean =>
  Boolean(
    theCase.appealDecisions?.some(
      (appealDecision) =>
        appealDecision.rulingFileId === rulingFileId &&
        appealDecision.decision === CaseAppealDecision.APPEAL,
    ),
  )

// True when the user's party appealed this ruling order in court and has not yet
// withdrawn - i.e. the user may withdraw it.
export const userHasActiveInCourtAppeal = (
  theCase: Case,
  rulingFileId: string,
  user: User,
): boolean => {
  const decision = findUserRulingOrderAppealDecision(
    theCase,
    rulingFileId,
    user,
  )

  return (
    decision?.decision === CaseAppealDecision.APPEAL && !decision.withdrawnDate
  )
}
