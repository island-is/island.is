import { defineTemplateApi } from '@island.is/application/types'
export {
  NationalRegistryV3UserApi,
  UserProfileApi,
  ExistingApplicationApi,
} from '@island.is/application/types'

export const DeathNoticeApi = defineTemplateApi({
  action: 'deathNotice',
})
