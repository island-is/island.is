import { SharedDataProviders } from '@island.is/application/core'
import {
  ApplicationTemplateAPIAction,
  NationalRegistryUser,
  PerformActionResult,
} from '@island.is/application/types'
import { ApiActions } from '../shared/constants'

export const ReferenceApplicationDataProviders = {
  nationalRegistryProvider: {
    ...SharedDataProviders.nationalRegistryProvider,
    order: 3,
  },
  userProfileProvider: SharedDataProviders.userProfileProvider,
  familyRelationProvider: SharedDataProviders.familyRelationsProvider,
  anotherReferenceProvider: {
    apiModuleAction: ApiActions.getAnotherReferenceData,
    externalDataId: 'anotherReference',
    shouldPersistToExternalData: true,
  },
  referenceProvider: {
    apiModuleAction: ApiActions.getReferenceData,
    externalDataId: 'reference',
    order: 1,
  },
} as ReferenceApplicationDataProviders

export interface ReferenceApplicationDataProviders {
  nationalRegistryProvider: ApplicationTemplateAPIAction
  userProfileProvider: ApplicationTemplateAPIAction
  familyRelationProvider: ApplicationTemplateAPIAction
  referenceProvider: ApplicationTemplateAPIAction
  anotherReferenceProvider: ApplicationTemplateAPIAction
}
