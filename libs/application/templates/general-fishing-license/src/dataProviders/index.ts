import { ApplicationTemplateAPIAction } from '@island.is/application/core'

export {
  NationalRegistryProvider,
  UserProfileProvider,
} from '@island.is/application/data-providers'
export * from './FeeInfoProvider'
export * from './generalFishingLicenseProvider'

export const FishingLicenceDataProviders = {
  generalFishingLicenceProvider: {
    dataProviderType: 'generalFishingLicenceProvider',
    apiModuleAction: 'getShips',
  },
} as FishingLicenceDataProviders

export interface FishingLicenceDataProviders {
  generalFishingLicenceProvider: ApplicationTemplateAPIAction
}
