import { defineTemplateApi } from '@island.is/application/types'

export { UserProfileProvider } from '@island.is/application/data-providers'

export const ChildrenResidentChangeNationalRegistryApi = defineTemplateApi({
  action: 'nationalRegistry',
})
