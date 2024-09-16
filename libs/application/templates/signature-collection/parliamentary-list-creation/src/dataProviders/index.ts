import { defineTemplateApi } from '@island.is/application/types'

export const CandidateApi = defineTemplateApi({
  action: 'candidate',
})

export const ParliamentaryCollectionApi = defineTemplateApi({
  action: 'parliamentaryCollection',
})

export const ParliamentaryIdentityApi = defineTemplateApi({
  action: 'parliamentaryIdentity',
})
