import { defineTemplateApi } from '@island.is/application/types'

export const CandidateApi = defineTemplateApi({
  action: 'candidate',
  order: 0,
})

export const MunicipalCollectionApi = defineTemplateApi({
  action: 'municipalCollection',
  order: 1,
})

export const IsDelegatedToCompanyApi = defineTemplateApi({
  action: 'delegatedToCompany',
})
