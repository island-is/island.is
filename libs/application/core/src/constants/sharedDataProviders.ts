import { Application } from '../types/Application'
import { ApplicationTemplateAPIAction } from '../types/StateMachine'
import { PerformActionResult } from '../types/TemplateApiModuleTypes'

export const SharedDataProviders = {
  nationalRegistryProvider: {
    dataProviderType: 'nationalRegistryProvider',
    apiModuleAction: 'nationalRegistry',
    namespace: 'nationalRegistry',
    shouldPersistToExternalData: true,
    throwOnError: true,
    useMockData: false,
    mockData: (application: Application): PerformActionResult => {
      return {
        response: {
          names: {
            rolling: 'stones',
          },
        },
        success: true,
      }
    },
  },
  nationalRegistryUserProvider: {
    apiModuleAction: 'nationalRegistryUser',
    namespace: 'nationalRegistry',
    externalDataId: 'nationalRegistryUser',
    shouldPersistToExternalData: true,
  },
} as AvailableSharedDataProviders

export interface AvailableSharedDataProviders {
  nationalRegistryProvider: ApplicationTemplateAPIAction
  nationalRegistryUserProvider: ApplicationTemplateAPIAction
  userProfileProvider: ApplicationTemplateAPIAction
  familyInformationProvider: ApplicationTemplateAPIAction
}
