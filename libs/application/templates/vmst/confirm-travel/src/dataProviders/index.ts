import { defineTemplateApi } from '@island.is/application/types'

export const getEligibility = defineTemplateApi({
  action: 'getEligibility',
  externalDataId: 'eligibilityData',
})
