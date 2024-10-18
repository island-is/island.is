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
  REQUIRED = 'REQUIRED',
  NOT_REQUIRED = 'NOT_REQUIRED',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export enum ServiceStatus {
  ELECTRONICALLY = 'ELECTRONICALLY', // Via digital mailbox on island.is
  DEFENDER = 'DEFENDER', // Via a person's defender
  IN_PERSON = 'IN_PERSON',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED', // If a subpoena expires
}

export const successfulServiceStatus: string[] = [
  ServiceStatus.ELECTRONICALLY,
  ServiceStatus.DEFENDER,
  ServiceStatus.IN_PERSON,
]

export const isSuccessfulServiceStatus = (status?: ServiceStatus): boolean => {
  return Boolean(status && successfulServiceStatus.includes(status))
}

export const isFailedServiceStatus = (status?: ServiceStatus): boolean => {
  return Boolean(status && status === ServiceStatus.FAILED)
}
