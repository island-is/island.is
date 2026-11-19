import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../types'

// IdentityApi looks up the applicant in Þjóðskrá, or in the company registry
// when a procuration holder applies for a company.
export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const EligibleVehiclesApi = defineTemplateApi({
  action: ApiActions.getEligibleVehicles,
})
