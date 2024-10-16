import { defineTemplateApi } from '@island.is/application/types'

export const CandidateApi = defineTemplateApi({
  action: 'candidate',
  order: 0,
})

export const ParliamentaryCollectionApi = defineTemplateApi({
  action: 'parliamentaryCollection',
  order: 1,
})

export const ParliamentaryIdentityApi = defineTemplateApi({
  action: 'parliamentaryIdentity',
  order: 2,
})
