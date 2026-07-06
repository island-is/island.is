import {
  AppealDecisionPartyRole,
  AppealEventType,
  CaseAppealDecision,
  isDefenceUser,
  isProsecutionUser,
  isRequestCase,
  prosecutionRoles,
  type User,
  UserRole,
} from '@island.is/judicial-system/types'

import {
  AppealCase,
  AppealDecision,
  AppealEventLog,
  Case,
  CivilClaimant,
  Defendant,
} from '../repository'

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

// Every in-court appeal decision for this ruling that belongs to a party the
// user currently, and confirmedly, acts for: the prosecution's decision, or -
// for a defence user - the decision of every defendant / civil claimant they are
// the confirmed representative of. Unlike findUserRulingOrderAppealDecision
// (which resolves a single party) this covers a lawyer with several clients, so
// withdrawal can act on all of them at once, mirroring how an appeal is made for
// all represented parties.
export const userRulingOrderAppealDecisions = (
  theCase: Case,
  rulingFileId: string,
  user: User,
): AppealDecision[] => {
  const decisions = (theCase.appealDecisions ?? []).filter(
    (decision) => decision.rulingFileId === rulingFileId,
  )

  if (isProsecutionUser(user)) {
    return decisions.filter(
      (decision) => decision.partyRole === AppealDecisionPartyRole.PROSECUTOR,
    )
  }

  if (!isDefenceUser(user)) {
    return []
  }

  return decisions.filter((decision) => {
    if (
      decision.partyRole === AppealDecisionPartyRole.DEFENDANT &&
      decision.defendantId
    ) {
      return Defendant.isConfirmedDefenderOfDefendant(
        user.nationalId,
        theCase.defendants?.filter((d) => d.id === decision.defendantId),
      )
    }

    if (
      decision.partyRole === AppealDecisionPartyRole.CIVIL_CLAIMANT &&
      decision.civilClaimantId
    ) {
      return CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(
        user.nationalId,
        theCase.civilClaimants?.filter(
          (c) => c.id === decision.civilClaimantId,
        ),
      )
    }

    return false
  })
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

// True when any party the user acts for appealed this ruling order in court and
// has not yet withdrawn - i.e. the user may withdraw it. Resolves across every
// represented party, so a lawyer with several clients may withdraw as long as at
// least one of them still has a standing in-court appeal.
export const userHasActiveInCourtAppeal = (
  theCase: Case,
  rulingFileId: string,
  user: User,
): boolean =>
  userRulingOrderAppealDecisions(theCase, rulingFileId, user).some(
    (decision) =>
      decision.decision === CaseAppealDecision.APPEAL &&
      !decision.withdrawnDate,
  )

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

// Whether the user is an appellant of this appeal case, read from the APPEALED
// event log rather than the frozen appealed_by_national_id. Authorization keys
// on the *current* representative, so an appeal survives a defender swap:
//   - prosecution: a prosecution-side APPEALED event exists;
//   - indictment defence: the user is the current confirmed defender /
//     spokesperson of a party (defendant / civil claimant) that has an APPEALED
//     event;
//   - request-case defence is collective (no party on the event), so it resolves
//     to the case's *current* registered defender.
// This does not cover in-court ruling-order appeals - their live per-party
// withdrawal state is on the decision row (see userHasActiveInCourtAppeal), which
// the event log only catches up to on session confirmation.
export const userIsAppellant = (
  theCase: Case,
  appealCase: AppealCase,
  user: User,
): boolean => {
  const appealedEvents = (appealCase.appealEventLogs ?? []).filter(
    (eventLog) => eventLog.eventType === AppealEventType.APPEALED,
  )

  if (appealedEvents.length === 0) {
    return false
  }

  if (isProsecutionUser(user)) {
    return appealedEvents.some((eventLog) =>
      prosecutionRoles.includes(eventLog.userRole),
    )
  }

  if (!isDefenceUser(user)) {
    return false
  }

  const defenceAppealed = appealedEvents.some(
    (eventLog) => !prosecutionRoles.includes(eventLog.userRole),
  )

  if (isRequestCase(theCase.type)) {
    // Collective defence: no party on the event, so authorize the case's current
    // registered defender.
    return (
      defenceAppealed &&
      Boolean(theCase.defenderNationalId) &&
      theCase.defenderNationalId === user.nationalId
    )
  }

  // Indictment defence: the user must be the current confirmed representative of
  // a party (defendant / civil claimant) that appealed. Resolving live against
  // the case follows defender / spokesperson reassignment.
  return appealedEvents.some((eventLog) => {
    if (eventLog.defendantId) {
      return Boolean(
        Defendant.isConfirmedDefenderOfDefendant(
          user.nationalId,
          theCase.defendants?.filter((d) => d.id === eventLog.defendantId),
        ),
      )
    }

    if (eventLog.civilClaimantId) {
      return Boolean(
        CivilClaimant.isConfirmedSpokespersonOfCivilClaimant(
          user.nationalId,
          theCase.civilClaimants?.filter(
            (c) => c.id === eventLog.civilClaimantId,
          ),
        ),
      )
    }

    return false
  })
}

// The national ids of the *current* representatives (defender / spokesperson) of
// the defence parties that appealed, taken from the APPEALED event log. Used to
// exclude the appellant from appeal notifications - the same "don't notify who
// just appealed" rule as before, but resolved to the current representative
// rather than a frozen national id, and covering every appellant when several
// parties appealed in court.
export const appellantRepresentativeNationalIds = (
  theCase: Case,
  appealCase: AppealCase,
): Set<string> => {
  const nationalIds = new Set<string>()

  for (const eventLog of appealCase.appealEventLogs ?? []) {
    if (eventLog.eventType !== AppealEventType.APPEALED) {
      continue
    }

    if (eventLog.defendantId) {
      const defendant = theCase.defendants?.find(
        (d) => d.id === eventLog.defendantId,
      )
      if (defendant?.defenderNationalId) {
        nationalIds.add(defendant.defenderNationalId)
      }
    }

    if (eventLog.civilClaimantId) {
      const civilClaimant = theCase.civilClaimants?.find(
        (c) => c.id === eventLog.civilClaimantId,
      )
      if (civilClaimant?.spokespersonNationalId) {
        nationalIds.add(civilClaimant.spokespersonNationalId)
      }
    }
  }

  return nationalIds
}
