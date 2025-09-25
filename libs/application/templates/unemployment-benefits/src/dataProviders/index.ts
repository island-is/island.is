import { defineTemplateApi } from '@island.is/application/types'

export const UnemploymentApi = defineTemplateApi({
  action: 'getEmptyApplication',
  externalDataId: 'unemploymentApplication',
})

export const UserProfileApi = defineTemplateApi({
  action: 'userProfile',
  externalDataId: 'userProfile',
  namespace: 'UserProfile',
  params: {
    validateBankInformation: true,
  },
})

export const LocaleApi = defineTemplateApi({
  action: 'getStartingLocale',
  externalDataId: 'startingLocale',
})
