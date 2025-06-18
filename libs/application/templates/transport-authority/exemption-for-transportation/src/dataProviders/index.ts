import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const ExemptionRulesApi = defineTemplateApi({
  action: 'getExemptionRules',
  externalDataId: 'exemptionRules',
  namespace: 'ExemptionForTransportation',
})
