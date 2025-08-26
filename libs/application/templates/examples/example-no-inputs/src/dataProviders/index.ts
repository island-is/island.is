import { defineTemplateApi } from '@island.is/application/types'
import { NationalRegistryUserApi } from '@island.is/application/types'
import { ApiActions } from '../utils/types'

export interface MyParameterType {
  id: number
}

export const ReferenceDataApi = defineTemplateApi<MyParameterType>({
  action: ApiActions.getReferenceData,
  order: 2,
  params: {
    id: 12,
  },
})

export const runsFirst = defineTemplateApi({
  action: 'actionName',
  order: 1, // runs first
})

export const EphemeralApi = defineTemplateApi({
  action: ApiActions.getAnotherReferenceData,
  shouldPersistToExternalData: false,
})

export const NationalRegistryApi = NationalRegistryUserApi.configure({
  order: 1,
})
