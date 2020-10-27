import { ProviderType } from '@island.is/api-catalogue/consts'

export interface Provider {
  type: ProviderType
  xroadInstance: string
  memberClass: string
  memberCode: string
  subsystemCode: string
}

export namespace Provider {
  export function toString(provider: Provider): string {
    if (provider) {
      return `${provider.xroadInstance}/${provider.memberClass}/${provider.memberCode}/${provider.subsystemCode}`
    } else {
      return ''
    }
  }
}
