import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const AnonymityStatusApi = defineTemplateApi({
  action: 'getAnonymityStatus',
  externalDataId: 'anonymityStatus',
})
