import { defineTemplateApi, UserProfileApi } from '@island.is/application/types'

export { IdentityApi } from '@island.is/application/types'

export const MachinesApi = defineTemplateApi({
  action: 'getMachines',
  externalDataId: 'machinesList',
})

export const InspectionUserProfileApi = UserProfileApi.configure({
  params: {
    validateEmail: true,
    validateEmailIfNotActor: true,
    validatePhoneNumber: true,
    validatePhoneNumberIfNotActor: true,
  },
  externalDataId: 'userProfile',
})
