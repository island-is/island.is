import { ProblemType } from '@island.is/shared/problem'
import { ApplicationTemplateAPIAction } from '@island.is/application/types'

export const SharedDataProviders = {
  nationalRegistryProvider: {
    dataProviderType: 'nationalRegistryUserProvider',
    apiModuleAction: 'getUser',
    externalDataId: 'nationalRegistry',
    namespace: 'nationalRegistry',
    errorReasons: [
      {
        problemType: ProblemType.HTTP_NOT_FOUND,
        reason: {
          title: 'Internal Server Error',
          summary: 'Something went wrong in a bad bad way',
        },
        statusCode: 404,
      },
    ],
  },
  familyRelationsProvider: {
    apiModuleAction: 'getFamily',
    namespace: 'nationalRegistry',
    dataProviderType: 'nationalRegistryFamilyProvider',
  },
  userProfileProvider: {
    apiModuleAction: 'getUserProfile',
    namespace: 'userProfile',
    dataProviderType: 'userProfileProvider',
  },
  paymentCatalogProvider: {
    apiModuleAction: 'paymentCatalog',
    namespace: 'paymentCatalog',
    dataProviderType: 'paymentCatalogProvider',
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
