import { defineTemplateApi } from '@island.is/application/types'
export { ExistingApplicationProvider } from './ExistingApplicationProvider'
export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const DeathNoticeApi = defineTemplateApi({
  action: 'deathNotice',
})
