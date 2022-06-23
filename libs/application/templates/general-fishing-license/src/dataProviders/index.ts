import {
  ApplicationTemplateAPIAction,
  SharedDataProviders,
} from '@island.is/application/core'
import { ApiActions } from '../shared'

export { SharedDataProviders } from '@island.is/application/core'

export const FishingLicenceDataProviders = {
  generalFishingLicenceProvider: {
    dataProviderType: 'generalFishingLicenceProvider',
    apiModuleAction: ApiActions.getShips,
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
