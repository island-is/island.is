import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const ApplicationRulesApi = defineTemplateApi({
  action: 'getApplicationRules',
  externalDataId: 'applicationRules',
  namespace: 'ExemptionForTransportation',
})
