import { defineTemplateApi } from '@island.is/application/types'

export const OwnerRequirementsApi = defineTemplateApi({
  action: 'ownerRequirements',
})

export const LatestCollectionApi = defineTemplateApi({
  action: 'getLatestCollection',
  externalDataId: 'currentCollection',
})
