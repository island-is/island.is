import { Locale } from '@island.is/shared/types'
import { GenericLicenseError } from './dto/GenericLicenseError.dto'
import { Payload } from './dto/Payload.dto'
import { GenericUserLicense as GenericUserLicenseModel } from './dto/GenericUserLicense.dto'
import { UserAgent } from '@island.is/nest/core'

export interface GenericLicenseMappedPayloadResponse {
  licenseName: string
  payload: Payload
  type: 'user' | 'child'
}

export type LicenseTypeFetchResponse =
  | {
      fetchResponseType: 'error'
      data: GenericLicenseError
    }
  | {
      fetchResponseType: 'licenses'
      data: Array<GenericUserLicenseModel>
    }

export enum GenericLicenseType {
  DriversLicense = 'DriversLicense',
  HuntingLicense = 'HuntingLicense',
  AdrLicense = 'AdrLicense',
  MachineLicense = 'MachineLicense',
  FirearmLicense = 'FirearmLicense',
  DisabilityLicense = 'DisabilityLicense',
  PCard = 'PCard',
  Ehic = 'Ehic',
  Passport = 'Passport',
  IdentityDocument = 'IdentityDocument',
}

export type GenericLicenseTypeType = keyof typeof GenericLicenseType

export enum GenericLicenseProviderId {
  NationalPoliceCommissioner = 'NationalPoliceCommissioner',
  EnvironmentAgency = 'EnvironmentAgency',
  NatureConservationAgency = 'NatureConservationAgency',
  AdministrationOfOccupationalSafetyAndHealth = 'AdministrationOfOccupationalSafetyAndHealth',
  SocialInsuranceAdministration = 'SocialInsuranceAdministration', // Tryggingastofnun
  DistrictCommissioners = 'DistrictCommissioners', // Sýslumenn
  IcelandicHealthInsurance = 'IcelandicHealthInsurance', // Sjúkratryggingar Íslands
  RegistersIceland = 'RegistersIceland', // Þjóðskrá
}

export type GenericLicenseProviderIdType = keyof typeof GenericLicenseProviderId

export enum GenericUserLicenseStatus {
  Unknown = 'Unknown',
  HasLicense = 'HasLicense',
  NotAvailable = 'NotAvailable',
}

export enum GenericUserLicenseFetchStatus {
  Fetched = 'Fetched',
  NotFetched = 'NotFetched',
  Fetching = 'Fetching',
  Error = 'Error',
  Stale = 'Stale',
}

export enum GenericLicenseDataFieldType {
  Group = 'Group',
  Category = 'Category',
  Value = 'Value',
  Table = 'Table',
}

export enum GenericUserLicensePkPassStatus {
  Available = 'Available',
  NotAvailable = 'NotAvailable',
  Unknown = 'Unknown',
}

export enum GenericUserLicenseMetaLinksType {
  External = 'External',
  Download = 'Download',
  Copy = 'Copy',
}

export enum GenericUserLicenseValidity {
  Unknown = 'Unknown',
  Expired = 'Expired',
  Valid = 'Valid',
}

export enum ExpiryStatus {
  EXPIRED,
  EXPIRING,
  ACTIVE,
  UNKNOWN,
}

export enum GenericUserLicenseDataFieldTagType {
  'checkmarkCircle',
  'closeCircle',
}

export enum GenericUserLicenseDataFieldTagColor {
  'green',
  'red',
  'yellow',
}

export enum AlertType {
  WARNING,
  ERROR,
  INFO,
}

export type GenericLicenseMetadata = {
  type: GenericLicenseType
  provider: {
    id: GenericLicenseProviderId
    referenceId?: string
    entryId: string
  }
  pkpass: boolean
  pkpassVerify: boolean
  timeout: number
}

export type GenericLicenseUserdata = {
  status: GenericUserLicenseStatus
  pkpassStatus: GenericUserLicensePkPassStatus
}

export type PkPassVerificationError = {
  /**
   * Generic placeholder for a status code, could be the HTTP status code, code
   * from API, or empty string. Semantics need to be defined per license type
   */
  status: string

  /**
   * Generic placeholder for a status message, from API, or empty "Unknown error".
   * Semantics need to be defined per license type
   */
  message: string

  /**
   * data is used to pass along the error from originator, e.g. SmartSolution
   */
  data?: string
}

export type PkPassVerification = {
  valid: boolean
  data?: string
  error?: PkPassVerificationError
}

export interface GenericLicenseMapper {
  parsePayload: (
    payload: Array<unknown>,
    locale: Locale,
    userAgent?: UserAgent,
  ) => Promise<Array<GenericLicenseMappedPayloadResponse>>
}
