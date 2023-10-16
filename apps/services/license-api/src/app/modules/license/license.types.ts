import {
  Pass,
  PassDataInput,
  Result,
  RevokePassData,
} from '@island.is/clients/smartsolutions'

export enum LicenseUpdateType {
  PUSH = 'push',
  PULL = 'pull',
}

export enum LicenseId {
  FIREARM_LICENSE = 'firearm',
  DISABILITY_LICENSE = 'disability',
  DRIVING_LICENSE = 'driving',
}

export type PassTemplateIds = {
  firearm: string
  disability: string
  driving: string
}

export type VerifyLicenseResult = {
  valid: boolean
  passIdentity?: {
    name: string
    nationalId: string
    picture?: string
  }
}

export type ErrorType = 'BadRequest' | 'ServerError'

/**
 * Interface for client services, fetches generic payload and status from a third party API.
 * Only one license per client to start with.
 */
export interface GenericLicenseClient {
  pushUpdate: (
    inputData: PassDataInput,
    nationalId: string,
    requestId?: string,
  ) => Promise<Result<Pass | undefined>>
  pullUpdate: (
    nationalId: string,
    requestId?: string,
  ) => Promise<Result<Pass | undefined>>
  revoke: (
    nationalId: string,
    requestId?: string,
  ) => Promise<Result<RevokePassData>>
  verify: (
    inputData: string,
    requestId?: string,
  ) => Promise<Result<VerifyLicenseResult>>
}

export const CLIENT_FACTORY = 'client-factory'

export const PASS_TEMPLATE_IDS = 'pass-template-ids'
