import {
  Pass,
  PassDataInput,
  Result,
  VerifyPassData,
  VoidPassData,
} from '@island.is/clients/smartsolutions'

export enum LicenseUpdateType {
  PUSH = 'push',
  PULL = 'pull',
}

export enum LicenseId {
  FIREARM_LICENSE = 'FirearmLicense',
  DISABILITY_LICENSE = 'DisabilityLicense',
}
/**
 * Interface for client services, fetches generic payload and status from a third party API.
 * Only one license per client to start with.
 */
export interface GenericLicenseClient {
  update: (
    inputData: PassDataInput,
    nationalId: string,
  ) => Promise<Result<Pass | undefined>>
  revoke: (queryId: string) => Promise<Result<VoidPassData>>
  verify: (inputData: string) => Promise<Result<VerifyPassData>>
}

export const CLIENT_FACTORY = 'client-factory'
