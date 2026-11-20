export enum IncomePlanStatus {
  ACCEPTED,
  CANCELLED,
  IN_PROGRESS,
  UNKNOWN,
}

export const LOG_CATEGORY = 'api-domains-social-insurance-service'

/**
 * What the socialInsuranceGeneral query hands down to its field resolvers,
 * so they can send the application id to SÍ without taking it as an arg.
 */
export interface GeneralParent {
  applicationId?: string
}

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
