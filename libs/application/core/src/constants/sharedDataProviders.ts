import { Application } from '../types/Application'
import { DataProviderTemplateApi } from '../types/StateMachine'
import { PerformActionResult } from '../types/TemplateApiModuleTypes'

export class SharedDataProviders {
  public static readonly NationalRegistryProvider: DataProviderTemplateApi = {
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
  }
}
