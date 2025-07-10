import { defineTemplateApi, UserProfileApi } from '@island.is/application/types'

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
    validateBankInformation: true,
  },
})

export const WorkMachineLicensesApi = defineTemplateApi({
  action: 'getWorkMachineLicenses',
  externalDataId: 'workMachineLicenses',
})

export const DrivingLicenseApi = defineTemplateApi({
  action: 'getDrivingLicense',
  externalDataId: 'drivingLicense',
})

export const ActivationAllowanceApi = defineTemplateApi({
  action: 'createApplication',
  externalDataId: 'activityGrantApplication',
})

export const LocaleApi = defineTemplateApi({
  action: 'getStartingLocale',
  externalDataId: 'startingLocale',
})
