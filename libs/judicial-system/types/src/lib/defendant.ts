export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum DefenderChoice {
  WAIVE = 'WAIVE', // Waive right to counsel
  CHOOSE = 'CHOOSE', // Choose defender
  DELAY = 'DELAY', // Delay choice
  DELEGATE = 'DELEGATE', // Delegate choice to judge
}

export enum SubpoenaType {
  ABSENCE = 'ABSENCE',
  ARREST = 'ARREST',
}

export enum DefendantPlea {
  GUILTY = 'GUILTY',
  NOT_GUILTY = 'NOT_GUILTY',
  NO_PLEA = 'NO_PLEA',
}

export enum ServiceRequirement {
  REQUIRED = 'REQUIRED', // Ruling must be served
  NOT_REQUIRED = 'NOT_REQUIRED', // Ruling does not need to be served
  NOT_APPLICABLE = 'NOT_APPLICABLE', // Defendant was present in court
}

export enum ServiceStatus {
  ELECTRONICALLY = 'ELECTRONICALLY', // Via digital mailbox on island.is
  DEFENDER = 'DEFENDER', // Via a person's defender
  IN_PERSON = 'IN_PERSON',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED', // If a subpoena expires
  NOT_APPLICABLE = 'NOT_APPLICABLE', // Note: ONLY used for old verdicts prior to delivering verdicts automatically to the police
}

export enum PunishmentType {
  IMPRISONMENT = 'IMPRISONMENT',
  PROBATION = 'PROBATION',
  FINE = 'FINE',
  INDICTMENT_RULING_DECISION_FINE = 'INDICTMENT_RULING_DECISION_FINE',
  SIGNED_FINE_INVITATION = 'SIGNED_FINE_INVITATION',
  OTHER = 'OTHER',
}

// We could possibly also have an APPEAL option here if we want,
// but we can also see from the verdict appeal date if the verdict
// has been appealed
export enum VerdictAppealDecision {
  ACCEPT = 'ACCEPT', // Una
  POSTPONE = 'POSTPONE', // Taka áfrýjunarfrest
}

export enum InformationForDefendant {
  INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES = 'INSTRUCTIONS_ON_REOPENING_OUT_OF_COURT_CASES',
  INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS = 'INFORMATION_ON_APPEAL_TO_COURT_OF_APPEALS',
  CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION = 'CONDITIONAL_SENTENCE_AND_BREACH_OF_PROBATION_TRANSLATION',
  DRIVING_RIGHTS_REVOKED_TRANSLATION = 'DRIVING_RIGHTS_REVOKED_TRANSLATION',
  ALTERNATIVE_FINES_TRANSLATION = 'ALTERNATIVE_FINES_TRANSLATION',
  COMMUNITY_SERVICE = 'COMMUNITY_SERVICE',
  FINES_AND_COSTS = 'FINES_AND_COSTS',
  ITEM_CONFISCATION = 'ITEM_CONFISCATION',
}

export const successfulServiceStatus: string[] = [
  ServiceStatus.ELECTRONICALLY,
  ServiceStatus.DEFENDER,
  ServiceStatus.IN_PERSON,
]

export const isSuccessfulServiceStatus = (
  status?: ServiceStatus | null,
): boolean => {
  return Boolean(status && successfulServiceStatus.includes(status))
}

export const isFailedServiceStatus = (status?: ServiceStatus): boolean => {
  return Boolean(status && status === ServiceStatus.FAILED)
}
