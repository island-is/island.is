import { Provider, Providers } from '@island.is/api-catalogue/types'
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

  async getProviders(): Promise<Providers> {
    const providers: Providers = { public: [], protected: [], private: [] }

    logger.info('Retrieving all providers')

    const xrdClients = await this.xrdMetaService.listClients({})

    if (xrdClients && xrdClients.member && xrdClients.member.length > 0) {
      const clientFilter = new RegExp('.*client$')
      for (const item of xrdClients.member) {
        //only interested in objects of type subsystem and do not end in "-client"
        //"-client should be used for consuming services in x-road"
        if (
          item.id?.objectType === XroadIdentifierIdObjectTypeEnum.SUBSYSTEM &&
          !clientFilter.test(item.id?.subsystemCode?.toLowerCase() ?? '')
        ) {
          let found = false
          //filter the providers based on type
          for (const type of Object.values(ProviderType)) {
            const filter = new RegExp(`.*${type}$`)
            if (filter.test(item.id?.subsystemCode?.toLowerCase() ?? '')) {
              providers[type].push(this.mapProvider(item, type))
              found = true
              break
            }
          }
          //located a subsystem that does not match naming convention, should be added to protected by default
          if (!found) {
            providers.protected.push(
              this.mapProvider(item, ProviderType.PROTECTED),
            )
          }
        }
      }
    }

    logger.info(
      `Filtered X-Road providers ${JSON.stringify(providers, null, 2)}`,
    )

    return providers
  }

  private mapProvider(item: XroadIdentifier, type: ProviderType): Provider {
    return {
      name: item.name ?? item.id!.subsystemCode!,
      type: type,
      xroadInfo: {
        instance: item.id?.xroadInstance ?? '',
        memberClass: item.id?.memberClass ?? '',
        memberCode: item.id?.memberCode ?? '',
        subsystemCode: item.id?.subsystemCode ?? '',
      },
    }
  }
}
