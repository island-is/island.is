import { defineTemplateApi, UserProfileApi } from '@island.is/application/types'

export { IdentityApi } from '@island.is/application/types'

export const LicensesApi = defineTemplateApi({
  action: 'getLicenses',
  externalDataId: 'licenses',
})

export const RegistrationNumberPrefixApi = defineTemplateApi({
  action: 'getSubCategories',
  externalDataId: 'subCategories',
})

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
  },
})
