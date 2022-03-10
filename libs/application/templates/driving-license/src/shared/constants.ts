export enum ApiActions {
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
}

export const B_FULL = 'B-full'
export const B_TEMP = 'B-temp'

export type DrivingLicenseApplicationFor = typeof B_FULL | typeof B_TEMP
