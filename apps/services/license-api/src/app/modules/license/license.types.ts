import {
  PassData,
  PassDataInput,
  PassRevocationData,
} from '@island.is/clients/license-client'

export enum LicenseUpdateType {
  PUSH = 'push',
  PULL = 'pull',
}

export enum LicenseApiVersion {
  v1 = 'v1',
  v2 = 'v2',
}

export enum LicenseId {
  FIREARM_LICENSE = 'firearm',
  DISABILITY_LICENSE = 'disability',
  DRIVING_LICENSE = 'driving',
  HUNTING_LICENSE = 'hunting',
}

export type PassTemplateIds = {
  firearm: string
  disability: string
  drivers: string
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
  ) => Promise<PassData | undefined>
  pullUpdate: (nationalId: string) => Promise<PassData | undefined>
  revoke: (nationalId: string) => Promise<PassRevocationData>
  verify: (inputData: string) => Promise<VerifyLicenseResult>
}

export const CLIENT_FACTORY = 'client-factory'

export const PASS_TEMPLATE_IDS = 'pass-template-ids'
