import { defineTemplateApi } from '@island.is/application/types'

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

export const runsSecond = defineTemplateApi<MyParameterType>({
  // Has to match name of action in template API module
  action: 'actionName',
  // Sets the order in which this action should run
  order: 2, // Waits until "runsFirst" resolves.
  // (Optional) Id that will store the result inside application.externalData
  // Defaults to value of apiModuleAction
  externalDataId: 'someValue',
  // Used for shared providers that do not belong to an Applicaion
  // This value is passed to the super constructor of the extended BaseTemplateApiService containing the action defined
  namespace: 'SomeNamespace',
  //Parameters passed into the action, The parameters' type is set in the defineTemplateApi function call
  params: {
    id: 1,
  },
  // (Optional) Should the response/error be persisted to application.externalData
  // Defaults to true
  shouldPersistToExternalData: false,
  // (Optional) Should the state transition be blocked if this action errors out?
  // Will revert changes to answers/assignees/state
  // Defaults to true
  throwOnError: true,
})

export const overriddenApi = runsSecond.configure({
  externalDataId: '',
  order: 1,
  params: {},
  shouldPersistToExternalData: false,
  throwOnError: true,
})
