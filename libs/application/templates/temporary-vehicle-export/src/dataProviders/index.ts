import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../types'

export const EligibleVehiclesApi = defineTemplateApi({
  action: ApiActions.getEligibleVehicles,
})
