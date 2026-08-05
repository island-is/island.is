import { defineTemplateApi } from '@island.is/application/types'

export {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const AnonymityStatusApi = defineTemplateApi({
  action: 'getAnonymityStatus',
  externalDataId: 'anonymityStatus',
})
