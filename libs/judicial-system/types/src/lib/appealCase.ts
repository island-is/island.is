import addDays from 'date-fns/addDays'

export enum AppealCaseState {
  APPEALED = 'APPEALED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  WITHDRAWN = 'WITHDRAWN',
}

// Which decision an appeal case challenges. Kæra (RULING) covers everything
// appealed so far: a request case's úrskurður, an indictment dismissed by
// ruling, and a ruling order made while an indictment case runs. Áfrýjun
// (VERDICT) is the appeal of the judgment that concludes an indictment case, and
// travels a different route - the appellant files a declaration with the public
// prosecution office, which brings the case before Landsréttur.
//
// Every case list built so far is about kæra, so an áfrýjun must not surface in
// any of them - an áfrýjun in APPEALED would otherwise appear in the district
// court's "Kærð mál" tab. That is enforced once, by the `appealCase` association
// scope on the Case model, rather than in each list's where options.
export enum AppealCaseType {
  RULING = 'RULING',
  VERDICT = 'VERDICT',
}

export enum AppealCaseTransition {
  RECEIVE_APPEAL = 'RECEIVE_APPEAL',
  COMPLETE_APPEAL = 'COMPLETE_APPEAL',
  REOPEN_APPEAL = 'REOPEN_APPEAL',
  WITHDRAW_APPEAL = 'WITHDRAW_APPEAL',
}

export enum AppealDecisionPartyRole {
  PROSECUTOR = 'PROSECUTOR',
  DEFENDANT = 'DEFENDANT',
  CIVIL_CLAIMANT = 'CIVIL_CLAIMANT',
}

export enum CaseAppealDecision {
  APPEAL = 'APPEAL',
  ACCEPT = 'ACCEPT',
  POSTPONE = 'POSTPONE',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum AppealCaseRulingDecision {
  ACCEPTING = 'ACCEPTING',
  REPEAL = 'REPEAL',
  CHANGED = 'CHANGED',
  CHANGED_SIGNIFICANTLY = 'CHANGED_SIGNIFICANTLY',
  DISMISSED_FROM_COURT_OF_APPEAL = 'DISMISSED_FROM_COURT_OF_APPEAL',
  DISMISSED_FROM_COURT = 'DISMISSED_FROM_COURT',
  REMAND = 'REMAND',
  DISCONTINUED = 'DISCONTINUED',
}

export const getStatementDeadline = (appealReceived: Date): Date => {
  return addDays(appealReceived, 1)
}

// Why an appeal has moved beyond what a court-record correction may touch, or
// null when the record still governs it. Two ways it locks, for different
// reasons:
//   - OUT_OF_COURT: a party filed the appeal itself, so the court record never
//     created it and correcting the record cannot take it away;
//   - PROGRESSED: the appeal has left the district court, so the decisions
//     behind it are already part of the record Landsréttur received.
// While locked, the appeal decisions may not be edited, and the ruling may not
// be removed from the court record. (Swapping the ruling onto another file stays
// allowed at every state - the file belongs to the case rather than the appeal,
// and the appeal moves onto it with everything else.) An in-court appeal that is
// still APPEALED is not locked: the court record created it, so the correction
// paths may re-key or delete it.
//
// The reason is returned rather than a boolean because each caller words its own
// rejection - "this case" vs "this ruling" - and the two causes are not
// interchangeable to the user. Out-of-court is tested first so the message names
// the appeal the court cannot reach at all, even if it has also progressed.
//
// Shared so the backend guards and the UI that disables the same inputs cannot
// drift apart. Callers pass the appeal's state plus whether any party appealed
// out of court: the backend derives that from the APPEALED event log
// (hasOutOfCourtAppeal), the web reads the appealedOutOfCourt field the case
// interceptor derives the same way.
export type AppealCorrectionLock = 'OUT_OF_COURT' | 'PROGRESSED'

export const appealCorrectionLock = (
  appeal:
    | {
        appealState?: AppealCaseState | null
        appealedOutOfCourt?: boolean | null
      }
    | null
    | undefined,
): AppealCorrectionLock | null => {
  if (!appeal) {
    return null
  }

  if (appeal.appealedOutOfCourt) {
    return 'OUT_OF_COURT'
  }

  if (appeal.appealState !== AppealCaseState.APPEALED) {
    return 'PROGRESSED'
  }

  return null
}
