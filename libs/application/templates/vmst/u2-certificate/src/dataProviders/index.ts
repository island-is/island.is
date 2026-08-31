import { ApiActions } from '../utils/types'
import { defineTemplateApi } from '@island.is/application/types'

export const EligabilityApi = defineTemplateApi({
  action: ApiActions.getEligibility,
  externalDataId: 'eligibility',
})

export const EESCountriesApi = defineTemplateApi({
  action: ApiActions.getEESCountries,
  externalDataId: 'countries',
})
