import {
  NationalRegistryIndividual,
  SuccessfulDataProviderResult,
} from '@island.is/application/types'

interface IdentityResult extends SuccessfulDataProviderResult {
  data: NationalRegistryIndividual
}

export type ResidencePermitRenewalExternalData = {
  nationalRegistry?: IdentityResult
}
