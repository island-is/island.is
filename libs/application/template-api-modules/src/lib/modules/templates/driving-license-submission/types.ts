import { Juristiction, NationalRegistryUser } from '@island.is/api/schema'
import { SuccessfulDataProviderResult } from '@island.is/application/core'

export interface ExternalDataNationalRegistry
  extends SuccessfulDataProviderResult {
  data?: NationalRegistryUser
}

export interface ExternalDataJuristiction extends SuccessfulDataProviderResult {
  data?: Juristiction
}
