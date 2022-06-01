import { ApplicationTemplateAPIAction } from '@island.is/application/core'
import { ProblemType } from '@island.is/shared/problem'
import { m } from '../lib/messages'

export enum ApiActions {
  createApplication = 'createApplication',
  doStuffThatFails = 'doStuffThatFails',
  completeApplication = 'completeApplication',
  getReferenceData = 'getReferenceData',
  getAnotherReferenceData = 'getAnotherReferenceData',
}

export const ReferenceApplicationDataProviders = {
  anotherReferenceProvider: {
    dataProviderType: 'anotherReferenceProvider',
    apiModuleAction: ApiActions.getAnotherReferenceData,
    externalDataId: 'anotherReference',
    shouldPersistToExternalData: true,
  },
  referenceProvider: {
    dataProviderType: 'referenceProvider',
    apiModuleAction: ApiActions.getReferenceData,
    externalDataId: 'reference',
    //shouldPersistToExternalData: false,
    useMockData: true,
    mockData: {
      error: 'werror',
      problemType: ProblemType.HTTP_NOT_FOUND,
      success: false,
    },
    errorReasons: [
      {
        problemType: ProblemType.HTTP_NOT_FOUND,
        reason: {
          title: m.careerHistory,
          summary: m.draftDescription,
        },
        statusCode: 404,
      },
    ],
  },
} as ReferenceApplicationDataProviders

export interface ReferenceApplicationDataProviders {
  referenceProvider: ApplicationTemplateAPIAction
  anotherReferenceProvider: ApplicationTemplateAPIAction
}
