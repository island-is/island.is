import {
  ApplicationTypes,
  defineTemplateApi,
} from '@island.is/application/types'
import { NationalRegistryV3UserApi } from '@island.is/application/types'

export interface MyParameterType {
  id: number
}

// These app-specific actions are served by the existing (legacy)
// `ExampleInputsService`, which is registered under `EXAMPLE_INPUTS`. The
// `namespace` routes them to that service (serviceId === the legacy application
// type) instead of requiring a duplicate service for the SDF application type.
const NAMESPACE = ApplicationTypes.EXAMPLE_INPUTS

export const ReferenceDataApi = defineTemplateApi<MyParameterType>({
  action: 'getReferenceData',
  namespace: NAMESPACE,
  order: 2,
  params: {
    id: 12,
  },
})

export const runsFirst = defineTemplateApi({
  action: 'actionName',
  namespace: NAMESPACE,
  order: 1, // runs first
})

export const NationalRegistryApi = NationalRegistryV3UserApi.configure({
  order: 1,
})
