import { defineTemplateApi } from '@island.is/application/types'

export const getEligability = defineTemplateApi({
  action: 'getEligability',
  externalDataId: 'eligabilityData',
})
