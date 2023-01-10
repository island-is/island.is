import { z } from 'zod'
import {
  Pass,
  Result,
  VerifyPassData,
  VoidPassData,
} from '@island.is/clients/smartsolutions'
import { LicenseUpdateUnion } from './dto'

export enum LicenseUpdateType {
  PUSH = 'push',
  PULL = 'pull',
}

export enum LicenseStatus {
  EXPIRED = 'expired',
  OK = 'ok',
  REVOKED = 'revoked',
  NONE = 'none',
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
  update: (inputData: LicenseUpdateUnion) => Promise<Result<Pass | undefined>>
  revoke: (queryId: string) => Promise<Result<VoidPassData>>
  verify: (inputData: string) => Promise<Result<VerifyPassData>>
}

export const DateSchema = z.preprocess((arg) => {
  if (typeof arg === 'string') return new Date(arg)
}, z.date())

export const CLIENT_FACTORY = 'client-factory'
export { LicenseUpdateUnion }
