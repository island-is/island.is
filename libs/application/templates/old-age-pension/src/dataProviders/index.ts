import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  NationalRegistrySpouseApi,
} from '@island.is/application/types'

export const NationalRegistryResidenceHistoryApi = defineTemplateApi({
  action: 'getResidenceHistory',
  externalDataId: 'nationalRegistryResidenceHistory',
  namespace: 'NationalRegistry',
})
