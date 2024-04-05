import { defineTemplateApi } from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const MachinesApi = defineTemplateApi({
  action: 'getMachines',
  externalDataId: 'machinesList',
})

export const MustInspectBeforeRegistrationApi = defineTemplateApi({
  action: 'getTypesMustInspectBeforeRegistration',
  externalDataId: 'typesMustInspectBeforeRegistration',
})
