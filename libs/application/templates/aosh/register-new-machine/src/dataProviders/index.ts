import { defineTemplateApi } from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const MachineTypesApi = defineTemplateApi({
  action: 'getMachineTypes',
  externalDataId: 'machineTypes',
})

export const MachineParentCategoriesApi = defineTemplateApi({
  action: 'getMachineParentCategories',
  externalDataId: 'machineParentCategories',
})
