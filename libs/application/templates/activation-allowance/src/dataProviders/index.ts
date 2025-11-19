import { defineTemplateApi, UserProfileApi } from '@island.is/application/types'

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
  },
})

export const ActivationAllowanceApi = defineTemplateApi({
  action: 'createApplication',
  externalDataId: 'activityGrantApplication',
})

export const LocaleApi = defineTemplateApi({
  action: 'getStartingLocale',
  externalDataId: 'startingLocale',
})
