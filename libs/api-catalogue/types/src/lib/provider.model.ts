import { ProviderType } from '@island.is/api-catalogue/consts'

export interface Provider {
  type: ProviderType
  xroadInstance: string
  memberClass: string
  memberCode: string
  subsystemCode: string
}
