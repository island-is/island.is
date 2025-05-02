import { YesOrNo } from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.REJECT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PAYMENT = 'payment',
  DECLINED = 'declined',
}

export enum Roles {
  APPLICANT = 'applicant',
  ACTOR = 'actor',
}

export const IGNORE = 'IgnoreQualityPhotoAndSignature'

export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export type DrivingLicenseDuplicateFakeData = {
  useFakeData: YesOrNo | 'IgnoreQualityPhotoAndSignature'
  currentLicense: 'none' | 'B-full' | 'B-temp'
  licenseIssuedDate?: string
  hasQualityPhoto: YesOrNo
  hasQualitySignature: YesOrNo
}

export enum Delivery {
  SEND_HOME = 'sendHome',
  PICKUP = 'pickup',
}

export const B_FULL = 'B-full'
export const B_TEMP = 'B-temp'
export const B_FULL_RENEWAL_65 = 'B-full-renewal-65'
export const B_ADVANCED = 'B-advanced'
export const BE = 'BE'
export const DELIVERY_FEE = 'deliveryFee'

export const CHARGE_ITEM_CODES: Record<string, string> = {
  [B_TEMP]: 'AY114',
  [B_FULL]: 'AY110',
  [B_FULL_RENEWAL_65]: 'AY113',
  [BE]: 'AY115',
  [DELIVERY_FEE]: 'AY145',
}

export enum LicenseTypes {
  'B_FULL' = 'B-full',
  'B_TEMP' = 'B-temp',
  'B_FULL_RENEWAL_65' = 'B-full-renewal-65',
  'BE' = 'BE',
  'B_ADVANCED' = 'B-advanced',
}
