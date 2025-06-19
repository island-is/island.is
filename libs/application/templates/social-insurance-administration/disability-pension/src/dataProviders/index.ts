import { defineTemplateApi } from '@island.is/application/types'

export {
  UserProfileApi,
  NationalRegistryUserApi,
  NationalRegistrySpouseApi
} from '@island.is/application/types'

export const NationalRegistryBirthplaceApi = defineTemplateApi({
  action: 'getBirthplace',
  externalDataId: 'nationalRegistryBirthplace',
  namespace: 'NationalRegistry',
})
