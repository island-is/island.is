import { ProviderType } from '@island.is/api-catalogue/consts'
import { XroadIdentifier } from './xroadIdentifier.model'

export interface Provider {
  name: string
  type: ProviderType
  xroadInfo: XroadIdentifier
}
export type Providers = {
  [type in ProviderType]: Array<Provider>
}

export const providerToString = (provider: Provider): string => {
  if (provider) {
    return `${provider.xroadInfo.instance}/${provider.xroadInfo.memberClass}/${provider.xroadInfo.memberCode}/${provider.xroadInfo.subsystemCode}`
  } else {
    return ''
  }
}
