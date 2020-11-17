import { Provider } from '@island.is/api-catalogue/types'
import {
  MetaservicesApi,
  XroadIdentifier,
  XroadIdentifierIdObjectTypeEnum,
} from '../../gen/fetch/xrd'
import { ProviderType } from '@island.is/api-catalogue/consts'
import { logger } from '@island.is/logging'
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

    logger.info(`Finding ${providerType} providers`)

    const filter = new RegExp(`.*${providerType}$`)
    const xrdClients = await this.xrdMetaService.listClients({})

    if (xrdClients && xrdClients.member && xrdClients.member.length > 0) {
      providers = xrdClients.member
        .filter((item: XroadIdentifier): boolean => {
          return (
            item.id?.objectType === XroadIdentifierIdObjectTypeEnum.SUBSYSTEM &&
            filter.test(item.id?.subsystemCode?.toLowerCase() ?? '')
          )
        })
        .map(
          (item: XroadIdentifier): Provider => {
            return {
              type: providerType,
              xroadInfo: {
                instance: item.id?.xroadInstance ?? '',
                memberClass: item.id?.memberClass ?? '',
                memberCode: item.id?.memberCode ?? '',
                subsystemCode: item.id?.subsystemCode ?? '',
              },
            }
          },
        )
    }

    logger.info(`Found ${providers.length} ${providerType} service providers`)

    return providers
  }
}
