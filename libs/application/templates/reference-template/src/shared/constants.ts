import { ApplicationTemplateAPIAction } from '@island.is/application/core'

export enum ApiActions {
  createApplication = 'createApplication',
  doStuffThatFails = 'doStuffThatFails',
  completeApplication = 'completeApplication',
  getReferenceData = 'getReferenceData',
  nationalRegistry = 'nationalRegistry.nationalRegistry',
  getAnotherReferenceData = 'getAnotherReferenceData',
}

export class Providers {
  public static readonly referenceProvider: ApplicationTemplateAPIAction = {
    apiModuleAction: ApiActions.getReferenceData,
    externalDataId: 'reference',
    shouldPersistToExternalData: true,
    useMockData: true,
    mockData: {
      response: {
        data: {
          stone: 'stones',
        },
      },
      success: true,
    },
  }
  public static readonly anotherReferenceProvider: ApplicationTemplateAPIAction = {
    apiModuleAction: ApiActions.getAnotherReferenceData,
    externalDataId: 'anotherReference',
    shouldPersistToExternalData: true,
  }
}
