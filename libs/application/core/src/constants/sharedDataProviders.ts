import { ProblemType } from '@island.is/shared/problem'
import { ApplicationTemplateAPIAction } from '@island.is/application/types'

export const SharedDataProviders = {
  nationalRegistryProvider: {
    apiModuleAction: 'getUser',
    externalDataId: 'nationalRegistry',
    namespace: 'nationalRegistry',
  },
  familyRelationsProvider: {
    apiModuleAction: 'getFamily',
    namespace: 'nationalRegistry',
  },
  userProfileProvider: {
    apiModuleAction: 'getUserProfile',
    namespace: 'userProfile',
  },
  paymentCatalogProvider: {
    apiModuleAction: 'paymentCatalog',
    namespace: 'paymentCatalog',
  },
} as AvailableSharedDataProviders

export interface AvailableSharedDataProviders {
  nationalRegistryProvider: ApplicationTemplateAPIAction
  userProfileProvider: ApplicationTemplateAPIAction
  familyRelationsProvider: ApplicationTemplateAPIAction
  /**
   * Available params
   * params: {
   *  organizationId: 'xxxxxxxxxx',
   * }
   *  */
  paymentCatalogProvider: ApplicationTemplateAPIAction
}
