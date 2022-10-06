import { defineTemplateApi } from '@island.is/application/types'

export {
  FamilyInformationProvider,
  UserProfileProvider,
} from '@island.is/application/data-providers'
export { NationalRegistryProvider } from './NationalRegistryProvider'
export { ExistingApplicationProvider } from './ExistingApplicationProvider'
export const DeathNoticeApi = defineTemplateApi({
  action: 'deathNotice',
})
