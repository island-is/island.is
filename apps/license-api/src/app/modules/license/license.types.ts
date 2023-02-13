import {
  Pass,
  PassDataInput,
  Result,
  RevokePassData,
  VerifyPassData,
} from '@island.is/clients/smartsolutions'

export enum LicenseUpdateType {
  PUSH = 'push',
  PULL = 'pull',
}

export enum LicenseId {
  FIREARM_LICENSE = 'firearm',
  DISABILITY_LICENSE = 'disability',
}

export type PassTemplateIds = {
  firearm: string
  disability: string
}

/**
 * Interface for client services, fetches generic payload and status from a third party API.
 * Only one license per client to start with.
 */
export interface GenericLicenseClient {
  pushUpdate: (
    inputData: PassDataInput,
    nationalId: string,
  ) => Promise<Result<Pass | undefined>>
  pullUpdate: (nationalId: string) => Promise<Result<Pass | undefined>>
  revoke: (nationalId: string) => Promise<Result<RevokePassData>>
  verify: (inputData: string) => Promise<Result<VerifyPassData>>
}

export const PASS_TEMPLATE_IDS = 'pass-template-ids'
