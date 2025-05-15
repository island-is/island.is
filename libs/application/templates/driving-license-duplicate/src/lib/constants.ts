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
