export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export const B_FULL = 'B-full'
export const B_TEMP = 'B-temp'
export const B_RENEW = 'B-renew'
export const NONE = 'none'

export type DrivingLicenseApplicationFor =
  | typeof B_FULL
  | typeof B_TEMP
  | typeof B_RENEW
  | typeof NONE
