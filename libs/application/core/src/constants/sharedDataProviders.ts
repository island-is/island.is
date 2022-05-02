import { Application } from '../types/Application'
import { DataProviderTemplateApi } from '../types/StateMachine'
import { PerformActionResult } from '../types/TemplateApiModuleTypes'

export const SharedDataProviders = {
  nationalRegistryProvider: {
    apiModuleAction: 'nationalRegistry.nationalRegistry',
    externalDataId: 'nationalRegistry',
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
} as AvailableSharedDataProviders

export interface AvailableSharedDataProviders {
  nationalRegistryProvider: DataProviderTemplateApi
  userProfileProvider: DataProviderTemplateApi
  familyInformationProvider: DataProviderTemplateApi
}
