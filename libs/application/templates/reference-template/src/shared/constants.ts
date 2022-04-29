import { DataProviderTemplateApi } from '@island.is/application/core'

export enum ApiActions {
  createApplication = 'createApplication',
  doStuffThatFails = 'doStuffThatFails',
  completeApplication = 'completeApplication',
  getReferenceData = 'getReferenceData',
  nationalRegistry = 'nationalRegistry.nationalRegistry',
  getAnotherReferenceData = 'getAnotherReferenceData',
}

export class ReferenceApplicationProviders {
  public static readonly referenceProvider: DataProviderTemplateApi = {
    apiModuleAction: ApiActions.getReferenceData,
    externalDataId: 'reference',
    shouldPersistToExternalData: true,
    useMockData: false,
    mockData: {
      response: {
        data: {
          stone: 'stones',
        },
      },
      success: true,
    },
  }
  public static readonly anotherReferenceProvider: DataProviderTemplateApi = {
    apiModuleAction: ApiActions.getAnotherReferenceData,
    externalDataId: 'anotherReference',
    shouldPersistToExternalData: true,
  }
}
