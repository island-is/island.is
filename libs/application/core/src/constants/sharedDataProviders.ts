import { ProblemType } from '@island.is/shared/problem'
import { Application } from '../types/Application'
import { ApplicationTemplateAPIAction } from '../types/StateMachine'
import { PerformActionResult } from '../types/TemplateApiModuleTypes'

export const SharedDataProviders = {
  nationalRegistryProvider: {
    dataProviderType: 'nationalRegistryProvider',
    apiModuleAction: 'nationalRegistry',
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
        },
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
  nationalRegistryUserProvider: {
    apiModuleAction: 'nationalRegistryUser',
    namespace: 'nationalRegistry',
    externalDataId: 'nationalRegistryUser',
    shouldPersistToExternalData: true,
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
} as AvailableSharedDataProviders

export interface AvailableSharedDataProviders {
  nationalRegistryProvider: ApplicationTemplateAPIAction
  userProfileProvider: ApplicationTemplateAPIAction
}
