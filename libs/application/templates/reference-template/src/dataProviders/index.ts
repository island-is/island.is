import { defineTemplateApi } from '@island.is/application/types'
export { MockProviderApi } from '@island.is/application/types'
export interface MyParameterType {
  id: number
}

export const ReferenceDataApi = defineTemplateApi<MyParameterType>({
  action: 'getReferenceData',
  params: {
    id: 12,
  },
})

export const runsFirst = defineTemplateApi({
  action: 'actionName',
  order: 1, // runs first
})

export interface MyParameterType {
  id: number
}
