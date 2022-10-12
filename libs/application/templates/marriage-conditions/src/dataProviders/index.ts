import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
  DistrictsApi,
} from '@island.is/application/types'

export const MaritalStatusApi = defineTemplateApi({
  action: 'maritalStatus',
})
