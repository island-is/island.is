import { UserProfileApi } from '@island.is/application/types'

export const UserProfileApiWithValidation = UserProfileApi.configure({
  params: {
    validatePhoneNumberIfNotActor: true,
    validateEmailIfNotActor: true,
    validateBankInformation: true,
  },
})
