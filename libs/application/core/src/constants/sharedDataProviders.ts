import { ProblemType } from '@island.is/shared/problem'
import { Application } from '../types/Application'
import { NationalRegistryUser } from '../types/data-provider-models/NationalRegistryUser'
import { ApplicationTemplateAPIAction } from '../types/StateMachine'
import { PerformActionResult } from '../types/TemplateApiModuleTypes'

export const SharedDataProviders = {
  nationalRegistryProvider: {
    dataProviderType: 'nationalRegistryUserProvider',
    apiModuleAction: 'getUser',
    namespace: 'nationalRegistry',
    mockData: (application: Application): PerformActionResult => {
      return {
        response: {
          nationalId: '123456789',
          age: 12,
          fullName: 'Gervimaður',
          citizenship: {
            code: 'XA',
            name: 'Icelandic',
          },
          address: {
            code: '123',
            lastUpdated: '',
            streetAddress: 'Dúfnahólar 10',
            city: 'Reykjavík',
            postalCode: '111',
          },
        } as NationalRegistryUser,
        success: true,
      }
    },
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
    mockData: (application: Application): PerformActionResult => {
      return {
        response: {
          email: 'mockEmail@island.is',
          mobilePhoneNumber: '9999999',
        },
        success: true,
      }
    },
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
