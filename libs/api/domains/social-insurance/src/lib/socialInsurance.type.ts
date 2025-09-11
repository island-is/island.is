export enum IncomePlanStatus {
  ACCEPTED,
  CANCELLED,
  IN_PROGRESS,
  UNKNOWN,
}

export const LOG_CATEGORY = 'api-domains-social-insurance-service'

export interface GenericKeyValueObjectBase {
  label: string
  needsFurtherInformation?: boolean
}

export interface GenericKeyValueNumberObject extends GenericKeyValueObjectBase {
  value: number
}

export interface GenericKeyValueStringObject extends GenericKeyValueObjectBase {
  value: string
}
