import addDays from 'date-fns/addDays'

export enum AppealCaseState {
  APPEALED = 'APPEALED',
  RECEIVED = 'RECEIVED',
  COMPLETED = 'COMPLETED',
  WITHDRAWN = 'WITHDRAWN',
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
