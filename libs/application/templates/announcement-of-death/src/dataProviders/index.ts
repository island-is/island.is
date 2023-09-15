import { defineTemplateApi } from '@island.is/application/types'
export {
  NationalRegistryUserApi,
  UserProfileApi,
  ExistingApplicationApi,
} from '@island.is/application/types'

export const DeathNoticeApi = defineTemplateApi({
  action: 'deathNotice',
})
