import { SharedDataProviders } from '@island.is/application/core'
import {
  ApplicationTemplateAPIAction,
  NationalRegistryUser,
  PerformActionResult,
} from '@island.is/application/types'
import { ProblemType } from '@island.is/shared/problem'
import { m } from '../lib/messages'
import { ApiActions } from '../shared/constants'

export const ReferenceApplicationDataProviders = {
  nationalRegistryProvider: {
    ...SharedDataProviders.nationalRegistryProvider,
    errorReasonHandler: (data: PerformActionResult) => {
      if (data.success) {
        const s = data.response as NationalRegistryUser

        if (s.age < 18) {
          return {
            reason: {
              summary:
                'Þú hefur ekki náð 18 ára aldri. Vinsamlegast hinkrið í nokkur ár.',
              title: 'Þessi umsókn er ekki við hæfi ungra barna',
            },
            problemType: ProblemType.VALIDATION_FAILED,
            statusCode: 400,
          }
        }
      }
    },
    order: 3,
  },
  userProfileProvider: SharedDataProviders.userProfileProvider,
  familyRelationProvider: SharedDataProviders.familyRelationsProvider,
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
    order: 1,
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
  nationalRegistryProvider: ApplicationTemplateAPIAction
  userProfileProvider: ApplicationTemplateAPIAction
  familyRelationProvider: ApplicationTemplateAPIAction
  referenceProvider: ApplicationTemplateAPIAction
  anotherReferenceProvider: ApplicationTemplateAPIAction
}
