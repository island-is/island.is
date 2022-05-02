import { DataProviderTemplateApi } from '@island.is/application/core'

export enum ApiActions {
  createApplication = 'createApplication',
  doStuffThatFails = 'doStuffThatFails',
  completeApplication = 'completeApplication',
  getReferenceData = 'getReferenceData',
  nationalRegistry = 'nationalRegistry.nationalRegistry',
  getAnotherReferenceData = 'getAnotherReferenceData',
}

export const ReferenceApplicationDataProviders = {
  anotherReferenceProvider: {
    apiModuleAction: ApiActions.getAnotherReferenceData,
    externalDataId: 'anotherReference',
    shouldPersistToExternalData: true,
  },
  referenceProvider: {
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
  },
} as ReferenceApplicationDataProviders

export interface ReferenceApplicationDataProviders {
  referenceProvider: DataProviderTemplateApi
  anotherReferenceProvider: DataProviderTemplateApi
}
