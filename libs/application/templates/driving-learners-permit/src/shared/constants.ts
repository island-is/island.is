export enum ApiActions {
  createApplication = 'createApplication',
  doStuffThatFails = 'doStuffThatFails',
  completeApplication = 'completeApplication',
}

export enum FakeDataFeature {
  allowFake = 'applicationTemplateDrivingLearnersPermitAllowFakeData',
}

export const B_FULL = 'B-full'
export const B_TEMP = 'B-temp'

export type DrivingLicenseApplicationFor = typeof B_FULL | typeof B_TEMP
