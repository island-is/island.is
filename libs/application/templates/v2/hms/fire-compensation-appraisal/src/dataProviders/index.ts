import {
  ApplicationTypes,
  defineTemplateApi,
  NationalRegistryV3UserApi,
} from '@island.is/application/types'

export { IdentityApi } from '@island.is/application/types'

// All fire-compensation-specific template APIs are served by the EXISTING
// (legacy) `FireCompensationAppraisalService`. The `namespace` routes the
// action to that service (serviceId === the legacy application type) instead of
// requiring a duplicate SDF service. See `getServiceId` in
// `template-api.service.ts`.
const NAMESPACE = ApplicationTypes.FIRE_COMPENSATION_APPRAISAL

export const NationalRegistryApi = NationalRegistryV3UserApi.configure({
  order: 1,
})

export const propertiesApi = defineTemplateApi({
  action: 'getProperties',
  namespace: NAMESPACE,
  order: 2,
})

// Replaces the legacy `PropertySearch` custom component: searches HMS for
// properties by address/property-code for the "apply for a property I do not
// own" flow. Triggered on demand via search field refetch.
export const SearchPropertiesApi = defineTemplateApi({
  action: 'searchProperties',
  namespace: NAMESPACE,
  order: 3,
})

// Replaces the legacy `FetchPropertiesByCodes` custom component: fetches the
// full property (incl. usage units / fire appraisal) by selected property code.
// Triggered via `onSelectRefetch` on the selected-property-code field.
export const FetchPropertiesByCodeApi = defineTemplateApi({
  action: 'fetchPropertiesByCode',
  namespace: NAMESPACE,
  order: 4,
})
