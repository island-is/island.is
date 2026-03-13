import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const MachinesApi = defineTemplateApi({
  action: 'getMachines',
  externalDataId: 'machinesList',
})
