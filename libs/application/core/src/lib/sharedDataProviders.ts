import { Application } from '../types/Application'
import { ApplicationTemplateAPIAction } from '../types/StateMachine'
import { PerformActionResult } from '../types/TemplateApiModuleTypes'

export class SharedDataProviders {
  public static readonly NationalRegistryProvider: ApplicationTemplateAPIAction = {
    apiModuleAction: 'nationalRegistry.nationalRegistry',
    externalDataId: 'nationalRegistry',
    shouldPersistToExternalData: true,
    throwOnError: true,
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
