import { User } from '@island.is/auth-nest-tools'
import { VinnuvelaDto } from '@island.is/clients/adr-and-machine-license'

import { OrorkuSkirteini } from '@island.is/clients/disability-license'
import { DriverLicenseDto } from '@island.is/clients/driving-license'
import { BasicCardInfoDTO } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Staediskortamal } from '@island.is/clients/p-card'
import { Locale } from '@island.is/shared/types'
import { FlattenedAdrDto } from './clients/adr-license-client'
import { FirearmLicenseDto } from './clients/firearm-license-client'
import { DrivingLicenseVerifyExtraData } from './clients/driving-license-client'
import {
  IdentityDocument,
  IdentityDocumentChild,
} from '@island.is/clients/passports'
import { HuntingLicenseDto } from './clients/hunting-license-client'

export type LicenseLabelsObject = {
  [x: string]: string
}

export enum LicenseType {
  FirearmLicense = 'FirearmLicense',
  AdrLicense = 'AdrLicense',
  MachineLicense = 'MachineLicense',
  DisabilityLicense = 'DisabilityLicense',
  DrivingLicense = 'DrivingLicense',
  PCard = 'PCard',
  Ehic = 'Ehic',
  Passport = 'Passport',
  IdentityDocument = 'IdentityDocument',
  HuntingLicense = 'HuntingLicense',
}

export interface LicenseResults {
  [LicenseType.AdrLicense]: FlattenedAdrDto
  [LicenseType.DisabilityLicense]: OrorkuSkirteini
  [LicenseType.DrivingLicense]: DriverLicenseDto
  [LicenseType.HuntingLicense]: HuntingLicenseDto
  [LicenseType.Ehic]: BasicCardInfoDTO
  [LicenseType.FirearmLicense]: FirearmLicenseDto
  [LicenseType.MachineLicense]: VinnuvelaDto
  [LicenseType.PCard]: Staediskortamal
  [LicenseType.Passport]: IdentityDocument | IdentityDocumentChild
  [LicenseType.IdentityDocument]: IdentityDocument | IdentityDocumentChild
}

export interface VerifyExtraDataResult {
  [LicenseType.AdrLicense]: void
  [LicenseType.DisabilityLicense]: void
  [LicenseType.DrivingLicense]: DrivingLicenseVerifyExtraData
  [LicenseType.HuntingLicense]: void
  [LicenseType.Ehic]: void
  [LicenseType.FirearmLicense]: void
  [LicenseType.MachineLicense]: void
  [LicenseType.PCard]: void
  [LicenseType.Passport]: void
  [LicenseType.IdentityDocument]: void
}

export type PkPassVerificationData = {
  [LicenseType.AdrLicense]: void
  [LicenseType.DisabilityLicense]: void
  [LicenseType.DrivingLicense]: DrivingLicenseVerifyExtraData
  [LicenseType.HuntingLicense]: void
  [LicenseType.Ehic]: void
  [LicenseType.FirearmLicense]: void
  [LicenseType.MachineLicense]: void
  [LicenseType.PCard]: void
  [LicenseType.Passport]: void
  [LicenseType.IdentityDocument]: void
}

export type LicenseResult<T extends LicenseType> = T extends LicenseType
  ? LicenseResults[T]
  : never

export type LicenseVerifyExtraDataResult<T extends LicenseType> =
  T extends LicenseType ? VerifyExtraDataResult[T] : never

export type PkPassVerificationDataResult<T extends LicenseType> =
  T extends LicenseType ? PkPassVerificationData[T] : never

export type LicenseTypeType = keyof typeof LicenseType

export enum LicensePkPassAvailability {
  Available = 'Available',
  NotAvailable = 'NotAvailable',
  Unknown = 'Unknown',
}

export type PassTemplateIds = {
  firearmLicense: string
  adrLicense: string
  machineLicense: string
  disabilityLicense: string
  drivingLicense: string
  huntingLicense: string
}

export type WithValid<Data> = {
  valid: boolean
  data?: Data
}

export type PkPassVerification = {
  valid: boolean
  data?: string
}

export type VerifyPkPassResult<Type extends LicenseType> = {
  valid: boolean
  data?: PkPassVerificationDataResult<Type>
}

export type PkPassVerificationInputData = {
  code: string
  date: string
}

export type VerifyInputData = {
  code: string
  date: string
  passTemplateName?: string
  passTemplateId?: string
}

export type PassVerificationData = {
  valid: boolean
  passIdentity?: {
    name: string
    nationalId: string
    picture?: string
  }
}

export type PassData = {
  distributionUrl: string
  deliveryPageUrl: string
  distributionQRCode: string
  id: string
  expirationDate?: string
  whenCreated: string
  whenModified: string
  inputFieldValues?: Array<{
    id: string
    identifier: string
    value?: string
  }>
}

export type PassRevocationData = {
  success: boolean
}

export type PassDataInput = {
  expirationDate?: string
  expirationDateWithoutTime?: string
  expirationTime?: string
  passTemplateId?: string
  id?: string
  inputFieldValues?: Array<{
    id?: string
    identifier?: string
    passInputFieldId?: string
    value?: string
  }>
  thumbnail?: {
    description?: string
    filename?: string
    height?: number
    id?: string
    imageBase64String?: string
    originalUrl?: string
    title?: string
    url?: string
    width?: number
  }
  validFrom?: string
}

export type Result<ResultType, ErrorType = ServiceError> =
  | {
      ok: true
      data: ResultType
    }
  | {
      ok: false
      error: ErrorType
    }

export interface ServiceError {
  /** Custom error code pertaining to the external service, or http status */
  code: number
  /** Custom message */
  message?: string
  /** Optional data */
  data?: string
}

/** SERVICE CODES 10+ *
 *  HTTP CODES 100+ */
export type ServiceErrorCode =
  /** Pass unavailable for pkpass generation */
  | 2
  /** No license info found */
  | 3
  /** Request contains some field errors */
  | 4
  /** Invalid pass */
  | 5
  /** Driving license pkPass generation failed */
  | 6
  /** Missing PassTemplateId */
  | 10
  /** Fetch failed */
  | 11
  /** JSON parse failed */
  | 12
  /** Service error */
  | 13
  /** Incomplete service response */
  | 14
  /** Request contains some field errors */
  | 15
  /** Generic error code / Unknown */
  | 99

export interface LicenseClient<Type extends LicenseType> {
  type: LicenseType
  clientSupportsPkPass: boolean
  getLicenses: (user: User) => Promise<Result<Array<LicenseResult<Type>>>>
  licenseIsValidForPkPass?: (
    payload: unknown,
    user?: User,
  ) => Promise<LicensePkPassAvailability>
  getPkPassUrl?: (
    user: User,
    locale?: Locale,
    version?: 'v1' | 'v2',
  ) => Promise<Result<string>>
  getPkPassQRCode?: (
    user: User,
    locale?: Locale,
    version?: 'v1' | 'v2',
  ) => Promise<Result<string>>
  verifyPkPassDeprecated?: (data: string) => Promise<Result<PkPassVerification>>
  verifyPkPass?: (
    data: string,
    version?: 'v1' | 'v2',
  ) => Promise<Result<VerifyPkPassResult<Type>>>
  verifyExtraData?: (input: User) => Promise<LicenseVerifyExtraDataResult<Type>>
}

export const LICENSE_CLIENT_FACTORY = 'license-client-factory'
export const LICENSE_UPDATE_CLIENT_FACTORY = 'license-client-factory'
export const LICENSE_UPDATE_CLIENT_FACTORY_V2 = 'license-client-factory-v2'
export const CONFIG_PROVIDER = 'config_provider'
