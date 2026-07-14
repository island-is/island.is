import {
  AppealDecisionPartyRole,
  AppealEventType,
  CaseAppealDecision,
  isDefenceUser,
  isProsecutionUser,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import { AppealCase, AppealDecision, AppealEventLog, Case } from '../repository'

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

// The party that appealed a ruling in court, as recorded on the APPEALED event:
// the appellant's side (userRole) plus, for the defence, the specific party. The
// side is durable for display; the party (defendantId / civilClaimantId) is the
// durable authorization key that later dereferences to the party's *current*
// defender / spokesperson.
export interface InCourtAppellant {
  appellantRole: UserRole
  defendantId?: string
  civilClaimantId?: string
}

// Maps standing in-court APPEAL decisions to their appellants. Withdrawn
// decisions are skipped - a withdrawn party is no longer an appellant.
export const inCourtAppellantsFromDecisions = (
  decisions: AppealDecision[],
): InCourtAppellant[] =>
  decisions
    .filter((d) => d.decision === CaseAppealDecision.APPEAL && !d.withdrawnDate)
    .map((d) => {
      switch (d.partyRole) {
        case AppealDecisionPartyRole.PROSECUTOR:
          return { appellantRole: UserRole.PROSECUTOR }
        case AppealDecisionPartyRole.DEFENDANT:
          return {
            appellantRole: UserRole.DEFENDER,
            defendantId: d.defendantId,
          }
        case AppealDecisionPartyRole.CIVIL_CLAIMANT:
          return {
            appellantRole: UserRole.DEFENDER,
            civilClaimantId: d.civilClaimantId,
          }
      }
    })

// Builds an APPEALED event-log row for an appeal made in court. Unlike an
// out-of-court appeal - where the actor *is* the appellant - an in-court appeal
// is performed by the party but recorded by the court, so the two are split:
//   - userRole + defendantId / civilClaimantId identify who appealed (the
//     appellant's side and, for the defence, the party);
//   - the actor snapshot (userId / nationalId / name ...) identifies the court
//     user who confirmed the session, for display / audit only.
export const buildInCourtAppealedEvent = (params: {
  theCase: Case
  appealCase: AppealCase
  appellant: InCourtAppellant
  actor: User
}): Partial<AppealEventLog> => {
  const { theCase, appealCase, appellant, actor } = params

  return {
    caseId: theCase.id,
    appealCaseId: appealCase.id,
    eventType: AppealEventType.APPEALED,
    userRole: appellant.appellantRole,
    defendantId: appellant.defendantId,
    civilClaimantId: appellant.civilClaimantId,
    userId: actor.id,
    nationalId: actor.nationalId,
    userName: actor.name,
    userTitle: actor.title,
    institutionName: actor.institution?.name,
  }
}
