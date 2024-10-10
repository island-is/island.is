import { DefaultEvents } from '@island.is/application/types'

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export const B_FULL = 'B-full'
export const B_TEMP = 'B-temp'
export const B_FULL_RENEWAL_65 = 'B-full-renewal-65'
export const B_ADVANCED = 'B-advanced'
export const BE = 'BE'
export const DELIVERY_FEE = 'deliveryFee'

export enum LicenseTypes {
  'B_FULL' = 'B-full',
  'B_TEMP' = 'B-temp',
  'B_FULL_RENEWAL_65' = 'B-full-renewal-65',
  'BE' = 'BE',
  'B_ADVANCED' = 'B-advanced',
}

export enum Pickup {
  'POST' = 'post',
  'DISTRICT' = 'district',
}

export enum AdvancedLicenses {
  'C1' = 'C1',
  'D1' = 'D1',
  'C' = 'C',
  'D' = 'D',
  'C1E' = 'C1E',
  'D1E' = 'D1E',
  'CE' = 'CE',
  'DE' = 'DE',
}

export enum AdvancedSubLicenses {
  'C1A' = 'C1A',
  'D1A' = 'D1A',
  'CA' = 'CA',
  'DA' = 'DA',
}

export type AdvancedLicense = keyof typeof AdvancedLicenses

export const ADVANCED_LICENSES: [string, ...string[]] = [
  AdvancedLicenses.C1,
  AdvancedLicenses.D1,
  AdvancedLicenses.C,
  AdvancedLicenses.D,
  AdvancedLicenses.C1E,
  AdvancedLicenses.D1E,
  AdvancedLicenses.CE,
  AdvancedLicenses.DE,
]

export const ADVANCED_SUB_LICENSES: [string, ...string[]] = [
  AdvancedSubLicenses.C1A,
  AdvancedSubLicenses.D1A,
  AdvancedSubLicenses.CA,
  AdvancedSubLicenses.DA,
]

export const advancedLicenseToSubLicenseMap: Partial<
  Record<Partial<AdvancedLicenses>, Partial<AdvancedSubLicenses>>
> = {
  [AdvancedLicenses.C1]: AdvancedSubLicenses.C1A,
  [AdvancedLicenses.D1]: AdvancedSubLicenses.D1A,
  [AdvancedLicenses.C]: AdvancedSubLicenses.CA,
  [AdvancedLicenses.D]: AdvancedSubLicenses.DA,
}

export const CHARGE_ITEM_CODES: Record<string, string> = {
  [B_TEMP]: 'AY114',
  [B_FULL]: 'AY110',
  [B_FULL_RENEWAL_65]: 'AY113',
  [BE]: 'AY115',
  [DELIVERY_FEE]: 'AY145',
}

export const otherLicenseCategories = ['C', 'C1', 'CE', 'D', 'D1', 'DE']
export const codesRequiringHealthCertificate = ['400', '01.06']
export const codesExtendedLicenseCategories = [
  'C1',
  'C1E',
  'C',
  'CE',
  'D1',
  'D1E',
  'D',
  'DE',
  'Bfar',
  'Far',
  'FAR',
]
export const remarksCannotRenew65 = ['400', '450', '95']

export type DrivingLicenseApplicationFor =
  | typeof B_FULL
  | typeof B_TEMP
  | typeof B_FULL_RENEWAL_65
  | typeof BE

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ABORT }

export enum Roles {
  APPLICANT = 'applicant',
}

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
  PREREQUISITES = 'prerequisites',
}

export const YES = 'yes'
export const NO = 'no'

type FakeCurrentLicense = 'none' | 'temp' | 'full' | 'BE'
type YesOrNo = 'yes' | 'no'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
  currentLicense?: FakeCurrentLicense
  remarks?: YesOrNo
  howManyDaysHaveYouLivedInIceland: string | number
  age: number
}
