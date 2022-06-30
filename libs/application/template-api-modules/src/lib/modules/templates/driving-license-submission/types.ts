import { SuccessfulDataProviderResult } from '@island.is/application/types'
import { Juristiction, NationalRegistryUser } from '@island.is/api/schema'

export interface ExternalDataNationalRegistry
  extends SuccessfulDataProviderResult {
  data?: NationalRegistryUser
}

export interface ExternalDataJuristiction extends SuccessfulDataProviderResult {
  data?: Juristiction
}
