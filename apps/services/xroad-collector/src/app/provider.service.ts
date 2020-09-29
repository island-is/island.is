import { Provider } from '@island.is/api-catalogue/types'
import {
  MetaservicesApi,
  XroadIdentifier,
  XroadIdentifierIdObjectTypeEnum,
} from '../../gen/fetch-xrd'
import { ProviderType } from '@island.is/api-catalogue/consts'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ProviderService {
  constructor(private readonly xrdMetaService: MetaservicesApi) {}

  async getPrivateProviders(): Promise<Array<Provider>> {
    return this.getProviders(ProviderType.PRIVATE)
  }

  async getProtectedProviders(): Promise<Array<Provider>> {
    return this.getProviders(ProviderType.PROTECTED)
  }

  async getPublicProviders(): Promise<Array<Provider>> {
    return this.getProviders(ProviderType.PUBLIC)
  }

  private async getProviders(
    providerType: ProviderType,
  ): Promise<Array<Provider>> {
    let providers: Array<Provider> = []

    const xrdClients = await this.xrdMetaService.listClients({})

    if (xrdClients && xrdClients.member?.length > 0) {
      providers = xrdClients.member
        .filter((item: XroadIdentifier): boolean => {
          const memberCodeTokens = item.id.memberCode.split('-')
          return (
            item.id?.objectType === XroadIdentifierIdObjectTypeEnum.SUBSYSTEM &&
            Number(memberCodeTokens[1]) === providerType
          )
        })
        .map(
          (item: XroadIdentifier): Provider => {
            return {
              type: providerType,
              xroadInstance: item.id?.xroadInstance,
              memberClass: item.id?.memberClass,
              memberCode: item.id?.memberCode,
              subsystemCode: item.id?.subsystemCode,
            }
          },
        )
    }

    return providers
  }
}
