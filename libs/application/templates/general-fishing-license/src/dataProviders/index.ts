import {
  ApplicationTemplateAPIAction,
  SharedDataProviders,
} from '@island.is/application/core'

export {
  NationalRegistryProvider,
  UserProfileProvider,
} from '@island.is/application/data-providers'
export { SharedDataProviders } from '@island.is/application/core'
export * from './FeeInfoProvider'
export * from './generalFishingLicenseProvider'

export const FishingLicenceDataProviders = {
  generalFishingLicenceProvider: {
    dataProviderType: 'generalFishingLicenceProvider',
    apiModuleAction: 'getShips',
    externalDataId: 'directoryOfFisheries',
  },
  nationalRegistryProvider: SharedDataProviders.nationalRegistryProvider,
  paymentCatalogProvider: {
    ...SharedDataProviders.paymentCatalogProvider,
    externalDataId: 'feeInfoProvider',
    params: {
      organizationId: '6608922069',
    },
  },
} as FishingLicenceDataProviders

export interface FishingLicenceDataProviders {
  generalFishingLicenceProvider: ApplicationTemplateAPIAction
  nationalRegistryProvider: ApplicationTemplateAPIAction
  paymentCatalogProvider: ApplicationTemplateAPIAction
}
